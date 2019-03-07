const FluentLogger = require('fluent-logger')

const TIMEOUT = 200 // time to close idling fluentd

module.exports = ({ token }) => {
  const fluent = FluentLogger.createFluentSender('structured', {
    host: 'logs.logsense.com',
    port: 32714,
    requireAckResponse: true,
    eventMode: 'CompressedPackedForward',
    timeout: 3000,
    ackResponseTimeout: 3000,
    reconnectInterval: 2000,
    tls: true,
    internalLogger: {
      info(msg) {
        process.stdout.write(`${msg}\n`)
      },
      error(msg) {
        process.stderr.write(`${msg}\n`)
      },
    },
  })

  let timeout = false
  let sending = 0

  fluent.on('error', () => {
    if (timeout) {
      sending = 0
      timeout = false
      fluent.end()
    }
  })

  fluent.on('connect', () => {
    // we need to close fluent socket manually on timeout reached
    // issue https://github.com/fluent/fluent-logger-node/issues/139
    // eslint-disable-next-line no-underscore-dangle
    fluent._socket.setTimeout(TIMEOUT)
    // eslint-disable-next-line no-underscore-dangle
    fluent._socket.on('timeout', () => {
      // let's wait for pending packets to be sent
      if (sending === 0) {
        fluent.end()
      } else {
        timeout = true
      }
    })
  })

  const emit = (event, callback) => {
    const fluentMessage = {
      cs_customer_token: token,
      cs_pattern_key: 'message',
      ...event,
    }
    sending += 1
    fluent.emit(fluentMessage, (error) => {
      sending -= 1
      if (typeof callback === 'function') {
        callback(error)
      }
      if (timeout && sending === 0) {
        timeout = false
        fluent.end()
      }
    })
  }

  return { emit }
}
