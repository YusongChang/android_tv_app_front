import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import x2js from 'x2js'
import axios from 'axios'

Vue.prototype.$x2js = new x2js()
Vue.prototype.$ajax = axios

Vue.config.productionTip = false
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


