// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'//muse-ui 预设 4 种主题 light, dark, carbon, teal 只需要在组件后面引入即可
// import VueSocketio from 'vue-socket.io'
import moment from 'moment'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'

// 本地化，中文时间显示
moment.locale('zh-cn');

Vue.prototype.moment = moment;

Vue.prototype.random = n => Math.floor(n * Math.random());

Vue.use(Vuex)
Vue.use(MuseUI)
Vue.use(VueAxios, axios)
// Vue.use(VueSocketio, 'http://localhost:8080')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
