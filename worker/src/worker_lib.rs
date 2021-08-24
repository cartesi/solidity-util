use ethers::types::Address;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum WorkerStatus {
    Available,
    Pending(Address),
    Owned(Address),
    Retired(Address),
}

impl std::fmt::Display for WorkerStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Worker status: {:?}", self)
    }
}
