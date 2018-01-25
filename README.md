# ethereum-dapps-examples

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/francesco-strazzullo/ethereum-dapps-examples.svg?branch=master)](https://travis-ci.org/francesco-strazzullo/ethereum-dapps-examples)

Example of DApps with Solidity and Truffle: A small Poll system

## Test

To launch unit test on the truffle test network just type

    npm test

## Run

To run the application launch ganache-cli with the following command

    npm run testrpc

Then deploy the Poll Smart contracts to the blockchain with the command

    npm run deploy-contracts

At last start with the application

    npm start

And navigate to http://localhost:3000