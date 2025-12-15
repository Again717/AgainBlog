import axios from 'axios'
import { useUserStore } from '../stores/useUserStore'

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 Pinia store 获取 token
    const userStore = useUserStore()
    const token = userStore.token || localStorage.getItem('token')
    
    // 如果存在 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器（可选，用于处理错误）
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 处理网络错误
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_NAME_NOT_RESOLVED' || error.message?.includes('Network Error')) {
      console.error('网络连接失败:', error.message)
      console.warn('请确保后端服务器正在运行: http://localhost:3000')
      // 可以在这里显示友好的错误提示
      if (typeof window !== 'undefined') {
        const isDevelopment = import.meta.env.DEV
        if (isDevelopment) {
          console.warn('💡 提示: 请启动后端服务器')
          console.warn('   运行命令: cd travel-blog-backend && npm run dev')
        }
      }
    }
    
    // 可以在这里处理 401 未授权等错误
    if (error.response?.status === 401) {
      // 清除用户信息并跳转到登录页
      const userStore = useUserStore()
      userStore.clearUser()
      localStorage.removeItem('token')
      // 注意：这里不能直接使用 router，因为可能会造成循环依赖
      // 可以在路由守卫中处理
    }
    return Promise.reject(error)
  }
)

export default request








