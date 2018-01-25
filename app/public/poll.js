import http from '/http.js'

const ADDRESS_HEADER_NAME = 'X-ETH-ADDRESS'

const createAddressHeaders = address => new window.Headers({
  [ADDRESS_HEADER_NAME]: address
})

const isStarted = () => http.get('/api/started')
const getBalances = () => http.get('/api/balances')
const getResult = () => http.get('/api/result')
const start = (address) => http.post('/api/start', undefined, {headers: createAddressHeaders(address)})
const stop = (address) => http.post('/api/stop', undefined, {headers: createAddressHeaders(address)})
const vote = (address, vote) => http.post('/api/vote', vote, {headers: createAddressHeaders(address)})

export default {
  isStarted,
  getBalances,
  getResult,
  start,
  stop,
  vote
}
