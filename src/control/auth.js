import store from '@/store'
import md5 from 'js-md5'
import crypto from 'crypto-js'
import * as tokenService from '@/api/token'

const client = {
  client_id: 'b2b',
  client_secret: 'wz'
}
const sessionkey = 'u_sk'
const clientTokenKey = 'c_tk'
const base64 = require('js-base64').Base64
export default {
  IsClientAuthorization() {
    return this.GetClientAuth()
  },
  async ClientAuthorization() {
    const that = this
    const authorization =
      'Basic ' + base64.encode(client.client_id + ':' + client.client_secret)

    await tokenService.RequestToken(authorization)
      .then(res => {
        that.SetClientAuth(res)
      }).catch(err => {
        console.log(err)
      })
  },
  SetClientAuth(token) {
    store.state.client.client_token = token

    if (window.localStorage) { window.localStorage.setItem(clientTokenKey, JSON.stringify(token)) }
  },
  RemoveClientAuth() {
    store.state.client.client_token = null

    if (window.localStorage) { window.localStorage.removeItem(clientTokenKey) }
  },
  GetClientAuth() {
    if (store.state.client.client_token) {
      return store.state.client.client_token
    }

    if (window.localStorage) {
      var localClientToken = window.localStorage.getItem(clientTokenKey)
      if (localClientToken) {
        var token = JSON.parse(localClientToken)
        store.state.client.client_token = token
        return token
      }
    }
    return null
  },
  IsCustomerAuthorization() {
    return this.GetCustomerAuth()
  },
  GetCustomerAuth() {
    if (store.state.user.session) { return store.state.user.session }

    if (window.localStorage) {
      var localUserSession = window.localStorage.getItem(sessionkey)

      if (localUserSession) {
        var session = JSON.parse(localUserSession)
        store.state.user.session = session
        return session
      }
    }
    return null
  },
  SetCustomerAuth(seed, token) {
    const index = token.indexOf('.')
    const sid = token.substring(0, index)
    const pk = token.substring(index + 1, token.length)

    const session = {
      seed: seed,
      sessionId: sid,
      privateKey: pk,
      time: new Date()
    }

    store.state.user.session = session

    if (window.localStorage) { localStorage.setItem(sessionkey, JSON.stringify(session)) }
  },
  RemoveCustomerAuth() {
    store.state.user.session = null

    if (window.localStorage) { window.localStorage.removeItem(sessionkey) }
  },
  GenerateRequestToken() {
    if (this.IsCustomerAuthorization()) {
      const session = this.GetCustomerAuth()

      const localToken = {
        sid: session.sessionId,
        tm: new Date()
      }

      var privateKeyHash = md5(session.privateKey)
      var token = this.AesEncrypt(JSON.stringify(localToken), privateKeyHash, session.seed)
      return token
    }
    return ''
  },
  Md5(word) {
    return md5(word)
  },
  AesEncrypt(word, keyStr, ivStr) {
    try {
      const key = crypto.enc.Utf8.parse(keyStr)
      const iv = crypto.enc.Utf8.parse(ivStr)

      const srcs = crypto.enc.Utf8.parse(word)

      const encrypted = crypto.AES.encrypt(srcs, key, {
        iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      })
      return encrypted.toString()
    } catch (e) {
      console.log(e)
    }
  },
  AesDecrypt(word, keyStr, ivStr) {
    try {
      const key = crypto.enc.Utf8.parse(keyStr)
      const iv = crypto.enc.Utf8.parse(ivStr)

      const decrypted = crypto.AES.decrypt(word, key, {
        iv,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      })

      return decrypted.toString(crypto.enc.Utf8)
    } catch (e) {
      console.log(e)
      return e
    }
  },
  RandomString(len, charSet) {
    charSet =
      charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var randomString = ''
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length)
      randomString += charSet.substring(randomPoz, randomPoz + 1)
    }
    return randomString
  }
}
