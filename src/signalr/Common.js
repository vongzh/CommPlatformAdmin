export class Version {
  constructor(major, minor, build, revsion) {
    this.major = 0
    this.minor = 0
    this.build = 0
    this.revison = 0
    if (!isInteger(major) || !isInteger(minor) || (build && !isInteger(build))) {
      throw new Error(`parameters are not integer: major: ${major},minor:${minor},build:${build}`)
    }
    if (major < 0 || minor < 0 || (build && build < 0)) {
      throw new Error(`parameters are less than 0: major: ${major},minor:${minor},build:${build}`)
    }
    this.major = major
    this.minor = minor
    if (build) {
      this.build = build
    }
    if (revsion) {
      this.revison = revsion
    }
  }
  static parse(input) {
    const components = input.split('.')
    if (components.length < 2 || components.length > 4) {
      throw new Error(`invalid input string: ${input}`)
    }
    const temp = new Version(0, 0)
    components.forEach((val, idx) => {
      switch (idx) {
        case 0:
          temp.major = parseInt(val)
          break
        case 1:
          temp.minor = parseInt(val)
          break
        case 2:
          temp.build = parseInt(val)
          break
        case 3:
          temp.revison = parseInt(val)
          break
        default:
          break
      }
    })
    return temp
  }
  isEqual(version) {
    return version.major === this.major && version.minor === this.minor &&
            version.build === this.build && version.revison === this.revison
  }
  toString() {
    return `${this.major}.${this.minor}.${this.build}.${this.revison}`
  }
}
export const PROTOCOL_VERSION = new Version(1, 4)
export var ConnectionState;
(function(ConnectionState) {
  ConnectionState[ConnectionState['connecting'] = 0] = 'connecting'
  ConnectionState[ConnectionState['connected'] = 1] = 'connected'
  ConnectionState[ConnectionState['reconnecting'] = 2] = 'reconnecting'
  ConnectionState[ConnectionState['disconnected'] = 3] = 'disconnected'
})(ConnectionState || (ConnectionState = {}))
export class ConnectionInfo {
  constructor(baseUrl, lastActive, lastMessageAt, state, queryString, headers, connectionToken, connectionData, messageId, groupsToken) {
    this.clientProtocol = PROTOCOL_VERSION
    this.baseUrl = baseUrl
    this.lastActive = lastActive
    this.lastMessageAt = lastMessageAt
    this.state = state
    this.queryString = queryString
    this.headers = headers
    this.connectionToken = this.connectionToken
    this.connectionData = connectionData,
    this.messageId = messageId
    this.groupsToken = groupsToken
  }
  clear() {
    this.lastActive = null
    this.lastMessageAt = null
    this.messageId = null
    this.connectionToken = null
    this.groupsToken = null
    this.connectionData = null
  }
  isConnected() {
    return this.state == ConnectionState.connected
  }
}
export class NegotiateResponse {
}
export class Utils {
  static jsonSerialize(data) {
    if (typeof (data) === 'string' || typeof (data) === 'undefined' || data === null) {
      return data
    }
    return JSON.stringify(data)
  }
}
Utils.events = {
  onStart: 'onStart',
  onReceived: 'onReceived',
  onConnectionSlow: 'onConnectionSlow',
  onReconnecting: 'onReconnecting',
  onReconnected: 'onReconnected',
  onClose: 'onClose',
  onError: 'onError'
}
function isInteger(x) {
  return (typeof x === 'number') && (x % 1 === 0)
}
