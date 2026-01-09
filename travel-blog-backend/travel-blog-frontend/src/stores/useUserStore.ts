import { defineStore } from 'pinia'
import { getCurrentUser } from '../api/auth'

interface UserInfo {
  id: string
  username: string
  email?: string
  avatar?: string
  role?: string
}

export const useUserStore = defineStore('user', {
  state: () => {
    // 安全地从 localStorage 读取数据
    let userInfo: UserInfo | null = null
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        userInfo = JSON.parse(userInfoStr)
      }
    } catch (e) {
      console.error('Failed to parse userInfo from localStorage:', e)
    }

    return {
      token: localStorage.getItem('token'),
      userInfo: userInfo
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    async refreshUserInfo() {
      if (!this.token) return

      try {
        const response = await getCurrentUser()
        if (response && response.user) {
          // 确保头像URL是完整的
          if (response.user.avatar && response.user.avatar.startsWith('/uploads/')) {
            response.user.avatar = `http://localhost:3000${response.user.avatar}`
          }
          this.setUserInfo(response.user)
          console.log('✅ 用户信息已刷新')
        } else {
          console.log('ℹ️ 使用本地缓存的用户信息')
        }
      } catch (error) {
        // 静默处理错误，避免影响应用启动
        console.warn('用户信息刷新失败，使用本地缓存信息')
      }
    },
    clearUser() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})

