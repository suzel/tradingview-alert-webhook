require('dotenv').config()
const express = require('express')
const Binance = require('node-binance-api')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET
})

app.get('/', async (req, res) => res.send('Tradingview Webhooks'))

app.post('/webhook', async (req, res) => {

  let { exchange, passphrase, quantity = 0, side = 'buy', ticker, capital = 0 } = req.body

  // Validation
  if (exchange != 'BINANCE') {
    res.json({ 'code': 'error', 'message': 'Invalid exchange' })
    return
  }

  if (passphrase != process.env.WEBHOOK_PASSPHRASE) {
    res.json({ 'code': 'error', 'message': 'Invalid passphrase' })
    return
  }

  if (quantity == 0) {
    const price = await binance.prices(ticker)
    quantity = parseFloat(capital) / parseFloat(price[ticker])
  }

  console.info(`Sending order : Market - ${side} ${quantity} ${ticker}`)

  // Buy
  if (side == 'buy') {
    try {
      const result = await binance.marketBuy(ticker, quantity)
      res.json({ 'code': 'success', 'message': 'order executed' })
    } catch (err) {
      res.json({ 'code': 'error', 'message': err.body })
    }
  }

  // Sell
  if (side == 'sell') {
    try {
      const result = await binance.marketSell(ticker, quantity)
      res.json({ 'code': 'success', 'message': 'order executed' })
    } catch (err) {
      res.json({ 'code': 'error', 'message': err.body })
    }
  }

})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
