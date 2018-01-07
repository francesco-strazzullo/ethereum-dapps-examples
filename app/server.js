const pollArtifact = require('../build/contracts/Poll.json')
const {
    createContract,
    getAccounts,
    getBalance
} = require('./ethNetwork')

const express = require('express')
const app = express()
const path = require('path')

app.use('/', express.static(path.join(__dirname, 'public')))

let contract
let accounts

const startServer = app => new Promise((resolve, reject) => {
  app.listen(3000, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

app.get('/api/started', async (req, res) => {
  const started = await contract.methods.started().call()
  res.json(started)
})

app.get('/api/balances', async (req, res) => {
  const balances = {}
  for (let index = 0; index < accounts.length; index++) {
    const address = accounts[index]
    balances[address] = await getBalance(address)
  }
  res.json(balances)
})

app.get('/api/start', async (req, res) => {
  const started = await contract.methods.started().call()
  if (!started) {
    await contract.methods.start().send({from: accounts[0]})
  }
  res.json('Poll Started')
})

app.get('/api/stop', async (req, res) => {
  const started = await contract.methods.started().call()
  if (started) {
    contract.methods.stop().send({from: accounts[0]})
  }
  res.json('Poll Stopped')
})

const boot = async () => {
  contract = await createContract(pollArtifact)
  accounts = await getAccounts()
  await startServer(app)
  console.log('Example app listening on port 3000!')
}

boot()
