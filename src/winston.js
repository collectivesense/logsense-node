// we don't want to depend on winston; user should install it on his own
// eslint-disable-next-line import/no-unresolved
const Transport = require('winston-transport')

class LogSenseTransport extends Transport {
  constructor(sender, options) {
    super(options)
    this.name = 'logsense'
    this.sender = sender
  }

  log(message, callback) {
    this.sender.emit(message, (error) => {
      if (error) {
        this.emit('error', message)
        if (typeof callback === 'function') {
          callback(error, false)
        }
      } else {
        this.emit('logged', message)
        if (typeof callback === 'function') {
          callback(null, true)
        }
      }
    })
  }
}

module.exports = LogSenseTransport
