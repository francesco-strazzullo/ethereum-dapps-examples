const pollArtifact = require('../build/contracts/Poll.json')
const createContract = require('./createContract')

const express = require('express')
const app = express()

let contract

const startServer = app => new Promise((resolve, reject) => {
  app.listen(3000, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

app.get('/started', async (req, res) => {
  const started = await contract.methods.started().call()
  res.json(started)
})

const boot = async () => {
  contract = await createContract(pollArtifact)
  await startServer(app)
  console.log('Example app listening on port 3000!')
}

boot()
