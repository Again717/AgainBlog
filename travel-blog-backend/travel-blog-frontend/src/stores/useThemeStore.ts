import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    return {
      theme: savedTheme || 'light' // 默认白天模式
    }
  },
  actions: {
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      localStorage.setItem('theme', theme)
      this.applyTheme()
    },
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark-theme')
        document.documentElement.classList.remove('light-theme')
      } else {
        document.documentElement.classList.add('light-theme')
        document.documentElement.classList.remove('dark-theme')
      }
    }
  },
  getters: {
    isDark: (state) => state.theme === 'dark',
    isLight: (state) => state.theme === 'light'
  }
})

