import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import CommunityView from '../views/CommunityView.vue'
import TipsView from '../views/TipsView.vue'

// 扩展路由元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: false // 临时设置为 false 用于测试，后续可改回 true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false // 登录页不需要认证
    }
  },
  {
    path: '/community',
    name: 'community',
    component: CommunityView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/tips',
    name: 'tips',
    component: TipsView,
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫 - 暂时注释掉用于调试
// router.beforeEach((to, from, next) => {
//   // 如果路由需要认证
//   if (to.meta.requiresAuth) {
//     try {
//       // 从 localStorage 或 store 获取 token
//       const userStore = useUserStore()
//       const token = userStore.token || localStorage.getItem('token')

//       // 如果用户未登录，重定向到登录页
//       if (!token) {
//         next({
//           path: '/login',
//           query: { redirect: to.fullPath } // 保存原始路径，登录后可以跳转回来
//         })
//       } else {
//         // 已登录，继续访问
//         next()
//       }
//     } catch (error) {
//       // 如果 store 还没初始化，直接从 localStorage 读取
//       const token = localStorage.getItem('token')
//       if (!token) {
//         next({
//           path: '/login',
//           query: { redirect: to.fullPath }
//         })
//       } else {
//         next()
//       }
//     }
//   } else {
//     // 不需要认证的路由，直接访问
//     next()
//   }
// })

export default router
