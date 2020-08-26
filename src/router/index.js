import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () => import('views/login')
const Home = () => import('views/home')
const Users = () => import('views/home/childComs/subviews/Users')

Vue.use(VueRouter)

  const routes = [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: Users
        }
      ]
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
