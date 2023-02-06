import auth from '@/control/auth'

const state = {
  client_token: ''
}

const mutations = {
  SET_CLIENT_TOKEN: (state, client_token) => {
    state.client_token = client_token
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
