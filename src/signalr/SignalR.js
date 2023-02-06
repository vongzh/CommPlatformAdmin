import HubConnection from './Hub'

const HUB_NAME = 'MessageHub'
const SignalR = class SignalR {
  static isPrepear() {
    return this.signalr == null
      ? false
      : this.signalr.connectionInfo.isConnected()
  }
  static registHandler(name, event) {
    if (this.events[name] != null) {
      throw new Error(name + ' had registed!')
    }
    this.events[name] = event
  }
  static unRegistHandler(name, event) {
    if (this.events[name] == null) {
      throw new Error(name + ' had not registed!')
    }
    this.events[name] = null
  }
  static open(url, qs) {
    try {
      if (!this.signalr) {
        const queryString = qs || {}
        this.signalr = new HubConnection(url, queryString, true)
        var proxy = this.signalr.createHubProxy(HUB_NAME)
        proxy.on('Notify', (msg) => {
          var event = this.events['notify']
          if (event == null || event === undefined) {
            throw new Error(name + ' not regist!')
          }
          event(msg)
        })
      }
      if (this.isPrepear()) {
        return new Promise((reslove, reject) => {
          reslove()
        })
      }
      return this.signalr
        .start()
        .then(() => {

        })
        .catch(e => {
          return new Promise((reslove, reject) => {
            reject(new Error('连接失败' + e))
          })
        })
    } catch (err) {
      console.log(err)
    }
  }
  static close() {
    try {
      if (this.signalr) {
        this.signalr.stop()
      }
    } catch (err) {
      console.log(err)
    }
  }
  static sendMsg(method, msg) {
    try {
      var proxy = this.signalr.hubs[HUB_NAME]
      if (proxy == null || proxy === undefined) {
        return new Promise((reslove, reject) => {
          reject(new Error('not do open'))
        })
      }
      if (msg.Parameter != null) {
        msg.Parameter = JSON.stringify(msg.Parameter)
      }
      return proxy.invoke(method, msg)
    } catch (err) {
      console.log(err)
    }
  }
}

SignalR.events = {}
export default SignalR
