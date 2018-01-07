const SimpleStorage = artifacts.require('./SimpleStorage.sol')

contract('SimpleStorage', () => {
  let contract

  beforeEach(async () => {
    contract = await SimpleStorage.new()
  })
  it("'get' method should return 0 if no setter is invoked", async () => {
    const value = await contract.get()
    assert.equal(value.valueOf(), 0)
  })

  it("'get' method should return the setted if setter is invoked", async () => {
    await contract.set(1)
    const value = await contract.get()
    assert.equal(value.valueOf(), 1)
  })

  it('ValueSet event should be emitted when the setter is invoked', async () => {
    const valueSetWatcher = contract.ValueSet()
    await contract.set(1)
    const events = await valueSetWatcher.get()
    assert.equal(events.length, 1)
    assert.equal(events[0].args.newValue.valueOf(), 1)
  })
})
