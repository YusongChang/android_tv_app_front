import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2'; //beautiful alert
import VueToastr from "vue-toastr";
import Loading from 'vue-loading-overlay';
import 'sweetalert2/dist/sweetalert2.min.css';
import "video.js/dist/video-js.css";
import 'vue-loading-overlay/dist/vue-loading.css';
import '@/sass/app.scss';


// import 'core-js';
// import 'regenerator-runtime/runtime';

Vue.prototype.$eventBus = new Vue();

Vue.config.productionTip = false;

Vue.use(VueSweetalert2);
const toastrConfig = {
  defaultName: "",
  defaultTimeout: 1500,
  defaultProgressBar: false,
  defaultProgressBarValue: 0,
  defaultPosition: "toast-top-center",
  defaultClassNames: ["animated", "zoomInUp"],
  defaultType: "success",
  defaultStyle: { "width": "150px", "text-align": "center" },
};
Vue.use(VueToastr, toastrConfig);
Vue.use(Loading);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');

