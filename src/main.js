// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import axios from 'axios'
import ajax from "./util/http.js"
import elementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import moment from 'moment'

//定义一个全局过滤器实现日期格式化
Vue.filter('datrfmt',function (input) {//当input为时间戳时，需转为Number类型
  // 使用momentjs这个日期格式化类库实现日期的格式化功能
  return moment(input).format("YYYY-MM-DD HH:mm:ss");
})
Vue.prototype.$moment = moment

Vue.prototype.$axios = ajax;
Vue.config.productionTip = false

Vue.use(elementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  elementUI,
  moment,
  components: { App },
  template: '<App/>'
})
