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
