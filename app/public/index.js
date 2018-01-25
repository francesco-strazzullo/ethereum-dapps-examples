import poll from './poll.js'

const generateBalances = () => {
  const balancesList = document.querySelector('[role="balances"]')
  balancesList.innerHTML = ''
  const balanceRowTemplate = document.querySelector('#balanceRow')
  poll.getBalances().then(balances => {
    Object.keys(balances).forEach(address => {
      const balanceRow = document.importNode(balanceRowTemplate.content, true)
      balanceRow
        .querySelector('[role="address"]')
        .innerText = address

      balanceRow
        .querySelector('[role="balance"]')
        .innerText = `${balances[address]} WEI`

      balanceRow
        .querySelector('[role="start"]')
        .addEventListener('click', () => poll.start(address))

      balanceRow
        .querySelector('[role="stop"]')
        .addEventListener('click', () => poll.stop(address))

      balanceRow
        .querySelector('[role="yes"]')
        .addEventListener('click', () => poll.vote(address, true))

      balanceRow
        .querySelector('[role="no"]')
        .addEventListener('click', () => poll.vote(address, false))

      balancesList.appendChild(balanceRow)
    })
  })
}

const generateDashboard = () => {
  poll.isStarted().then(started => {
    document.querySelector('[role="status"]').innerText = started ? 'Started' : 'Not started'
  })

  poll.getResult().then(result => {
    let resultLabel = 'Draw'
    if (result === '1') {
      resultLabel = 'Yes'
    }

    if (result === '2') {
      resultLabel = 'No'
    }
    document.querySelector('[role="result"]').innerText = resultLabel
  })
}

const render = () => {
  generateBalances()
  generateDashboard()
}

render()

document.querySelector('[role="refresh"]').addEventListener('click', () => render())
