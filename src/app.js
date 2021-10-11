require('dotenv').config()

const express = require('express')
const Binance = require('node-binance-api')
const { Webhook } = require('discord-webhook-node')
const axios = require('axios')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
})

binance.balance((error, balances) => {
  if (error) return console.error(error)
  app.locals.balances = balances
  return balances
})

const getStepSize = async (symbol) => {
  const resp = await axios.get(
    `https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`
  )
  const data = resp.data.symbols[0].filters.filter(
    (i) => i.filterType === 'LOT_SIZE'
  )
  return data[0].stepSize
}

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

app.get('/health', async (req, res) => res.json({ status: 'UP' }))

app.post('/webhook', async (req, res) => {
  const order = req.body

  // Validation
  if (order.exchange !== 'BINANCE') {
    res.json({ code: 'error', message: 'Invalid exchange' })
    return
  }

  if (order.passphrase !== process.env.WEBHOOK_PASSPHRASE) {
    res.json({ code: 'error', message: 'Invalid passphrase' })
    return
  }

  const ticker = order.ticker
  let qty = 1
  const price = 50

  // Buy
  if (order.strategy.order_action === 'buy') {
    try {
      const tickers = await binance.bookTickers(ticker)
      const stepSize = await getStepSize(ticker)
      qty = price / tickers.askPrice
      qty = binance.roundStep(qty, stepSize)
      console.info(`Sending order : Market Buy - ${ticker} ${qty}`)
      hook.send(`Sending order : Market Buy - ${ticker} ${qty}`)
      await binance.marketBuy(ticker, qty)
      res.json({ code: 'success', message: 'order executed' })
    } catch (err) {
      console.error(`Error : ${err}`)
      hook.send(`Error : ${err.body}`)
      res.json({ code: 'error', message: err.body })
    }
  }

  // Sell
  if (order.strategy.order_action === 'sell') {
    try {
      qty = app.locals.balances[ticker.replace('USDT', '')].available
      console.info(`Sending order : Market Sell - ${ticker} ${qty}`)
      hook.send(`Sending order : Market Sell - ${ticker} ${qty}`)
      await binance.marketSell(ticker, qty)
      res.json({ code: 'success', message: 'order executed' })
    } catch (err) {
      console.error(`Error : ${err}`)
      hook.send(`Error : ${err.body}`)
      res.json({ code: 'error', message: err.body })
    }
  }

  // Update Balances
  app.locals.balances = await binance.balance()
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
