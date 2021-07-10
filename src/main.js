import Vue from 'vue'
import App from './App'
import http from './utils/request'
import {showErrorMessage} from './utils/message'
Vue.prototype.$http = http
Vue.prototype.$err = showErrorMessage

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
