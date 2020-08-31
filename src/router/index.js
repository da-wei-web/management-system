import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'

// 路由懒加载
const Login = () => import('views/login')
const Home = () => import('views/home')
const Users = () => import('views/users')
const Role = () => import('views/role')
const Right = () => import('views/right')

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
        },
        {
          path: 'roles',
          name: 'Role',
          component: Role
        },
        {
          path: 'rights',
          name: 'Right',
          component: Right
        }
      ]
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// to表示要去的路由，from当前路由，next()下一步(出发，to生效)
// 路由守卫，在路由配置之前生效
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    // 判断token
    // console.log(token)
    if (!token) {
      Message.warning('请先登录')
      router.push('/login')
    }

    next()
  }
})

export default router
