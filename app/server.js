const pollArtifact = require('../build/contracts/Poll.json')
const {
    createContract,
    getAccounts,
    getBalance
} = require('./ethNetwork')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const ADDRESS_HEADER_NAME = 'X-ETH-ADDRESS'

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.text())

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

app.get('/api/result', async (req, res) => {
  const result = await contract.methods.result().call()
  res.json(result)
})

app.get('/api/balances', async (req, res) => {
  const balances = {}
  for (let index = 0; index < accounts.length; index++) {
    const address = accounts[index]
    balances[address] = await getBalance(address)
  }
  res.json(balances)
})

app.post('/api/start', async (req, res) => {
  const started = await contract.methods.started().call()
  const from = req.get(ADDRESS_HEADER_NAME)
  if (!started) {
    await contract.methods.start().send({from})
  }
  res.json('Poll Started')
})

app.post('/api/stop', async (req, res) => {
  const started = await contract.methods.started().call()
  const from = req.get(ADDRESS_HEADER_NAME)
  if (started) {
    contract.methods.stop().send({from})
  }
  res.json('Poll Stopped')
})

app.post('/api/vote/', async (req, res) => {
  const from = req.get(ADDRESS_HEADER_NAME)
  const started = await contract.methods.started().call()
  if (started) {
    contract.methods.vote(req.body === 'true').send({from})
  }
  res.json('Vote Casted')
})

const boot = async () => {
  contract = await createContract(pollArtifact)
  accounts = await getAccounts()
  await startServer(app)
  console.log('Example app listening on port 3000!')
}

boot()
