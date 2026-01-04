import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    language: (localStorage.getItem('language') as 'zh' | 'en') || 'zh'
  }),
  actions: {
    setLanguage(lang: 'zh' | 'en') {
      this.language = lang
      localStorage.setItem('language', lang)
    },
    toggleLanguage() {
      this.setLanguage(this.language === 'zh' ? 'en' : 'zh')
    }
  },
  getters: {
    isZh: (state) => state.language === 'zh',
    isEn: (state) => state.language === 'en'
  }
})



















