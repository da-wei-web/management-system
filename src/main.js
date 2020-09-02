import Vue from 'vue'
import App from './App.vue'


import { 
  Input, Button, Form, FormItem,
  Message, Container, Header, Aside,
  Main, Row, Col, MessageBox, Menu,
  Submenu, MenuItem, Card, Breadcrumb,
  BreadcrumbItem, Table, TableColumn, Switch,
  Pagination, Dialog, Option, Select, 
  Tag, Tree, Alert, Steps,
  Step
} from 'element-ui'
import 'assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
import store from './store'

// 导入自定义插件
import MyHttp from 'common/plugin/http'
// 使用自定义插件
Vue.use(MyHttp)

// Vue.component(Button.name, Button); || Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
