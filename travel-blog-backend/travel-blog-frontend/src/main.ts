import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './style.css'
import App from './App.vue'

// 抑制浏览器扩展相关的错误（这些错误不影响应用功能）
try {
  if (typeof window !== 'undefined' && (window as any).chrome?.runtime) {
    const chrome = (window as any).chrome
    const originalSendMessage = chrome.runtime.sendMessage
    if (originalSendMessage) {
      chrome.runtime.sendMessage = function(...args: any[]) {
        try {
          return originalSendMessage.apply(this, args)
        } catch (error: any) {
          // 忽略所有扩展连接错误
          if (error?.message?.includes('Receiving end does not exist') ||
              error?.message?.includes('message channel closed') ||
              error?.message?.includes('runtime.lastError')) {
            return Promise.resolve()
          }
          throw error
        }
      }
    }
    
    // 处理 runtime.lastError
    if (chrome.runtime.lastError) {
      const originalLastError = chrome.runtime.lastError
      Object.defineProperty(chrome.runtime, 'lastError', {
        get: function() {
          try {
            return originalLastError
          } catch (e) {
            return null
          }
        }
      })
    }
  }
} catch (e) {
  // 忽略初始化错误
}

// 全局错误处理 - 过滤浏览器扩展相关的错误
window.addEventListener('error', (event) => {
  const message = event.message || ''
  const filename = event.filename || ''
  
  // 过滤浏览器扩展相关的错误
  if (
    message.includes('runtime.lastError') ||
    message.includes('Receiving end does not exist') ||
    message.includes('message channel closed') ||
    message.includes('asynchronous response') ||
    filename.includes('content.js') ||
    filename.includes('extension://') ||
    filename.includes('chrome-extension://')
  ) {
    event.preventDefault()
    return false
  }
}, true)

// 处理未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  if (!reason) return
  
  const message = reason.message || ''
  const stack = reason.stack || ''
  
  if (
    message.includes('runtime.lastError') ||
    message.includes('Receiving end does not exist') ||
    message.includes('message channel closed') ||
    message.includes('asynchronous response') ||
    stack.includes('content.js') ||
    stack.includes('extension://') ||
    stack.includes('chrome-extension://')
  ) {
    event.preventDefault()
    return false
  }
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化主题
import { useThemeStore } from './stores/useThemeStore'
const themeStore = useThemeStore()
themeStore.applyTheme()

app.mount('#app')
