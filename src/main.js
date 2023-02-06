import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './styles/element-variables.scss'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import elTableInfiniteScroll from 'el-table-infinite-scroll'
Vue.use(elTableInfiniteScroll)
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './control/permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import '@/styles/index.scss' // global css

import Avue from '@smallwei/avue' // avue
import '@smallwei/avue/lib/index.css'
Vue.use(Avue)

import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
Vue.use(Vue2OrgTree)

import layer from '@/components/Layer/layer'
Vue.prototype.$layer = layer(Vue)

// import qiyu from './utils/qiyu.js'
// Vue.prototype.qiyu = qiyu

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

const Bus = new Vue()
Vue.prototype.$bus = Bus

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  zIndex: 50000
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
