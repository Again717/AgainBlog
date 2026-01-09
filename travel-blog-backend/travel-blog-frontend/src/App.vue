<template>
  <div class="app" :class="[{ 'no-background': isCommunityPage, 'dark-theme': themeStore.isDark, 'light-theme': themeStore.isLight }]">
    <!-- 背景动画：仅黑夜模式显示，所有页面都显示 -->
    <div class="background-animation" v-if="themeStore.isDark">
      <div class="stars"></div>
      <div class="stars-layer-2"></div>
      <div class="stars-layer-3"></div>
    </div>
    
    <!-- 页面标题 - 最顶部 -->
    <div class="page-title-absolute">
      <h1 class="main-title-absolute">{{ languageStore.isZh ? 'Again Blog' : 'Again Blog' }}</h1>
    </div>
    
    <!-- 导航栏 -->
    <header class="header" :class="{ hidden: isHeaderHidden }">
      <div class="header-container">
        <nav class="nav-menu-vertical right-aligned">
          <!-- 用户头像（登录后显示） -->
          <div v-if="userStore.token && userStore.userInfo" class="user-avatar-nav" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <div class="avatar-circle">
              <img v-if="getAvatarUrl(userStore.userInfo.avatar)" :src="getAvatarUrl(userStore.userInfo.avatar)" :alt="'Avatar for ' + userStore.userInfo.username" @error="handleAvatarError" />
              <span v-else>{{ userStore.userInfo.username?.charAt(0).toUpperCase() || 'U' }}</span>
            </div>
            <!-- 下拉菜单 -->
            <transition name="fade-menu">
              <div v-if="showUserMenu" class="user-menu-dropdown">
                <div class="menu-header">
                  <div class="menu-avatar">
                    <img v-if="getAvatarUrl(userStore.userInfo.avatar)" :src="getAvatarUrl(userStore.userInfo.avatar)" alt="avatar" />
                    <span v-else>{{ userStore.userInfo.username?.charAt(0).toUpperCase() || 'U' }}</span>
                  </div>
                  <div class="menu-user-info">
                    <div class="menu-username">{{ userStore.userInfo.username }}</div>
                    <div class="menu-email">{{ userStore.userInfo.email || '' }}</div>
                  </div>
                </div>
                <div class="menu-divider"></div>
                <button class="menu-item profile-item" @click="openUserProfileModal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{{ languageStore.isZh ? '编辑个人信息' : 'Edit Profile' }}</span>
                </button>
                <div class="menu-divider"></div>
                <button class="menu-item logout-item" @click="handleLogout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>{{ languageStore.isZh ? '退出登录' : 'Logout' }}</span>
                </button>
              </div>
            </transition>
          </div>
          <RouterLink to="/" class="nav-item">{{ languageStore.isZh ? '首页' : 'Home' }}</RouterLink>
          <RouterLink to="/tips" class="nav-item">{{ languageStore.isZh ? '攻略分享' : 'Travel Tips' }}</RouterLink>
          <RouterLink to="/community" class="nav-item">{{ languageStore.isZh ? '社区' : 'Community' }}</RouterLink>
          <RouterLink v-if="!userStore.token" to="/login" class="nav-item">{{ languageStore.isZh ? '登录' : 'Login' }}</RouterLink>
          <button class="nav-item theme-switch" @click="themeStore.toggleTheme()" :title="themeStore.isDark ? (languageStore.isZh ? '切换到白天模式' : 'Switch to Light Mode') : (languageStore.isZh ? '切换到夜间模式' : 'Switch to Dark Mode')">
            <svg v-if="themeStore.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          <button class="nav-item lang-switch" @click="languageStore.toggleLanguage()">
            {{ languageStore.isZh ? 'EN' : '中' }}
          </button>
        </nav>
      </div>
    </header>

    <!-- 欢迎弹窗 -->
    <WelcomeModal v-if="showWelcome" @close="handleWelcomeClose" />

    <!-- 用户信息编辑弹窗 -->
    <ProfileEditModal
      v-if="showUserProfileModal"
      :user-info="userStore.userInfo"
      @close="showUserProfileModal = false"
      @saved="handleProfileSaved"
      @email-change="handleEmailChangeRequest"
    />

    <!-- 邮箱修改弹窗 -->
    <EmailChangeModal
      v-if="showEmailModal"
      :user-info="userStore.userInfo"
      :mode="emailModalMode"
      @close="showEmailModal = false"
      @confirmed="handleEmailChangeConfirmed"
    />

    <!-- 主要内容区域 -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <button 
        v-if="showBackToTop" 
        class="back-to-top" 
        @click="scrollToTop"
        aria-label="回到顶部"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import WelcomeModal from './components/WelcomeModal.vue'
