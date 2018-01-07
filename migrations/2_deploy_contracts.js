const SimpleStorage = artifacts.require('./SimpleStorage.sol')
const Poll = artifacts.require('./Poll.sol')

module.exports = deployer => {
  deployer.deploy(SimpleStorage)
  deployer.deploy(Poll)
}
