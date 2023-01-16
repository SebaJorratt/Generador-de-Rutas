import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    valido: false
  },
  getters: {
  },
  mutations: {
    cambiarValido(state){
      state.valido = true
    }
  },
  actions: {
    guardarUsuario({commit}){
      commit('cambiarValido');
    },
  },
  modules: {
  }
})
