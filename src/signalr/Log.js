export class ConsoleLogger {
  trace(message) {
    console.trace(message)
  }
  debug(message) {
    console.debug(message)
  }
  info(message) {
    console.info(message)
  }
  warn(message) {
    console.warn(message)
  }
  error(message) {
    console.error(message)
  }
}
export var LogLevel;
(function(LogLevel) {
  LogLevel[LogLevel['off'] = 0] = 'off'
  LogLevel[LogLevel['trace'] = 1] = 'trace'
  LogLevel[LogLevel['debug'] = 2] = 'debug'
  LogLevel[LogLevel['info'] = 4] = 'info'
  LogLevel[LogLevel['warn'] = 8] = 'warn'
  LogLevel[LogLevel['error'] = 16] = 'error'
})(LogLevel || (LogLevel = {}))
export class Logger {
  Logger(logger, logLevel) {
    this.logger = logger || new ConsoleLogger()
    this.logLevel = logLevel || LogLevel.trace
  }
  trace(message) {
    if (this.shouldLogging(LogLevel.trace)) {
      this.logger.trace(message)
    }
  }
  debug(message) {
    if (this.shouldLogging(LogLevel.debug)) {
      this.logger.debug(message)
    }
  }
  info(message) {
    if (this.shouldLogging(LogLevel.info)) {
      this.logger.info(message)
    }
  }
  warn(message) {
    if (this.shouldLogging(LogLevel.warn)) {
      this.logger.warn(message)
    }
  }
  error(message) {
    if (this.shouldLogging(LogLevel.error)) {
      this.logger.error(message)
    }
  }
  shouldLogging(logLevel) {
    return logLevel >= this.logLevel
  }
}
