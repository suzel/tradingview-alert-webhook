# Tradingview Alert Webhook

[![Commit][commit-image]][commit-url]
[![Platform][platform-image]][platform-url]
[![MIT License][license-image]][license-url]

TradingView Strategy Alert Webhook that buys and sells crypto with the Binance API.

- https://tradingview.sukruuzel.com/webhook/

## Requirements

- Node.js (v16.11.0)
- NPM (8.0.0)

## Installation

```sh
git clone https://github.com/suzel/tradingview-alert-webhook.git
cd tradingview-alert-webhook
npm install
```

## Development

```sh
npm run dev
```

## Production

```sh
export NODE_ENV=production
npm start
```

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
      "order_comment": "{{strategy.order.comment}}",
      "order_alert_message": "{{strategy.order.alert_message}}",
      "market_position": "{{strategy.market_position}}",
      "market_position_size": {{strategy.market_position_size}},
      "prev_market_position": "{{strategy.prev_market_position}}",
      "prev_market_position_size": {{strategy.prev_market_position_size}}
  }
}
```

## License

The source code is licensed under the [MIT license](LICENSE).

[commit-image]: https://img.shields.io/github/last-commit/suzel/tradingview-alert-webhook?style=flat-square
[commit-url]: https://github.com/suzel/tradingview-alert-webhook/commits/master
[platform-image]: https://img.shields.io/badge/macOS-gray?style=flat-square&logo=apple&&logoColor=white
[platform-url]: https://www.apple.com/macos
[license-image]: https://img.shields.io/github/license/suzel/tradingview-alert-webhook?color=blue&style=flat-square
[license-url]: LICENSE
