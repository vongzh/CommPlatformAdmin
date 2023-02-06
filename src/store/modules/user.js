import {
  login,
  Wechatlogin,
  logout,
  getUserInfo
} from '@/api/sys/user'
import auth from '@/control/auth'
import {
  resetRouter
} from '@/router'
import md5 from 'js-md5'

const state = {
  user: {},
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: [],
  modules: [],
  session: null
}

const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_SESSION: (state, session) => {
    state.session = session
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_MODULES: (state, modules) => {
    state.modules = modules
  }
}

const actions = {
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      const seed = auth.RandomString(16)
      login({
        username: username.trim(),
        pwd: md5(password),
        seed: seed
      })
        .then(response => {
          const token = response.data
          auth.SetCustomerAuth(seed, token)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  wechatlogin({
    commit
  }, userInfo) {
    const {
      code,
      state
    } = userInfo
    return new Promise((resolve, reject) => {
      const seed = auth.RandomString(16)
      Wechatlogin({
        code: code,
        state: state,
        seed: seed
      })
        .then(response => {
          const token = response.data
          auth.SetCustomerAuth(seed, token)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then(response => {
          if (!response || !response.data) {
            reject('验证失败,请重新登录')
            return
          }

          const userInfo = response.data
          const defaultAvatar = 'data:image/jpg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIACgAKAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APIpJYi/TNbmiy3d1dW9jYQKRPwIiuFcj1NL4X8N2+ueJLGxkd1hdTJKfYZOP0r0DxPoxOm3FnZF2urRN9lMG2sEPDJ8uO2R05yPrUOXO7I0qOx5hBq0+kavNJYy+QoOHQ/Mp9Rj65roh4+s7mAre6aDKAdrocrnHcHn9TXCPbMhZJFZWHUMMGnR2riIyMGCngHHH+eK0STM3sd/Brnho4kW98pgAceUw5/AVY/4STQP+giv/ftq818nPyqpZvQUfY5/+fd/yraK00RzOKb3PTfAd3p2ntJcTB2vW2RxhCuVXvgEgnJPb0q9qHieNNZvoYxJKxhGdo5UqTncO3vXM+HIbdobi/mmRClv+6U9S5IH9Sfwrahn06bxRfXVsd6TQiR2bAAOeRz0PGfxrDCRvdnZXsrXMvU9asri5LPpsFyrKAS+VOfYiqM+vtPm1eyjjtkVViijBwuM+vrn61VvAsOqnbslWOXPPG5c8fmKvaPqenxeIft2pKfLiBZFxnDZx09uo/ClGbbcuo6vKoqKM260w2MqnciXzjd5BcblB9V6iofL1X/Z/WoPFFzZHxA11piv5JCPE5fJ9ST71R/t29/56tXVGvp2OSVN3O20hxCJ7IbmWXCKiIDlu2M/XPvTdXjubSd9PuIIgkbkuyjkgd8Uujf8hq3/AOvhP5rV/wAZ/wDIfvP9z+lcFCtOnGXL1OivSjUScuhz9uq2t0dTeJpIIB8yk8tgdAKwLnV5J5C8sCGAy73j5G/2JHOPpiull/5AF3/wP+VcXN/x7/jWkFZIlO+5Lq+otezRkwR26ouFijGFUHnj/Pes7dUt7/rl/wBxf5Cq9UN6n//Z'

          const name = userInfo.userName
          const avatar = userInfo.avatar ? userInfo.avatar : defaultAvatar
          const introduction = '♥♥♥'
          const session = auth.GetCustomerAuth()
          const menus = userInfo.roleMenus
          const modules = userInfo.modules
          const roles = userInfo.userRoles.map((value, index, array) => {
            return value.meta
          })

          commit('SET_USER', userInfo)
          commit('SET_MODULES', modules)
          commit('SET_ROLES', roles)
          commit('SET_MENUS', menus)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_SESSION', session)
          commit('SET_INTRODUCTION', introduction)
          resolve(userInfo)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('SET_ROLES', [])
          commit('SET_MENUS', [])
          commit('SET_MODULES', [])
          commit('SET_SESSION', {})
          commit('SET_USER', {})
          commit('SET_NAME', '')
          commit('SET_INTRODUCTION', '')
          commit('SET_AVATAR', '')
          auth.RemoveCustomerAuth()

          resetRouter()

          dispatch('tagsView/delAllViews', null, {
            root: true
          })
          resolve(true)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
