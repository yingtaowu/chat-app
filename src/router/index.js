import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Robot from '@/pages/Robot'
import Mycenter from '@/pages/Mycenter'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { 
        showTab: false
      }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { 
        showTab: false
      }
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta: { 
        showTab: true
      }
    },
    {
      path: '/robot',
      name: 'robot',
      component: Robot,
      meta: { 
        showTab: true
      }
    },
    {
      path: '/mycenter',
      name: 'mycenter',
      component: Mycenter,
      meta: { 
        showTab: true
      }
    }
  ]
})
