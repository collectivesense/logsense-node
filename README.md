# LogSense - Node Logger

[![npm version](https://badge.fury.io/js/logsense.svg)](https://badge.fury.io/js/logsense)

LogSense is a powerful service to collect and analyze row and structured logs from your server or serverless Node.

You don't need to modify your current logging statements. We'll automatically send your messages and error or any other objects as log parameters. Row messages are auto-discovered into patterns.

## Installation

1. Run `npm i logsense`
2. In your main file add:
    ```javascript
    const logsense = require('logsense')('YOUR_LOGSENSE_CUSTOMER_TOKEN')
    logsense.install()
    ```

For [Winston](https://github.com/winstonjs/winston) add:

```javascript
const logsense = require('logsense')('YOUR_LOGSENSE_CUSTOMER_TOKEN')
logger.add(new logsense.WinstonTransport())
```

## Usage

Common messages are auto-discovered into patterns:

```javascript
const sendEmail = ({ address }) => {
  console.info(`Send email to ${address}`)
}
```
<img width="819" alt="zrzut ekranu 2019-03-7 o 20 28 17" src="https://user-images.githubusercontent.com/1618590/53983582-cb289b00-4117-11e9-983d-2802957b7eb5.png">

Last argument is used for structured logging:

```javascript
const sendEmail = ({ address, topic }) => {
  console.info(`Send email to ${address}`, { topic })
}
```
<img width="822" alt="zrzut ekranu 2019-03-7 o 20 32 15" src="https://user-images.githubusercontent.com/1618590/53983702-1d69bc00-4118-11e9-94e1-5055e31ea7bc.png">

Discovered and structured parameters can be used in charts:
<img width="963" alt="zrzut ekranu 2019-03-7 o 20 40 23" src="https://user-images.githubusercontent.com/1618590/53984237-4048a000-4119-11e9-9c78-28fd243c4c96.png">
