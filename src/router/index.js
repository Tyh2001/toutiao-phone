import Vue from 'vue'
import VueRouter from 'vue-router'
// 加载 Vant 弹出框
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    // 给路由添加额外的数据
    // 可以通过里面数量的真假来判断是否可以访问
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      // 首页
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      },
      // 问答
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa'),
        meta: { requiresAuth: false }
      },
      // 视频
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video'),
        meta: { requiresAuth: false }
      },
      // 我的
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my'),
        meta: { requiresAuth: false }
      }
    ]
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search'),
    meta: { requiresAuth: true }
  },
  // 文章详情页面
  // 这里是动态路由 要把文章 id 传递进来
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 使用 props 传参
    // 将动态路由传参映射到组件的 props 中 无论是访问还是维护都比较方便
    props: true,
    meta: { requiresAuth: true }
  },
  // 编辑个人信息
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user'),
    meta: { requiresAuth: true }
  },
  // 小智同学页面
  {
    path: '/userChat',
    name: 'userChat',
    component: () => import('@/views/userChat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// 导航守卫
// to 要访问的页面
// from 来自页面信息
// next 放行的标记
router.beforeEach((to, from, next) => {
  // 如果访问页面的这个属性为真 那么就代表需要登录
  if (to.meta.requiresAuth) {
    // 校验登录状态
    // 如果已经登录 直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登录 提示是否需要登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗？'
    })
      .then(() => {
        // 确认执行这个
        next('/login')
      })
      .catch(() => {
        // 取消执行这里 那就停止路由导航
        next(false)
      })
  } else {
    // 不需要登录状态的页面 直接放行
    next()
  }
})

export default router
