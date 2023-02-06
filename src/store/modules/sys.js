import { getModules } from '@/api/sys/module'

const YNEnum = {
  Y: 1,
  N: 0
}

const state = {
  permissionModules: []
}

const mutations = {
  SET_PERMISSION_MODULES: (state, permissionModules) => {
    state.permissionModules = permissionModules
  }
}

const actions = {
  loadModules({
    commit
  }) {
    return new Promise((resolve, reject) => {
      getModules()
        .then((res) => {
          const sysModules = res.data
          if (res.data) {
            var modules = sysModules.filter(m => {
              return m.control === YNEnum.Y
            })
            commit('SET_PERMISSION_MODULES', modules)
          }
          resolve(sysModules)
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
