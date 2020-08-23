import axios from 'axios'
// const token = localStorage.getItem('token')
import { token } from '../untils/constant'
// 通过将axios封装为一个插件，挂载到Vue实例上
// 1.创建一个对象
const MyHttp = {}

// 2.安装插件
MyHttp.install = Vue => {

  // 地址
  axios.defaults.baseURL = 'http://127.0.0.1:8888'
  axios.defaults.headers.common['Authorization'] = token

  // 添加实例方法，挂载到Vue实例上
  Vue.prototype.$http = axios
}

// 3. 导出插件
export default MyHttp