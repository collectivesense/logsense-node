const installConsole = require('./console')
const createSender = require('./sender')

const TOKEN_LENGTH = 36 // standard uuid length

module.exports = (token) => {
  if (typeof token !== 'string') {
    throw new Error('LogSense token needs to be a string')
  }
  if (token === 'YOUR_LOGSENSE_CUSTOMER_TOKEN') {
    throw new Error('Create an account on logsense.com and provide your private CUSTOMER_TOKEN')
  }
  if (token.length !== TOKEN_LENGTH) {
    throw new Error('LogSense token has invalid length; check your token on logsense.com')
  }

  const sender = createSender({ token })

  return {
    install() {
      installConsole(sender)
    },

    // usually winston transports are classes; let's act like one to be consistent
    // eslint-disable-next-line object-shorthand, func-names
    WinstonTransport: function (options) {
      // winston.js requires winston-transport but we don't want to keep it in dependencies
      // eslint-disable-next-line global-require
      const WinstonTransport = require('./winston')
      return new WinstonTransport(sender, options)
    },
  }
}
