const {
    getAccounts,
    getBalance
} = require('./ethNetwork')

const createPollContract = require('./pollContract')

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

app.get('/api/balances', async (req, res) => {
  const balances = {}
  for (let index = 0; index < accounts.length; index++) {
    const address = accounts[index]
    balances[address] = await getBalance(address)
  }
  res.json(balances)
})

app.get('/api/started', async (req, res) => {
  const started = await contract.isStarted()
  res.json(started)
})

app.get('/api/result', async (req, res) => {
  const result = await contract.getResult()
  res.json(result)
})

app.post('/api/start', async (req, res) => {
  const started = await contract.isStarted()
  const from = req.get(ADDRESS_HEADER_NAME)
  if (!started) {
    await contract.start(from)
  }
  res.json('Poll Started')
})

app.post('/api/stop', async (req, res) => {
  const started = await contract.isStarted()
  const from = req.get(ADDRESS_HEADER_NAME)
  if (started) {
    await contract.stop(from)
  }
  res.json('Poll Stopped')
})

app.post('/api/vote/', async (req, res) => {
  const from = req.get(ADDRESS_HEADER_NAME)
  const started = await contract.isStarted()
  if (started) {
    const value = req.body === 'true'
    await contract.vote(from, value)
  }
  res.json('Vote Casted')
})

const boot = async () => {
  contract = await createPollContract()
  accounts = await getAccounts()
  await startServer(app)
  console.log('Example app listening on port 3000!')
}

boot()
