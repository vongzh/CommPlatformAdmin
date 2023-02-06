import {
  Message,
  Loading,
  MessageBox
} from 'element-ui'

import axios from 'axios'
import router from '@/router'
import auth from '@/control/auth'

const tokenUrl = '/token'
const service = axios.create({
   baseURL: process.env.VUE_APP_BASE_API,
 //  baseURL: 'http://219.150.218.21:18556',
  timeout: 300000
})
console.log(process.env.VUE_APP_BASE_API)

service.interceptors.request.use(
  async(config) => {
    if (config.url.indexOf(tokenUrl) < 0) {
      if (!auth.IsClientAuthorization()) {
        await auth.ClientAuthorization()
      }
      const token = auth.GetClientAuth()
      if (token === null) {
        throw new Error('初始化失败')
      }

      config.headers.Authorization = token.token_type + ' ' + token.access_token
    }
    if (auth.IsCustomerAuthorization()) {
      const clientToken = auth.GenerateRequestToken()
      config.headers['ck'] = clientToken

      const customerAuth = auth.GetCustomerAuth()
      config.headers['sid'] = customerAuth.sessionId
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    let res = response.data
    if (response.config.url.indexOf(tokenUrl) > 0) {
      return res
    }

    const contentType = response.headers['content-type']
    if (!contentType) { return res }

    switch (true) {
      case contentType.includes('application/json'):

        break
      case contentType.includes('text/plain'):
        try {
          const session = auth.GetCustomerAuth()
          const privateKeyHash = auth.Md5(session.privateKey)
          const ret = auth.AesDecrypt(res, privateKeyHash, session.seed)
          res = JSON.parse(ret)
        } catch (e) {
          console.log(e)
        }
        break
    }

    var code = res.code
    switch (code) {
      case 0:
        return res
      case -100:
        if (Loading.service()) {
          Loading.service().close()
        }

        Message({
          message: res.message || '网络异常',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || '网络异常'))
      case -10000:
        return res
      default:
        return res
    }
  },
  error => {
    if (Loading.service()) {
      Loading.service().close()
    }

    if (!error.response) {
      Message({
        message: error.message || '网络异常',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    switch (error.response.status) {
      case 429:
        Message({
          type: 'info',
          message: '访问过于频繁,请稍后再试'
        })
        break
      case 403:
        Message({
          type: 'info',
          message: '请求被禁止'
        })
        break
      case 401:
        var reasonPhrase = error.response.statusText
        switch (reasonPhrase) {
          case 'Permission':
            MessageBox({
              type: 'error',
              title: '操作失败',
              message: '没有操作权限'
            })
            break
          case 'Self':
            auth.RemoveCustomerAuth()
            router.go('/login')
            break
          case 'Unauthorized':
            auth.RemoveClientAuth()
            auth.ClientAuthorization()
            Message({
              type: 'info',
              message: '请刷新页面重试'
            })
            break
          default:
            break
        }
        break
    }
    return Promise.reject(error)
  }
)

export default service
