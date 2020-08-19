import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import('components/content/login')

Vue.use(VueRouter)

  const routes = [
    // {
    //   path: '/',
    //   redirect: '/login'
    // },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
