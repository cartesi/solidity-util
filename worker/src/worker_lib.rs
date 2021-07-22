use ethers::types::Address;

#[derive(Clone, Debug)]
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
