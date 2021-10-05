require('dotenv').config()

const express = require('express')
const Binance = require('node-binance-api')
const { Webhook } = require('discord-webhook-node')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
})

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

app.get('/health', async (req, res) => res.json({ status: 'UP' }))

app.post('/webhook', async (req, res) => {
  const { exchange, passphrase, quantity = 0, side = 'buy', ticker } = req.body

  // Validation
  if (exchange !== 'BINANCE') {
    res.json({ code: 'error', message: 'Invalid exchange' })
    return
  }

  if (passphrase !== process.env.WEBHOOK_PASSPHRASE) {
    res.json({ code: 'error', message: 'Invalid passphrase' })
    return
  }

  // Buy
  if (side === 'buy') {
    try {
      console.info(`Sending order : Market Buy - ${ticker} ${quantity}`)
      await binance.marketBuy(ticker, quantity)
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
      console.info(`Sending order : Market Sell - ${ticker} ${quantity}`)
      await binance.marketSell(ticker, quantity)
      res.json({ code: 'success', message: 'order executed' })
    } catch (err) {
      console.error(`Error : ${err}`)
      hook.send(`Error : ${err.body}`)
      res.json({ code: 'error', message: err.body })
    }
  }

  hook.send(`Sending order : Market ${side} - ${ticker} ${quantity}`)
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))
