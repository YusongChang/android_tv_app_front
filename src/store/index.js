import Vue from 'vue'
import Vuex from 'vuex'
import moduleLogin from './modules/login'
import moduleUser from './modules/user'
import moduleClass from './modules/class'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login: moduleLogin,
    user: moduleUser,
    class: moduleClass,
  },
})
