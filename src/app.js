require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const Binance = require('node-binance-api')

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const binance = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET
})

app.get('/', (req, res) => res.send('Tradingview Webhooks'))

app.post('/webhook', (req, res) => {

    const params = req.body

    // Validation
    if (params.passphrase != process.env.WEBHOOK_PASSPHRASE) {
        res.json({ 'code': 'error', 'message': 'Nice try, invalid passphrase' })
        return
    }

    const side = params.order_action
    const quantity = params.order_contracts
    const ticker = params.ticker

    // Sending order {order_type} - {side} {quantity} {symbol}
    // symbol=symbol, side=side, type=order_type, quantity=quantity
    if (side == 'buy') {
        binance.marketBuy(ticker, quantity)
        res.json({ 'code': 'success', 'message': 'order executed' })
    }

    if (side == 'sell') {
        binance.marketSell(ticker, quantity)
        res.json({ 'code': 'success', 'message': 'order executed' })
    }

    // Order failed
    // an exception occured
    // res.json({ 'code': 'error', 'message': 'order failed' })
    // res.sendStatus(200)

})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))