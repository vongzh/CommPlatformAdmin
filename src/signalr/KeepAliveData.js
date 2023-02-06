export class KeepAliveData {
  constructor(timeout) {
    this.keepAliveWarnAt = 2.0 / 3.0
    this.timeout = 0
    this.timeoutWarning = 0
    this.checkInterval = 0
    this.timeout = timeout
    this.timeoutWarning = this.timeout * this.keepAliveWarnAt
    this.checkInterval = this.timeout - this.timeoutWarning / 3.0
  }
}
