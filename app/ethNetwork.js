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

const getAccounts = () => new Promise((resolve, reject) => {
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      reject(err)
    } else {
      resolve(accounts)
    }
  })
})

const getBalance = address => new Promise((resolve, reject) => {
  web3.eth.getBalance(address, (err, balance) => {
    if (err) {
      reject(err)
    } else {
      resolve(balance)
    }
  })
})

module.exports = {
  createContract,
  getAccounts,
  getBalance
}
