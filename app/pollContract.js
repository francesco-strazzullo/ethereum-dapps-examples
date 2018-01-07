const pollArtifact = require('../build/contracts/Poll.json')
const {
    createContract
} = require('./ethNetwork')

const create = async () => {
  const contract = await createContract(pollArtifact)

  const isStarted = async () => {
    const started = await contract.methods.started().call()
    return started
  }

  const getResult = async () => {
    const result = await contract.methods.result().call()
    return result
  }

  const start = async (from) => {
    await contract.methods.start().send({from})
  }

  const stop = async (from) => {
    await contract.methods.stop().send({from})
  }

  const vote = async(from, value) => {
    await contract.methods.vote(Boolean(value)).send({from})
  }

  return {
    isStarted,
    getResult,
    start,
    stop,
    vote
  }
}

module.exports = create
