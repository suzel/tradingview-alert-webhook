# Tradingview Alert Webhook

TradingView Strategy Alert Webhook that buys and sells crypto with the Binance API.

## Project URL

- https://tradingview.sukruuzel.com/webhook/

## Payload

```json
{
    "passphrase": "suzel",
    "time": "{{timenow}}",
    "exchange": "{{exchange}}",
    "ticker": "{{ticker}}",
    "bar": {
        "time": "{{time}}",
        "open": {{open}},
        "high": {{high}},
        "low": {{low}},
        "close": {{close}},
        "volume": {{volume}}
    },
    "strategy": {
        "position_size": {{strategy.position_size}},
        "order_action": "{{strategy.order.action}}",
        "order_contracts": {{strategy.order.contracts}},
        "order_price": {{strategy.order.price}},
        "order_id": "{{strategy.order.id}}",
        "market_position": "{{strategy.market_position}}",
        "market_position_size": {{strategy.market_position_size}},
        "prev_market_position": "{{strategy.prev_market_position}}",
        "prev_market_position_size": {{strategy.prev_market_position_size}}
    }
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
