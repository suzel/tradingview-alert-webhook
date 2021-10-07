# Tradingview Alert Webhook

TradingView Strategy Alert Webhook that buys and sells crypto with the Binance API.

## Project URL

- https://tradingview.sukruuzel.com/webhook/

## Payload

### Buy

```json
{
  "passphrase": "suzel",
  "time": "",
  "exchange": "BINANCE",
  "side": "buy",
  "ticker": "ROSEUSDT",
  "price": 20
}
```

### Sell

```json
{
  "passphrase": "suzel",
  "time": "",
  "exchange": "BINANCE",
  "side": "sell",
  "ticker": "ROSEUSDT"
}
```

### Template

```json
{
  "type": "Market",
  "side": "Buy",
  "amount": "10",
  "symbol": "BTCUSD",
  "stopLoss": 3,
  "leverage": "3",
  "trailingStop": "None",
  "takeProfit": 1,
  "key": "f7dea65b1c167651e830756a94f13d07f0b8c26b6a46f76f2afed966"
}
```
