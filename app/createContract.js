const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const getAddress = async (artifact) => {
  const network = await web3.eth.net.getId()
  return artifact.networks[network].address
}

const createContract = async (artifact) => {
  const address = await getAddress(artifact)
  const contract = new web3.eth.Contract(artifact.abi, address)
  return contract
}

module.exports = createContract
