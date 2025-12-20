import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  username: string
  email?: string
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
    clearUser() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})

