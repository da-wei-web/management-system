import Vue from 'vue'

import { 
  Input, Button, Form, FormItem, Message, Container, Header, Aside,
  Main, Row, Col, MessageBox, Menu, Submenu, MenuItem, Card, Breadcrumb,
  BreadcrumbItem, Table, TableColumn, Switch, Pagination, Dialog, Option, Select, 
  Tag, Tree, Alert, Steps, Step, Tabs, TabPane, Cascader, CheckboxGroup, Checkbox, Upload
} from 'element-ui'

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
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Cascader)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message