import ProfileEditModal from './components/ProfileEditModal.vue'
import EmailChangeModal from './components/EmailChangeModal.vue'
import { useLanguageStore } from './stores/useLanguageStore'
import { useThemeStore } from './stores/useThemeStore'
import { useUserStore } from './stores/useUserStore'

const route = useRoute()
const router = useRouter()
const showWelcome = ref(false)
const languageStore = useLanguageStore()
const themeStore = useThemeStore()
const userStore = useUserStore()
const isHeaderHidden = ref(false)
const showBackToTop = ref(false)
const showUserMenu = ref(false)
// 模态框状态
const showUserProfileModal = ref(false)
const showEmailModal = ref(false)
const emailModalMode = ref<'password' | 'email'>('password')

// 检查当前路由是否是社区页面
const isCommunityPage = computed(() => route.path === '/community')


// 刷新用户信息（用于更新头像等信息）
const refreshUserInfo = async () => {
  if (userStore.token && userStore.userInfo?.email) {
    try {
      // 使用当前用户的邮箱重新登录以获取最新信息
      const response = await login(userStore.userInfo.email, 'dummy_password')
      if (response.token && response.user) {
        userStore.setToken(response.token)
        userStore.setUserInfo(response.user)
        console.log('✅ 用户信息已刷新')
      }
    } catch (error) {
      console.warn('刷新用户信息失败，保持当前信息')
    }
  }
}

// 处理头像URL，确保兼容性
const getAvatarUrl = (avatar: string | undefined): string | undefined => {
  if (!avatar) return undefined

  // 如果是data URL，不使用（会导致HTTP请求错误），返回undefined使用placeholder
  if (avatar.startsWith('data:')) {
    return undefined
  }

  // 如果是相对路径，添加完整的base URL
  if (avatar.startsWith('/uploads/')) {
    return `http://localhost:3000${avatar}`
  }

  // 如果是完整的HTTP URL，直接返回
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }

  // 其他情况，返回undefined让组件使用placeholder
  return undefined
}

