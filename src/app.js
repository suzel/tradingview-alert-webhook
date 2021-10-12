require('dotenv').config()

const axios = require('axios')
const express = require('express')
const Binance = require('node-binance-api')

const binanceAPI = axios.create({ baseURL: process.env.BINANCE_API_URL })

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
})

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/health', async (req, res) => res.json({ status: 'UP' }))

app.post('/webhook', async (req, res) => {
  const order = req.body

  // Validation
  if (!['BINANCE', 'NASDAQ', 'NYSE'].includes(order.exchange)) {
    res.json({ code: 'error', message: 'Invalid exchange' })
    return
  }

  if (order.passphrase !== process.env.WEBHOOK_PASSPHRASE) {
    res.json({ code: 'error', message: 'Invalid passphrase' })
    return
  }

  const ticker = order.ticker
  const action = order.strategy.order_action
  const quantity = order.strategy.position_size

  console.info(`Sending order : Market ${action} - ${ticker} ${quantity}`)

  switch (action) {
    case 'buy':
      binance.marketBuy(ticker, quantity, resultHandler)
      break
    case 'sell':
      binance.marketSell(ticker, quantity, resultHandler)
      break
  }

  const resultHandler = (error, response) => {
    res.json({
      code: error ? 'error' : 'success',
      message: 'order executed:' + response.orderId,
    })
  }
})

const roundStep = async (ticker, price) => {
  const [bookTicker, exchangeInfo] = await Promise.all([
    binanceAPI.get(`/ticker/bookTicker?symbol=${ticker}`),
    binanceAPI.get(`/exchangeInfo?symbol=${ticker}`),
  ])
  const stepSize = exchangeInfo.data.symbols[0].filters.filter(
    (i) => i.filterType === 'LOT_SIZE'
  )[0].stepSize
  const qty = price / bookTicker.data.askPrice
  return binance.roundStep(qty, stepSize)
}

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
