use crate::worker_lib::WorkerStatus;

use super::contracts::worker_contract;

use offchain_core::types::Block;
use state_fold::{
    utils as fold_utils, FoldMiddleware, Foldable, StateFoldEnvironment,
    SyncMiddleware,
};

use async_trait::async_trait;
use ethers::providers::Middleware;
use ethers::types::Address;
use snafu::ResultExt;
use snafu::Snafu;
use std::sync::Arc;

#[derive(Debug, Snafu)]
#[snafu(visibility = "pub")]
pub enum WorkerError {
    #[snafu(display("Middleware error `{}`: {} ", source, err))]
    WorkerUnavailable {
        source: Box<dyn std::error::Error>,
        err: String,
    },
}

/// Worker state, to be passed to and returned by fold.
#[derive(Clone, Debug)]
pub struct WorkerState {
    pub worker_manager_address: Address,
    pub status: WorkerStatus,
    pub worker_address: Address,
}

#[async_trait]
impl Foldable for WorkerState {
    type InitialState = (Address, Address);
    type Error = WorkerError;

    async fn sync<M: Middleware + 'static>(
        initial_state: &Self::InitialState,
        _block: &Block,
        _env: &StateFoldEnvironment<M>,
        access: Arc<SyncMiddleware<M>>,
    ) -> std::result::Result<Self, Self::Error> {
        let (worker_address, worker_manager_address) = *initial_state;

        compute_state(
            access,
            WorkerStatus::Available,
            worker_address,
            worker_manager_address,
        )
        .await
    }

    async fn fold<M: Middleware + 'static>(
        previous_state: &Self,
        block: &Block,
        _env: &StateFoldEnvironment<M>,
        access: Arc<FoldMiddleware<M>>,
    ) -> std::result::Result<Self, Self::Error> {
        let worker_address = previous_state.worker_address;
        let worker_manager_address = previous_state.worker_manager_address;

        // Check if there was (possibly) some log emited on this block.
        let bloom = block.logs_bloom;
        if !(fold_utils::contains_address(&bloom, &worker_manager_address)
            && fold_utils::contains_topic(&bloom, &worker_address))
        {
            return Ok(previous_state.clone());
        }

        compute_state(
            access,
            previous_state.status.clone(),
            worker_address,
            worker_manager_address,
        )
        .await
    }
}

/// Computes the state from the last event emission
async fn compute_state<M: Middleware + 'static>(
    access: Arc<M>,
    previous_status: WorkerStatus,
    worker_address: Address,
    worker_manager_address: Address,
) -> std::result::Result<WorkerState, WorkerError> {
    let contract = worker_contract::WorkerManagerAuthManagerImpl::new(
        worker_manager_address,
        access,
    );

    // get last status transition event
    let events = contract
        .events()
        .topic1(worker_address)
        .query()
        .await
        .map_err(|e| e.into())
        .context(WorkerUnavailable {
            err: format!("Error querying for worker events"),
        })?;

    let last_event = events
        .into_iter()
        .filter(|e| match e {
            // filter out the AuthManager events
            worker_contract::WorkerManagerAuthManagerImplEvents::AuthorizationFilter(_)
            | worker_contract::WorkerManagerAuthManagerImplEvents::DeauthorizationFilter(_) => {
                false
            }
            _ => true,
        })
        .last()
        .map(|t| t.clone());

    let status = match last_event {
        // no relevant event
        None => previous_status,
        Some(event) => match event {
            worker_contract::WorkerManagerAuthManagerImplEvents::JobAcceptedFilter(e) => {
                WorkerStatus::Owned(e.user)
            }
            worker_contract::WorkerManagerAuthManagerImplEvents::JobOfferFilter(e) => {
                WorkerStatus::Pending(e.user)
            }
            worker_contract::WorkerManagerAuthManagerImplEvents::JobRejectedFilter(_) => {
                WorkerStatus::Available
            }
            worker_contract::WorkerManagerAuthManagerImplEvents::RetiredFilter(e) => {
                WorkerStatus::Retired(e.user)
            }
            // shoudn't get here, authenticator events should be filter out already
            _ => previous_status,
        },
    };

    Ok(WorkerState {
        status,
        worker_address,
        worker_manager_address,
    })
}
