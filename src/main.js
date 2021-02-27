import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入 icon 图标样式
import '@/style/icon.css'

// 引入 Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 自动设置 REM 基准值 (html 标签字体大小)
// 可以根据不同的手机型号设置 html 的字体大小
import 'amfe-flexible'

// 引入全局样式
import '@/style/index.css'

import './utils/dayjs'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
