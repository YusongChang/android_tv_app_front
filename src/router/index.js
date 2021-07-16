import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("user")) {
        next({ name: 'ClassList' })
      } else {
        next()
      }
    }
  },
  {
    path: '/classlist/:id/:video',
    name: 'Class',
    component: () => import(/* webpackChunkName: "about" */ '../views/Class.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("user")) {
        next({ name: 'Login' })
      } else {
        next()
      }
    }
  },
  {
    path: '/classlist',
    name: 'ClassList',
    component: () => import(/* webpackChunkName: "about" */ '../views/ClassList.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("user")) {
        next({ name: 'Login' })
      } else {
        next()
      }
    }
  },
  {
    path: '/classlist/:id',
    name: 'ClassDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/ClassDetail.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("user")) {
        next({ name: 'Login' })
      } else {
        next()
      }
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("user")) {
        next({ name: 'Login' })
      } else {
        next()
      }
    }
  },
  {
    path: '*', // 页面不存在的情况下会跳到404页面
    redirect: '/',
    name: 'notFound',
    hidden: true
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
