use super::fold::contracts::worker_contract;

use crate::worker_lib::WorkerStatus;

use block_subscriber::NewBlockSubscriber;
use tx_manager::{
    error::TxConversionError,
    types::{ProviderFactory, ResubmitStrategy, Transaction, TransferValue},
    TransactionManager,
};

use ethers::providers::Middleware;
use ethers::types::Address;
use std::sync::Arc;

impl WorkerStatus {
    pub async fn react<M, PF, BS>(
        &self,
        worker_address: Address,
        worker_manager_address: Address,
        client: Arc<M>,
        transaction_manager: &TransactionManager<PF, BS, String>,
    ) -> std::result::Result<(), TxConversionError>
    where
        M: Middleware,
        PF: ProviderFactory + Send + Sync + 'static,
        BS: NewBlockSubscriber + Send + Sync + 'static,
    {
        let contract =
            worker_contract::WorkerManagerAuthManagerImpl::new(worker_manager_address, client);

        match self {
            WorkerStatus::Pending(user_address) => {
                let tx = contract.accept_job();

                transaction_manager
                    .send_transaction(
                        format!("{}_accept_{}", worker_address, user_address),
                        tx.from(worker_address),
                        ResubmitStrategy {
                            gas_multiplier: None,
                            gas_price_multiplier: None,
                            rate: 10,
                        },
                        1,
                    )
                    .await?;
            }
            WorkerStatus::Retired(user_address) => {
                let tx = Transaction {
                    from: worker_address,
                    to: *user_address,
                    value: TransferValue::All,
                    call_data: None,
                };

                transaction_manager
                    .send_transaction(
                        format!("{}_retire_{}", worker_address, user_address),
                        tx,
                        ResubmitStrategy {
                            gas_multiplier: None,
                            gas_price_multiplier: None,
                            rate: 10,
                        },
                        1,
                    )
                    .await?;
            }
            _ => {}
        }

        Ok(())
    }
}
