const Poll = artifacts.require('./Poll.sol')

const getAccounts = () => new Promise((resolve, reject) => {
  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      reject(err)
    } else {
      resolve(accounts)
    }
  })
})

const RESULT_TYPES = {
  DRAW: 0,
  FAVORABLE: 1,
  NOT_FAVORABLE: 2
}

contract('Poll', () => {
  let owner
  let contract
  let firstVoter
  let secondVoter

  beforeEach(async () => {
    owner = (await getAccounts())[0]
    firstVoter = (await getAccounts())[1]
    secondVoter = (await getAccounts())[2]
    contract = await Poll.new({ from: owner })
  })

  it('only the owner should be able to start the poll', async () => {
    let started = await contract.started()
    assert.equal(started, false)

    const notTheOwner = (await getAccounts())[1]

    await contract.start({ from: notTheOwner })
    started = await contract.started()
    assert.equal(started, false)

    await contract.start({ from: owner })
    started = await contract.started()
    assert.equal(started, true)
  })

  it('only the owner should be able to stop the poll', async () => {
    await contract.start({ from: owner })
    let started = await contract.started()
    assert.equal(started, true)

    const notTheOwner = (await getAccounts())[1]

    await contract.stop({ from: notTheOwner })
    started = await contract.started()
    assert.equal(started, true)

    await contract.stop({ from: owner })
    started = await contract.started()
    assert.equal(started, false)
  })

  it("should return 'DRAW' if each side has the same number of votes", async () => {
    await contract.start({ from: owner })

    contract.vote(true, { from: firstVoter })
    contract.vote(false, { from: secondVoter })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.DRAW)
  })

  it("should return 'FAVORABLE' if the favorable side has the majority of the votes", async () => {
    await contract.start({ from: owner })

    contract.vote(true, { from: firstVoter })
    contract.vote(true, { from: secondVoter })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.FAVORABLE)
  })

  it("should return 'NOT_FAVORABLE' if the favorable side has the majority of the votes", async () => {
    await contract.start({ from: owner })

    contract.vote(false, { from: firstVoter })
    contract.vote(false, { from: secondVoter })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.NOT_FAVORABLE)
  })

  it('vote casted after the poll end should not be counted', async () => {
    await contract.start({ from: owner })

    contract.vote(true, { from: firstVoter })
    contract.vote(false, { from: secondVoter })

    await contract.stop({ from: owner })

    contract.vote(true, { from: secondVoter })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.DRAW)
  })

  it('should not count more than one vote from the same address', async () => {
    await contract.start({ from: owner })

    contract.vote(true, { from: firstVoter })
    contract.vote(false, { from: secondVoter })
    contract.vote(true, { from: secondVoter })

    const result = await contract.result()

    assert.equal(result.valueOf(), RESULT_TYPES.DRAW)
  })
})
