import { Connection } from './Connection'
export class HubProgressUpdate {
}
export class HubResult {
}
export class HubRegistrationData {
  constructor(name) {
    this.name = name
  }
}
export class HubInvocation {
  constructor(hubName, method, id, args, state) {
    this.H = hubName
    this.M = method
    this.I = id
    this.A = args
    this.S = state
  }
}
export class HubProxy {
  constructor(connection, hubName) {
    this.connection = connection
    this.hubName = hubName
  }
  // add progressupdate support ???
  invoke(methodName, ...args) {
    if (!methodName) {
      throw new Error('invalid method name')
    }
    return new Promise((reslove, reject) => {
      var callBack = (r) => {
        if (r.E) {
          reject(new Error(r.E))
          return
        } else {
          if (r.S) {
            this.extendState(r.S)
          }
          if (r.R) {
            reslove(r.R)
          }
        }
      }
      var callbackId = this.connection.registerInvocationCallback(callBack)
      var invocationData = new HubInvocation(this.hubName, methodName, callbackId, this.generateArgs(args), this.state)

      this.connection.send(invocationData).catch((err) => {
        reject()
      })
    })
  }
  on(eventName, func) {
    if (!eventName) {
      throw new Error('invalid event name')
    }
    this.subscriptions = this.subscriptions || {}
    eventName = eventName.toLowerCase()
    var that = this
    this.subscriptions[eventName] = function(data) {
      func.apply(that, data)
    }
  }
  extendState(state) {
    this.state = this.state || {}
    if (state) {
      Object.keys(state).forEach(key => { this.state[key] = state[key] })
    }
  }
  generateArgs(args) {
    if (!args) {
      return null
    }
    args.forEach((val, index) => {
      if (typeof val === 'undefined') {
        args[index] = null
      }
    })
    return args
  }
}

export default class HubConnection extends Connection {
  constructor(url, queryString, userDefault) {
    super(HubConnection.getUrl(url, userDefault), queryString)
    this.callbackId = 0
    this.hubs = {}
    this.callbacks = {}
    this.disconnected(this.clearInvocationCallbacks)
    this.reconnecting(this.clearInvocationCallbacks)
  }
  get hubNames() {
    return Object.keys(this.hubs)
  }
  createHubProxy(hubName) {
    if (!hubName) {
      throw new Error('invalid hub name')
    }
    var hub = new HubProxy(this, hubName)
    this.hubs = this.hubs || {}
    this.hubs[hubName] = hub
    return hub
  }
  registerInvocationCallback(callBack) {
    if (!callBack) {
      throw new Error('invalid callback method')
    }
    this.callbacks = this.callbacks || {}
    this.callbacks[this.callbackId.toString()] = callBack
    const resId = this.callbackId.toString()
    this.callbackId += 1
    return resId
  }
  clearInvocationCallbacks(error) {
    if (this.callbacks) {
      const errorCallbacks = Array()
      var callbackArray = Object.keys(this.callbacks).forEach(key => {
        errorCallbacks.push(this.callbacks[key])
        this.callbacks[key] = null
      })
      this.callbacks = null
      const hubRes = new HubResult()
      error = error || new Error('need clear invocation callbacks')
      hubRes.E = error.message
      errorCallbacks.forEach(errorCallback => errorCallback(hubRes))
    }
  }
  onSending() {
    const hubRegisterArray = new Array()
    this.hubNames.forEach(name => hubRegisterArray.push(new HubRegistrationData(name)))
    return JSON.stringify(hubRegisterArray)
  }
  onMessageReceived(data) {
    if (!data) {
      return
    }

    if (data.P) {
      // todo
      console.log(data.P)
    } else if (data.I) {
      const hubRes = data
      if (hubRes.I) {
        const invokeCallback = this.callbacks[hubRes.I]
        this.callbacks[hubRes.I] = null
        if (invokeCallback) {
          invokeCallback(hubRes)
        }
      }
    } else {
      const clientInvocationData = data
      const hubName = clientInvocationData.H
      const eventName = clientInvocationData.M.toLowerCase()

      if (this.hubs[hubName] && this.hubs[hubName].subscriptions[eventName]) {
        this.hubs[hubName].subscriptions[eventName](clientInvocationData.A)
      }
    }
    super.onMessageReceived(data)
  }
  stop() {
    super.stop()
  }

  static getUrl(url, useDefault) {
    if (!url) {
      return null
    }
    var last = url.length - 1
    if (url.charAt(last) !== '/') {
      url = url.concat('/')
    }
    if (useDefault) {
      url = url.concat('signalr')
    }
    return url
  }
}
