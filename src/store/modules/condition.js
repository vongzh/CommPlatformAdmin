const state = {
  city: null,
  search: null
}

const mutations = {
  SET_CITY: (state, city) => {
    state.city = city
  },
  SET_SEARCH: (state, search) => {
    state.search = search
  }
}

const actions = {
  setCity({ commit }, data) {
    commit('SET_CITY', data)
  },
  setSearch({ commit }, data) {
    commit('SET_SEARCH', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
