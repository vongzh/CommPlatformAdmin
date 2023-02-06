import { Utils, ConnectionState } from './Common'
import { UrlBuilder } from './UrlBuilder'
import { HttpClient } from './Http/HttpClient'
import { TransportHelper } from './Connection'
class TransportAbortHandler {
  constructor(transportName, urlBuilder, httpClient) {
    this.startAbort = false
    this.transportName = transportName
    this.urlBuilder = urlBuilder
    this.httpClient = httpClient
  }
  tryCompeleteAbort() {
    return this.startAbort
  }
  compeleteAbort() {
    this.startAbort = true
  }
  abort(timeout) {
    return new Promise((reslove, reject) => {
      if (this.startAbort === false) {
        const abortTimeout = setTimeout(() => {
          this.compeleteAbort()
          reslove()
        }, timeout * 1000)
        this.startAbort = true
        const abortUrl = this.urlBuilder.buildAbortUrl(this.transportName)
        this.httpClient.get(abortUrl).then(() => {
          clearTimeout(abortTimeout)
          reslove()
        }).catch(() => {
          this.compeleteAbort()
          clearTimeout(abortTimeout)
          reslove()
        })
      }
    })
  }
}
class HttpBasedTransport {
  getName() {
    return ''
  }
  negotiate(connection) {
    this.connection = connection
    this.httpClient = new HttpClient()
    this.urlBuilder = new UrlBuilder(this.connection.connectionInfo)
    this.abortHandler = new TransportAbortHandler(this.getName(), this.urlBuilder, this.httpClient)
    const url = this.urlBuilder.buildNegotiateUrl(this.getName())
    return this.httpClient.get(url).then((res) => {
      return JSON.parse(res)
    }).catch((e) => {
      throw e
    })
  }
  initReceived() {
    const url = this.urlBuilder.buildStartUrl(this.getName())
    return this.httpClient.get(url).then((msg) => { })
  }
  processMessage(message) {
    this.connection.markLastMessage()
    if (!message) {
      return false
    }
    var shouldReconnect = false
    const m = JSON.parse(message)
    if (m.I) {
      if (!this.connection.connectingMessageBuffer.tryBuffer(m)) {
        this.connection.onMessageReceived(m)
      }
      return false
    }
    if (m.T === 1) {
      shouldReconnect = true
    }
    if (m.G) {
      this.connection.connectionInfo.groupsToken = m.G
    }
    if (m.M && Array.isArray(m.M)) {
      m.M.forEach((msg) => {
        if (!this.connection.connectingMessageBuffer.tryBuffer(msg)) {
          this.connection.onMessageReceived(msg)
        }
      })
    } else {
      return shouldReconnect
    }
    this.connection.connectionInfo.messageId = m.C
    if (m.S === 1) {
      if (this.initCallback) {
        this.initCallback()
        this.initCallback = null
      }
    }
    return shouldReconnect
  }
  abort(timeout) {
    return this.abortHandler.abort(timeout)
  }
}
export class WebSocketTransport extends HttpBasedTransport {
  constructor() {
    super(...arguments)
    this.reconnectDelay = 2
    this.supportKeepAlive = true
  }
  start() {
    var url = this.urlBuilder.buildConnectUrl(this.getName())
    return this.performConnect(url, false).then(() => this.initReceived())
  }
  send(data) {
    return new Promise((reslove, reject) => {
      data = Utils.jsonSerialize(data)
      // need refactor to handle different environment
      if (WebSocket && this.websocket instanceof WebSocket) {
        try {
          this.websocket.send(data)
        } catch (err) {
          reject(err)
          return
        }
      }
      reslove()
    })
  }
  getName() {
    return 'webSockets'
  }
  lostConnection() {
    // need refactor to handle different environment
    if (WebSocket && this.websocket instanceof WebSocket) {
      this.websocket.close()
      this.websocket = null
    }

    if (this.abortHandler.tryCompeleteAbort()) {
      return
    }
    if (this.connection.connectionInfo.state == ConnectionState.disconnected) {
      return
    }
    this.doReconnect()
  }
  doReconnect() {
    // issue change while to if (may lead memory leak)
    while (!this.reconnectTimeoutHandler) {
      this.reconnectTimeoutHandler = setTimeout(() => {
        TransportHelper.verifyLastActive(this.connection).then(res => {
          if (res === true && this.connection.ensureReconnecting()) {
            const url = this.urlBuilder.buildReconnectUrl(this.getName())
            this.performConnect(url, true).then(() => {
              clearTimeout(this.reconnectTimeoutHandler)
              this.reconnectTimeoutHandler = null
              if (this.connection.changeState(ConnectionState.reconnecting, ConnectionState.connected)) {
                this.connection.onReconnected()
              }
            }).catch(() => { clearTimeout(this.reconnectTimeoutHandler); this.reconnectTimeoutHandler = null })
          }
        })
      }, this.reconnectDelay * 1000)
    }
  }
  performConnect(url, isReconnect) {
    url = url.replace(/^http/, 'ws')
    return new Promise((reslove, reject) => {
      const transport = this
      var opened = false
      const connectTimeoutHandler = setTimeout(() => {
        reject(new Error('time out to connect'))
      }, this.connection.connectionInfo.transportConnectTimeout * 1000)
      if (!isReconnect) {
        this.initCallback = () => { clearTimeout(connectTimeoutHandler); reslove() }
      }
      this.initErrorCallback = () => { clearTimeout(connectTimeoutHandler); reject() }
      // need refactor to handle different environment
      if (WebSocket) {
        const websocket = new WebSocket(url)
        websocket.onopen = (event) => {
          transport.websocket = websocket
          if (isReconnect) {
            reslove()
          }
        }
        websocket.onerror = (event) => {
          if (transport.initErrorCallback) {
            transport.initErrorCallback()
            transport.initErrorCallback = null
          } else {
            reject()
          }
        }
        websocket.onmessage = (message) => {
          transport.processMessage(message.data)
        }
        websocket.onclose = (event) => {
          if (transport && event.wasClean === false) {
            transport.connection.onError(new Error(`${event.reason}`))
          }
          if (transport) {
            if (transport.abortHandler.tryCompeleteAbort()) {
              return
            }
            transport.doReconnect()
          }
        }
      }
    })
  }
}
