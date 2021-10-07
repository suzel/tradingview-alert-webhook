require('dotenv').config()

const express = require('express')
const Binance = require('node-binance-api')
const { Webhook } = require('discord-webhook-node')
const mins = require('./mins.json')

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

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

app.get('/health', async (req, res) => res.json({ status: 'UP' }))

app.post('/webhook', async (req, res) => {
  const {
    exchange,
    passphrase,
    price = 0,
    quantity = 0,
    side = 'buy',
    ticker,
  } = req.body

  // Validation
  if (exchange !== 'BINANCE') {
    res.json({ code: 'error', message: 'Invalid exchange' })
    return
  }

  if (passphrase !== process.env.WEBHOOK_PASSPHRASE) {
    res.json({ code: 'error', message: 'Invalid passphrase' })
    return
  }

  hook.send(`Sending order : Market ${side} - ${ticker} ${quantity}`)

  // Buy
  if (side === 'buy') {
    try {
      let qty = quantity
      if (price) {
        const tickers = await binance.bookTickers(ticker)
        qty = price / tickers.askPrice
        qty = binance.roundStep(qty, mins[ticker].stepSize)
      }
      console.info(`Sending order : Market Buy - ${ticker} ${qty}`)
      await binance.marketBuy(ticker, qty)
      res.json({ code: 'success', message: 'order executed' })
    } catch (err) {
      console.error(`Error : ${err}`)
      hook.send(`Error : ${err.body}`)
      res.json({ code: 'error', message: err.body })
    }
  }

  // Sell
  if (side === 'sell') {
    try {
      const qty = app.locals.balances[ticker.replace('USDT', '')].available
      console.info(`Sending order : Market Sell - ${ticker} ${qty}`)
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
