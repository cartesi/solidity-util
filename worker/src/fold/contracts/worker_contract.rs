pub use workermanagerauthmanagerimpl_mod::*;
#[allow(clippy::too_many_arguments)]
mod workermanagerauthmanagerimpl_mod {
    #![allow(dead_code)]
    #![allow(unused_imports)]
    use ethers::{
        contract::{
            self as ethers_contract,
            builders::{ContractCall, Event},
            Contract, Lazy,
        },
        core::{
            self as ethers_core,
            abi::{Abi, Detokenize, InvalidOutputType, Token, Tokenizable},
            types::*,
        },
        providers::{self as ethers_providers, Middleware},
    };
    #[doc = "WorkerManagerAuthManagerImpl was auto-generated with ethers-rs Abigen. More information at: https://github.com/gakonst/ethers-rs"]
    use std::sync::Arc;
    pub static WORKERMANAGERAUTHMANAGERIMPL_ABI: ethers_contract::Lazy<ethers_core::abi::Abi> =
        ethers_contract::Lazy::new(|| {
            serde_json :: from_str ("[{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"dapp\",\"type\":\"address\"}],\"name\":\"Authorization\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"dapp\",\"type\":\"address\"}],\"name\":\"Deauthorization\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"JobAccepted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"JobOffer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"JobRejected\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"worker\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"Retired\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"acceptJob\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_dappAddress\",\"type\":\"address\"}],\"name\":\"authorize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"cancelHire\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_dappAddress\",\"type\":\"address\"}],\"name\":\"deauthorize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"getOwner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"getUser\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"hire\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"_workerAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_dappAddress\",\"type\":\"address\"}],\"name\":\"hireAndAuthorize\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_dappAddress\",\"type\":\"address\"}],\"name\":\"isAuthorized\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"workerAddress\",\"type\":\"address\"}],\"name\":\"isAvailable\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"isOwned\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"workerAddress\",\"type\":\"address\"}],\"name\":\"isPending\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"isRetired\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"rejectJob\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address payable\",\"name\":\"_workerAddress\",\"type\":\"address\"}],\"name\":\"retire\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]") . expect ("invalid abi")
        });
    #[derive(Clone)]
    pub struct WorkerManagerAuthManagerImpl<M>(ethers_contract::Contract<M>);
    impl<M> std::ops::Deref for WorkerManagerAuthManagerImpl<M> {
        type Target = ethers_contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M: ethers_providers::Middleware> std::fmt::Debug for WorkerManagerAuthManagerImpl<M> {
        fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
            f.debug_tuple(stringify!(WorkerManagerAuthManagerImpl))
                .field(&self.address())
                .finish()
        }
    }
    impl<'a, M: ethers_providers::Middleware> WorkerManagerAuthManagerImpl<M> {
        #[doc = r" Creates a new contract instance with the specified `ethers`"]
        #[doc = r" client at the given `Address`. The contract derefs to a `ethers::Contract`"]
        #[doc = r" object"]
        pub fn new<T: Into<ethers_core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            let contract = ethers_contract::Contract::new(
                address.into(),
                WORKERMANAGERAUTHMANAGERIMPL_ABI.clone(),
                client,
            );
            Self(contract)
        }
        #[doc = "Calls the contract's `acceptJob` (0x9b789b7e) function"]
        pub fn accept_job(&self) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([155, 120, 155, 126], ())
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `authorize` (0x2bef4595) function"]
        pub fn authorize(
            &self,
            worker_address: ethers_core::types::Address,
            dapp_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([43, 239, 69, 149], (worker_address, dapp_address))
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `cancelHire` (0xb64b3bed) function"]
        pub fn cancel_hire(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([182, 75, 59, 237], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `deauthorize` (0x6d892f7e) function"]
        pub fn deauthorize(
            &self,
            worker_address: ethers_core::types::Address,
            dapp_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([109, 137, 47, 126], (worker_address, dapp_address))
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `getOwner` (0xfa544161) function"]
        pub fn get_owner(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ethers_core::types::Address> {
            self.0
                .method_hash([250, 84, 65, 97], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `getUser` (0x6f77926b) function"]
        pub fn get_user(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ethers_core::types::Address> {
            self.0
                .method_hash([111, 119, 146, 107], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `hire` (0xd9d6bd86) function"]
        pub fn hire(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([217, 214, 189, 134], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `hireAndAuthorize` (0xdbd96554) function"]
        pub fn hire_and_authorize(
            &self,
            worker_address: ethers_core::types::Address,
            dapp_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([219, 217, 101, 84], (worker_address, dapp_address))
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `isAuthorized` (0x65e4ad9e) function"]
        pub fn is_authorized(
            &self,
            worker_address: ethers_core::types::Address,
            dapp_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([101, 228, 173, 158], (worker_address, dapp_address))
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `isAvailable` (0x2896f60b) function"]
        pub fn is_available(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([40, 150, 246, 11], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `isOwned` (0xf4dc754b) function"]
        pub fn is_owned(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([244, 220, 117, 75], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `isPending` (0xa00745b6) function"]
        pub fn is_pending(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([160, 7, 69, 182], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `isRetired` (0x6d3c6275) function"]
        pub fn is_retired(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([109, 60, 98, 117], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `rejectJob` (0x03d6e81e) function"]
        pub fn reject_job(&self) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([3, 214, 232, 30], ())
                .expect("method not found (this should never happen)")
        }
        #[doc = "Calls the contract's `retire` (0x9e6371ba) function"]
        pub fn retire(
            &self,
            worker_address: ethers_core::types::Address,
        ) -> ethers_contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([158, 99, 113, 186], worker_address)
                .expect("method not found (this should never happen)")
        }
        #[doc = "Gets the contract's `Authorization` event"]
        pub fn authorization_filter(
            &self,
        ) -> ethers_contract::builders::Event<M, AuthorizationFilter> {
            self.0.event()
        }
        #[doc = "Gets the contract's `Deauthorization` event"]
        pub fn deauthorization_filter(
            &self,
        ) -> ethers_contract::builders::Event<M, DeauthorizationFilter> {
            self.0.event()
        }
        #[doc = "Gets the contract's `JobAccepted` event"]
        pub fn job_accepted_filter(
            &self,
        ) -> ethers_contract::builders::Event<M, JobAcceptedFilter> {
            self.0.event()
        }
        #[doc = "Gets the contract's `JobOffer` event"]
        pub fn job_offer_filter(&self) -> ethers_contract::builders::Event<M, JobOfferFilter> {
            self.0.event()
        }
        #[doc = "Gets the contract's `JobRejected` event"]
        pub fn job_rejected_filter(
            &self,
        ) -> ethers_contract::builders::Event<M, JobRejectedFilter> {
            self.0.event()
        }
        #[doc = "Gets the contract's `Retired` event"]
        pub fn retired_filter(&self) -> ethers_contract::builders::Event<M, RetiredFilter> {
            self.0.event()
        }
        #[doc = r" Returns an [`Event`](ethers_contract::builders::Event) builder for all events of this contract"]
        pub fn events(
            &self,
        ) -> ethers_contract::builders::Event<M, WorkerManagerAuthManagerImplEvents> {
            self.0.event_with_filter(Default::default())
        }
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(name = "Authorization", abi = "Authorization(address,address,address)")]
    pub struct AuthorizationFilter {
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub dapp: ethers_core::types::Address,
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(
        name = "Deauthorization",
        abi = "Deauthorization(address,address,address)"
    )]
    pub struct DeauthorizationFilter {
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub dapp: ethers_core::types::Address,
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(name = "JobAccepted", abi = "JobAccepted(address,address)")]
    pub struct JobAcceptedFilter {
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(name = "JobOffer", abi = "JobOffer(address,address)")]
    pub struct JobOfferFilter {
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(name = "JobRejected", abi = "JobRejected(address,address)")]
    pub struct JobRejectedFilter {
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
    }
    #[derive(Clone, Debug, Default, Eq, PartialEq, ethers_contract :: EthEvent)]
    #[ethevent(name = "Retired", abi = "Retired(address,address)")]
    pub struct RetiredFilter {
        #[ethevent(indexed)]
        pub worker: ethers_core::types::Address,
        #[ethevent(indexed)]
        pub user: ethers_core::types::Address,
    }
    #[derive(Debug, Clone, PartialEq, Eq)]
    pub enum WorkerManagerAuthManagerImplEvents {
        AuthorizationFilter(AuthorizationFilter),
        DeauthorizationFilter(DeauthorizationFilter),
        JobAcceptedFilter(JobAcceptedFilter),
        JobOfferFilter(JobOfferFilter),
        JobRejectedFilter(JobRejectedFilter),
        RetiredFilter(RetiredFilter),
    }
    impl ethers_core::abi::Tokenizable for WorkerManagerAuthManagerImplEvents {
        fn from_token(
            token: ethers_core::abi::Token,
        ) -> Result<Self, ethers_core::abi::InvalidOutputType>
        where
            Self: Sized,
        {
            if let Ok(decoded) = AuthorizationFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::AuthorizationFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = DeauthorizationFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::DeauthorizationFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = JobAcceptedFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobAcceptedFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = JobOfferFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobOfferFilter(decoded));
            }
            if let Ok(decoded) = JobRejectedFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobRejectedFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = RetiredFilter::from_token(token.clone()) {
                return Ok(WorkerManagerAuthManagerImplEvents::RetiredFilter(decoded));
            }
            Err(ethers_core::abi::InvalidOutputType(
                "Failed to decode all event variants".to_string(),
            ))
        }
        fn into_token(self) -> ethers_core::abi::Token {
            match self {
                WorkerManagerAuthManagerImplEvents::AuthorizationFilter(element) => {
                    element.into_token()
                }
                WorkerManagerAuthManagerImplEvents::DeauthorizationFilter(element) => {
                    element.into_token()
                }
                WorkerManagerAuthManagerImplEvents::JobAcceptedFilter(element) => {
                    element.into_token()
                }
                WorkerManagerAuthManagerImplEvents::JobOfferFilter(element) => element.into_token(),
                WorkerManagerAuthManagerImplEvents::JobRejectedFilter(element) => {
                    element.into_token()
                }
                WorkerManagerAuthManagerImplEvents::RetiredFilter(element) => element.into_token(),
            }
        }
    }
    impl ethers_core::abi::TokenizableItem for WorkerManagerAuthManagerImplEvents {}
    impl ethers_contract::EthLogDecode for WorkerManagerAuthManagerImplEvents {
        fn decode_log(log: &ethers_core::abi::RawLog) -> Result<Self, ethers_core::abi::Error>
        where
            Self: Sized,
        {
            if let Ok(decoded) = AuthorizationFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::AuthorizationFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = DeauthorizationFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::DeauthorizationFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = JobAcceptedFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobAcceptedFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = JobOfferFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobOfferFilter(decoded));
            }
            if let Ok(decoded) = JobRejectedFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::JobRejectedFilter(
                    decoded,
                ));
            }
            if let Ok(decoded) = RetiredFilter::decode_log(log) {
                return Ok(WorkerManagerAuthManagerImplEvents::RetiredFilter(decoded));
            }
            Err(ethers_core::abi::Error::InvalidData)
        }
    }
}
