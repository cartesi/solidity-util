use crate::worker_lib::WorkerStatus;

use super::contracts::worker_contract;

use offchain_core::types::Block;
use state_fold::{
    delegate_access::{FoldAccess, SyncAccess},
    error::*,
    types::*,
    utils as fold_utils,
};

use async_trait::async_trait;
use ethers::types::Address;
use snafu::ResultExt;

/// Worker state, to be passed to and returned by fold.
#[derive(Clone, Debug)]
pub struct WorkerState {
    pub status: WorkerStatus,
}

/// Worker StateFold Delegate, which implements `sync` and `fold`.
pub struct WorkerFoldDelegate {
    worker_manager_address: Address,
    worker_address: Address,
}

impl WorkerFoldDelegate {
    pub fn new(
        worker_manager_address: Address,
        worker_address: Address,
    ) -> Self {
        WorkerFoldDelegate {
            worker_manager_address,
            worker_address,
        }
    }
}

#[async_trait]
impl StateFoldDelegate for WorkerFoldDelegate {
    type InitialState = ();
    type Accumulator = WorkerState;
    type State = BlockState<Self::Accumulator>;

    async fn sync<A: SyncAccess + Send + Sync>(
        &self,
        _initial_state: &Self::InitialState,
        block: &Block,
        access: &A,
    ) -> SyncResult<Self::Accumulator, A> {
        let contract = access
            .build_sync_contract(
                self.worker_manager_address,
                block.number,
                worker_contract::WorkerManagerAuthManagerImpl::new,
            )
            .await;

        // get last worker status transition event
        let events = contract
            .events()
            .topic1(self.worker_address)
            .query()
            .await
            .context(SyncContractError {
                err: "Error querying for worker events",
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

        Ok(WorkerState {
            status: compute_state(last_event, WorkerStatus::Available),
        })
    }

    async fn fold<A: FoldAccess + Send + Sync>(
        &self,
        previous_state: &Self::Accumulator,
        block: &Block,
        access: &A,
    ) -> FoldResult<Self::Accumulator, A> {
        // Check if there was (possibly) some log emited on this block.
        let bloom = block.logs_bloom;
        if !(fold_utils::contains_address(&bloom, &self.worker_manager_address)
            && fold_utils::contains_topic(&bloom, &self.worker_address))
        {
            return Ok(previous_state.clone());
        }

        let contract = access
            .build_fold_contract(
                self.worker_manager_address,
                block.hash,
                worker_contract::WorkerManagerAuthManagerImpl::new,
            )
            .await;

        // get last status transition event
        let events = contract
            .events()
            .topic1(self.worker_address)
            .query()
            .await
            .context(FoldContractError {
                err: "Error querying for worker events",
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

        Ok(WorkerState {
            status: compute_state(last_event, previous_state.status.clone()),
        })
    }

    fn convert(&self, state: &BlockState<Self::Accumulator>) -> Self::State {
        state.clone()
    }
}

/// Computes the state from the last event emission
fn compute_state(
    last_event: Option<worker_contract::WorkerManagerAuthManagerImplEvents>,
    previous_status: WorkerStatus,
) -> WorkerStatus {
    match last_event {
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
    }
}
