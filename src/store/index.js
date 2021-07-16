import Vue from 'vue'
import Vuex from 'vuex'
import moduleUser from './modules/user'
import moduleOrder from './modules/order'
import moduleClass from './modules/class'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user: moduleUser,
    order: moduleOrder,
    class: moduleClass
  },
  getters: {
  }
})
