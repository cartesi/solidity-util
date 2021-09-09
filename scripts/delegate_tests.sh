#!/bin/bash

npx hardhat node --no-deploy >> /dev/null 2>&1 &
hardhat_pid=$!
sleep 3

## testing worker delegate

./worker/target/debug/worker_server_main >> /dev/null 2>&1 &
server_pid=$!
sleep 3

DELEGATE_TEST=1 npx hardhat test test/WorkerManagerAuthManagerImpl.ts --network localhost

# kill worker server
kill "$server_pid"

## end testing worker delegate

kill "$hardhat_pid"
