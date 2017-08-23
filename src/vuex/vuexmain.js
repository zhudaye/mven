import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let state = {
  name: ''
}

let mutations = {
  setname (state, name) {
    state.name = name
  }
}

export default new Vuex.Store({
  state: state,
  mutations: mutations
})
