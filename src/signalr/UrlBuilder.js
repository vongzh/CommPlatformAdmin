export class UrlBuilder {
  constructor(connectionInfo) {
    this.connectionInfo = connectionInfo
  }
  buildNegotiateUrl(transport) {
    return UrlBuilder.trim(this.createBaseUrl('negotiate', transport))
  }
  buildConnectUrl(transport) {
    var url = this.createBaseUrl('connect', transport)
    return UrlBuilder.trim(this.appendReceiveParameters(url))
  }
  buildStartUrl(transport) {
    var url = this.createBaseUrl('start', transport)
    return UrlBuilder.trim(this.appendReceiveParameters(url))
  }
  buildReconnectUrl(transport) {
    var url = this.createBaseUrl('reconnect', transport)
    return UrlBuilder.trim(this.appendReceiveParameters(url))
  }
  buildAbortUrl(transport) {
    return UrlBuilder.trim(this.createBaseUrl('abort', transport))
  }
  static trim(url) {
    var last = url.length - 1
    if (url.charAt(last) === '&') {
      return url.slice(0, -1)
    }
    throw new Error('invalid url')
  }
  createBaseUrl(command, transport) {
    var url = `${this.connectionInfo.baseUrl}${command}?`
    return this.appendCommandParameters(url, transport)
  }
  appendCommandParameters(url, transport) {
    url = this.appendClientProtocol(url)
    url = this.appendTransport(url, transport)
    url = this.appendConnectionData(url)
    url = this.appendConnectionToken(url)
    url = this.appendCustomQueryString(url)
    return url
  }
  appendReceiveParameters(url) {
    url = this.appendMessageId(url)
    url = this.appendGroupsToken(url)
    return url
  }
  appendClientProtocol(url) {
    return `${url}clientProtocol=${this.connectionInfo.clientProtocol}&`
  }
  appendTransport(url, transport) {
    return `${url}transport=${transport}&`
  }
  appendConnectionData(url) {
    if (this.connectionInfo.connectionData) {
      return `${url}connectionData=${encodeURIComponent(this.connectionInfo.connectionData)}&`
    }
    return url
  }
  appendConnectionToken(url) {
    if (this.connectionInfo.connectionToken) {
      return `${url}connectionToken=${encodeURIComponent(this.connectionInfo.connectionToken)}&`
    }
    return url
  }
  appendCustomQueryString(url) {
    if (this.connectionInfo.queryString) {
      var queryString = this.connectionInfo.queryString
      if (queryString.charAt(0) === '?' || queryString.charAt(0) === '&') {
        queryString = this.connectionInfo.queryString.slice(1)
      }
      return `${url}${queryString}&`
    }
    return url
  }
  appendMessageId(url) {
    if (this.connectionInfo.messageId) {
      return `${url}messageId=${this.connectionInfo.messageId}&`
    }
    return url
  }
  appendGroupsToken(url) {
    if (this.connectionInfo.groupsToken) {
      return `${url}groupsToken=${this.connectionInfo.groupsToken}&`
    }
    return url
  }
}
