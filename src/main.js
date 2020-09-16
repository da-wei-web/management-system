import Vue from 'vue'
import App from './App.vue'

import 'assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import store from './store'

// 导入自定义插件
import MyHttp from 'common/plugin/http'
// 使用自定义插件
Vue.use(MyHttp)

// Vue.component(Button.name, Button); || Vue.use(Button)
import './common/plugin/element'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
