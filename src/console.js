const util = require('util')

const objectToEvent = (object) => {
  let event = object

  // Error by default doesn't have name, message and stack field enumerable;
  // that's common case to log errors, so let's support it
  if (object instanceof Error) {
    event = {
      name: object.name,
      message: object.message,
      stack: object.stack,
      ...object,
    }
  }

  if (typeof event === 'object' && event !== null) {
    const copy = {}
    Object.keys(event).forEach((key) => {
      copy[key] = objectToEvent(event[key])
    })
    event = copy
  }

  return event
}

/**
 * Overrides standard console methods and send logs to LogSense.
 */
module.exports = ({ emit }) => {
  const mock = (name) => {
    const superFunction = console[name]
    if (!superFunction) return
    console[name] = (...args) => {
      let message
      let event
      const lastArg = args[args.length - 1]

      // take last argument object as structured log
      if (typeof lastArg === 'object' && lastArg != null) {
        event = objectToEvent(lastArg)

        // passing an error or some class instance is a common case for logging;
        // let's prefix all fields by the class name for better understanding of event
        if (lastArg instanceof Error) {
          event = { error: event }
        } else if (lastArg.constructor && lastArg.constructor.name !== 'Object') {
          event = { [lastArg.constructor.name]: event }
        }

        // send all previous args as a message
        message = util.format(...args.slice(0, -1))
      } else {
        // send whole log
        message = util.format(...args)
      }

      // call original console method
      superFunction.call(console, ...args)

      // send log to fluent
      emit({ level: name, ...event, message })
    }
  }

  mock('log')
  mock('info')
  mock('warn')
  mock('error')
}
