import Vue from 'vue'
import VueRouter from 'vue-router'
// import ClassList from "../views/ClassList";
Vue.use(VueRouter)

const routes = [
  {
    path: '/apiTest',
    name: 'ApiTest',
    meta: { name: "ApiTest" },
    component: () => import('../views/ApiTest.vue')
  },
  {
    path: '/',
    name: 'Home',
    meta: { name: "Home" },
    component: () => import('../views/Home.vue'),
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem("token")) {
        next({ name: 'ClassList' })
      } else {
        next()
      }
    }
  },
  {
    path: '/classlist',
    name: 'ClassList',
    component: () => import('../views/ClassList.vue'),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("token")) {
        next({ name: 'Home' })
      } else {
        console.log("ClassList");
        next()
      }
    }
  },
  {
    path: '/courseEpisode/:name/:courseSeq/:subjectString',
    name: 'CourseEpisode',
    props: true,
    component: () => import('../views/CourseEpisode.vue'),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("token")) {
        next({ name: 'Home' })
      } else {
        console.log('CourseEpisode');
        next()
      }
    }
  },
  {
    path: '/course/:name/:fullName/:courseSeq/:subjString/:courseId/:videoFile/:playTimecode',
    name: 'Course',
    props: true,
    component: () => import('../views/Course.vue'),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("token")) {
        next({ name: 'Home' })
      } else {
        console.log('Course');
        next()
      }
    }
  },
  {
    path: '/quiz/:lesson_name/:fullName/:courseId/:videoFile/:lesson_hid',
    props: true,
    name: 'Quiz',
    component: () => import('../views/Quiz.vue'),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("token")) {
        next({ name: 'Home' })
      } else {
        console.log('Quiz');
        next()
      }
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    beforeEnter: (to, from, next) => {
      if (!sessionStorage.getItem("token")) {
        next({ name: 'Home' })
      } else {
        console.log('User');
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
  // base: process.env.BASE_URL,
  routes
})

export default router
