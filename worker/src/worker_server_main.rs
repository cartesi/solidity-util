#![warn(unused_extern_crates)]
use state_fold::{Access, StateFold};
use state_server_grpc::{serve_delegate_manager, wait_for_signal};

use ethers::providers::{Http, Provider};
use ethers::types::U64;
use std::convert::TryFrom;
use std::sync::Arc;
use tokio::sync::oneshot;

static HTTP_URL: &'static str = "http://localhost:8545";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider = Arc::new(Provider::<Http>::try_from(HTTP_URL).unwrap());

    let access = Access::new(Arc::clone(&provider), U64::from(0), vec![], 4);

    let worker_delegate =
        worker::fold::worker_delegate::WorkerFoldDelegate::new();
    let worker_fold = StateFold::new(worker_delegate, Arc::new(access), 0);

    let (shutdown_tx, shutdown_rx) = oneshot::channel();

    let _ = tokio::spawn(wait_for_signal(shutdown_tx));

    serve_delegate_manager(
        "[::1]:50051",
        worker::worker_server::WorkerDelegateManager { fold: worker_fold },
        shutdown_rx,
    )
    .await
}