// 处理头像加载错误
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('头像加载失败:', img.src)
  img.style.display = 'none'
  // 显示备用文本
  const parent = img.parentElement
  if (parent) {
    const fallback = document.createElement('span')
    fallback.textContent = userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U'
    fallback.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      border-radius: 50%;
    `
    parent.appendChild(fallback)
  }
}

// 监听滚动
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const headerHeight = 100 // 导航栏高度

  isHeaderHidden.value = scrollTop > headerHeight
  showBackToTop.value = scrollTop > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  // 应用主题
  themeStore.applyTheme()

  // 检查是否已经看过欢迎弹窗
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
  if (!hasSeenWelcome) {
    showWelcome.value = true
  }

  // 刷新用户信息（确保头像等信息是最新的）
  await userStore.refreshUserInfo()

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleWelcomeClose = () => {
  showWelcome.value = false
  localStorage.setItem('hasSeenWelcome', 'true')
}

// 打开用户信息编辑弹窗
const openUserProfileModal = () => {
  showUserProfileModal.value = true
}

// 处理个人资料保存
const handleProfileSaved = (user: any) => {
  showUserProfileModal.value = false
  // 用户store已在组件内部更新
}

// 处理邮箱修改请求
const handleEmailChangeRequest = (mode: 'password' | 'email') => {
  emailModalMode.value = mode
  showEmailModal.value = true
}

// 处理邮箱修改确认
const handleEmailChangeConfirmed = (user: any) => {
  showEmailModal.value = false
  showUserProfileModal.value = false // 关闭主弹窗
  // 用户store已在组件内部更新
}

const handleLogout = () => {
  userStore.clearUser()
  showUserMenu.value = false
  router.push('/')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #000000;
  background-color: #ffffff;
  overflow-x: hidden;
}

/* 白天模式默认样式 */
body.light-theme {
  color: #000000;
  background-color: #ffffff;
}

/* 夜间模式样式 */
body.dark-theme {
  color: #ffffff;
  background-color: #000000;
}

/* 统一容器样式 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
}

.app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
  color: #000000;
  overflow: hidden;
}

.app.light-theme {
  background-color: #ffffff;
  color: #000000;
}

.app.dark-theme {
  background-color: #000000;
  color: #ffffff;
}

/* 背景动画：闪烁的星星 - 布满整个页面 */
.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
  background-color: transparent;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(1.5px 1.5px at 60% 70%, white, transparent),
    radial-gradient(1.2px 1.2px at 50% 50%, white, transparent),
    radial-gradient(1.5px 1.5px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 80%, white, transparent),
    radial-gradient(1px 1px at 30% 60%, white, transparent),
    radial-gradient(2px 2px at 10% 40%, white, transparent),
    radial-gradient(1.5px 1.5px at 70% 20%, white, transparent),
    radial-gradient(1.3px 1.3px at 45% 15%, white, transparent),
    radial-gradient(1px 1px at 85% 55%, white, transparent),
    radial-gradient(2px 2px at 25% 75%, white, transparent),
    radial-gradient(1.5px 1.5px at 65% 35%, white, transparent),
    radial-gradient(1.8px 1.8px at 35% 25%, white, transparent),
    radial-gradient(1.2px 1.2px at 75% 45%, white, transparent),
    radial-gradient(2px 2px at 55% 85%, white, transparent),
    radial-gradient(1px 1px at 15% 65%, white, transparent),
    radial-gradient(2.2px 2.2px at 95% 35%, white, transparent),
    radial-gradient(1.5px 1.5px at 42% 52%, white, transparent),
    radial-gradient(1.3px 1.3px at 58% 62%, white, transparent),
    radial-gradient(1.8px 1.8px at 28% 48%, white, transparent);
  background-repeat: repeat;
  background-size: 400px 400px;
  animation: twinkle 2.5s ease-in-out infinite;
  opacity: 1 !important;
}

.stars::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-image: 
    radial-gradient(1px 1px at 25% 25%, white, transparent),
    radial-gradient(1.2px 1.2px at 75% 75%, white, transparent),
    radial-gradient(1.8px 1.8px at 40% 10%, white, transparent),
    radial-gradient(1.2px 1.2px at 90% 50%, white, transparent),
    radial-gradient(1.8px 1.8px at 15% 80%, white, transparent),
    radial-gradient(1px 1px at 55% 45%, white, transparent),
    radial-gradient(1.2px 1.2px at 35% 65%, white, transparent),
    radial-gradient(1.8px 1.8px at 95% 25%, white, transparent),
    radial-gradient(1.3px 1.3px at 48% 38%, white, transparent),
    radial-gradient(1.1px 1.1px at 68% 72%, white, transparent),
    radial-gradient(1.5px 1.5px at 22% 58%, white, transparent),
    radial-gradient(0.9px 0.9px at 82% 18%, white, transparent);
  background-repeat: repeat;
  background-size: 600px 600px;
  animation: twinkle2 3.5s ease-in-out infinite reverse;
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
  }
  25% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.2;
  }
}

@keyframes twinkle2 {
  0% {
    opacity: 0.1;
  }
  30% {
    opacity: 0.9;
  }
  60% {
    opacity: 0.3;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
}

@keyframes twinkle3 {
  0% {
    opacity: 0.4;
  }
  20% {
    opacity: 0.1;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.4;
  }
}

/* 第二层星星 */
.stars-layer-2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-image: 
    radial-gradient(1.2px 1.2px at 12% 18%, white, transparent),
    radial-gradient(1px 1px at 38% 52%, white, transparent),
    radial-gradient(1.5px 1.5px at 72% 28%, white, transparent),
    radial-gradient(1.1px 1.1px at 88% 68%, white, transparent),
    radial-gradient(1.3px 1.3px at 28% 82%, white, transparent),
    radial-gradient(0.9px 0.9px at 62% 45%, white, transparent),
    radial-gradient(1.6px 1.6px at 15% 55%, white, transparent),
    radial-gradient(1.2px 1.2px at 85% 15%, white, transparent),
    radial-gradient(1px 1px at 52% 72%, white, transparent),
    radial-gradient(1.5px 1.5px at 33% 38%, white, transparent),
    radial-gradient(1.1px 1.1px at 68% 42%, white, transparent),
    radial-gradient(1.4px 1.4px at 42% 28%, white, transparent);
  background-repeat: repeat;
  background-size: 750px 750px;
  animation: twinkle3 3s ease-in-out infinite;
}

/* 第三层星星 */
.stars-layer-3 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-image: 
    radial-gradient(1.1px 1.1px at 22% 35%, white, transparent),
    radial-gradient(1.3px 1.3px at 58% 75%, white, transparent),
    radial-gradient(1px 1px at 78% 42%, white, transparent),
    radial-gradient(1.5px 1.5px at 45% 88%, white, transparent),
    radial-gradient(0.9px 0.9px at 92% 25%, white, transparent),
    radial-gradient(1.2px 1.2px at 35% 62%, white, transparent),
    radial-gradient(1.6px 1.6px at 65% 18%, white, transparent),
    radial-gradient(1.1px 1.1px at 18% 78%, white, transparent),
    radial-gradient(1.3px 1.3px at 82% 55%, white, transparent),
    radial-gradient(1px 1px at 48% 32%, white, transparent),
    radial-gradient(1.4px 1.4px at 72% 68%, white, transparent),
    radial-gradient(0.8px 0.8px at 38% 48%, white, transparent);
  background-repeat: repeat;
  background-size: 850px 850px;
  animation: twinkle2 4s ease-in-out infinite reverse;
}

/* 页面标题 - 最顶部固定 */
.page-title-absolute {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  z-index: 200;
  pointer-events: none;
  background: transparent;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-title-absolute {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.15em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: titleGlow 3s ease-in-out infinite;
  margin: 0;
  line-height: 1.5;
  height: 100%;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    opacity: 0.9;
  }
  50% {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 25px rgba(255, 255, 255, 0.4);
    opacity: 1;
  }
}

/* 白天模式下的页面标题样式 */
.light-theme .main-title-absolute {
  color: #1f2937;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6);
}

.header {
  background-color: transparent;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 60px;
  right: 2rem;
  z-index: 100;
  transition: transform 0.3s ease;
  height: auto;
  line-height: normal;
  width: auto;
}

/* 确保所有内容都在标题下方 */
.main-content {
  margin-top: 0;
  padding-top: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}

.header.hidden {
  transform: translateY(calc(-100% - 60px));
  opacity: 0;
  pointer-events: none;
}

.header-container {
  max-width: none;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  padding: 0;
}

.nav-menu-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.nav-item {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s;
  white-space: nowrap;
  padding: 0.5rem 0;
  position: relative;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* 白天模式下的导航栏文字样式 */
.light-theme .nav-item {
  color: #1f2937;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6);
}

.nav-item:hover {
  color: #ffffff;
  transform: translateX(-5px);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

/* 白天模式下导航栏悬停状态 */
.light-theme .nav-item:hover {
  color: #374151;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 2px;
  background-color: #ffffff;
  transition: width 0.3s;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

/* 白天模式下导航栏下划线 */
.light-theme .nav-item::after {
  background-color: #1f2937;
  box-shadow: 0 0 5px rgba(31, 41, 55, 0.8);
}

.nav-item:hover::after {
  width: 100%;
}

.nav-item.theme-switch,
.nav-item.lang-switch {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* 白天模式下切换按钮样式 */
.light-theme .nav-item.theme-switch,
.light-theme .nav-item.lang-switch {
  background: rgba(31, 41, 55, 0.1);
  border: 1px solid rgba(31, 41, 55, 0.3);
  color: #1f2937;
}

.nav-item.theme-switch:hover,
.nav-item.lang-switch:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: none;
}

/* 白天模式下切换按钮悬停状态 */
.light-theme .nav-item.theme-switch:hover,
.light-theme .nav-item.lang-switch:hover {
  background: rgba(31, 41, 55, 0.2);
  border-color: rgba(31, 41, 55, 0.5);
}

.nav-item.theme-switch::after,
.nav-item.lang-switch::after {
  display: none;
}

/* 用户头像导航 */
.user-avatar-nav {
  position: relative;
  margin-bottom: 1rem;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* 用户下拉菜单 */
.user-menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 240px;
  background: var(--bg-color, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.3));
  padding: 1rem 0;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem 1rem;
}

.menu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  overflow: hidden;
}

.menu-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-user-info {
  flex: 1;
  min-width: 0;
}

.menu-username {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color, #000000);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-email {
  font-size: 0.8rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.6));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-divider {
  height: 1px;
  background: var(--border-color, rgba(0, 0, 0, 0.1));
  margin: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color, #000000);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--bg-secondary, rgba(0, 0, 0, 0.05));
}

.menu-item svg {
  flex-shrink: 0;
  opacity: 0.7;
}

.menu-item.logout-item {
  color: #ef4444;
}

.menu-item.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.fade-menu-enter-active,
.fade-menu-leave-active {
  transition: all 0.2s ease;
}

.fade-menu-enter-from,
.fade-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.app.no-background {
  background-color: var(--bg-color, #ffffff);
  transition: background-color 0.3s ease;
}

.app.no-background.dark-theme {
  background-color: var(--bg-color, #000000);
}

/* 移除社区页面星星背景隐藏的限制，让所有页面都能显示星星背景 */

.main-content {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 2;
  margin-top: 60px;
  background-color: transparent;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.back-to-top:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
}

.back-to-top:active {
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}


@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-menu-vertical {
    order: 3;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1rem;
  }

  .nav-item.lang-switch {
    margin-top: 0;
    margin-left: auto;
  }

}

/* 用户信息编辑弹窗样式 */
.user-profile-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.user-profile-modal {
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #000000);
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--text-secondary, rgba(0, 0, 0, 0.6));
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-color, #000000);
}

.modal-body {
  padding: 1.5rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-color, #000000);
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.2));
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
}

.current-avatar:hover {
  transform: scale(1.05);
}

.current-avatar img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid var(--border-color, rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.8rem;
  text-align: center;
  padding: 0.25rem;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.remove-avatar-btn {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid #dc2626;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-avatar-btn:hover {
  background: rgba(220, 38, 38, 0.2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.save-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary, rgba(0, 0, 0, 0.7));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.2));
}

.cancel-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 640px) {
  .user-profile-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }

  .modal-header,
  .modal-body {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}

/* 邮箱修改相关样式 */
.current-email-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.current-email {
  font-weight: 500;
  color: #374151;
}

.email-change-buttons {
  display: flex;
  gap: 0.5rem;
}

.email-change-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.email-change-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.password-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.code-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

/* 邮箱修改弹窗样式 */
.email-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.email-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
}

.current-email-info {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #3b82f6;
}

.info-label {
  font-weight: 600;
  color: #374151;
}

.current-email-value {
  color: #6b7280;
  font-family: monospace;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  background: #2563eb;
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.email-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.email-input-group .form-input {
  flex: 1;
}

.send-verification-btn {
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 120px;
}

.send-verification-btn:hover:not(:disabled) {
  background: #2563eb;
}

.send-verification-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.verification-hint {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .current-email-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .email-change-buttons {
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
  }

  .email-change-btn {
    justify-content: center;
    width: 100%;
  }

  .email-modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .cancel-btn,
  .confirm-btn {
    width: 100%;
  }

  .email-input-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .send-verification-btn {
    align-self: flex-start;
  }
}
</style>
