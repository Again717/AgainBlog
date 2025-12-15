<template>
  <div class="app" :class="[{ 'no-background': isCommunityPage, 'dark-theme': themeStore.isDark, 'light-theme': themeStore.isLight }]">
    <!-- 背景动画：仅黑夜模式显示，社区页面不显示 -->
    <div class="background-animation" v-if="!isCommunityPage && themeStore.isDark">
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
          <RouterLink to="/" class="nav-item">{{ languageStore.isZh ? '首页' : 'Home' }}</RouterLink>
          <RouterLink to="/stories" class="nav-item">{{ languageStore.isZh ? '旅行故事' : 'Stories' }}</RouterLink>
          <RouterLink to="/tips" class="nav-item">{{ languageStore.isZh ? '攻略分享' : 'Tips' }}</RouterLink>
          <RouterLink to="/community" class="nav-item">{{ languageStore.isZh ? '社区' : 'Community' }}</RouterLink>
          <RouterLink to="/login" class="nav-item">{{ languageStore.isZh ? '登录' : 'Login' }}</RouterLink>
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
import { RouterLink, RouterView, useRoute } from 'vue-router'
import WelcomeModal from './components/WelcomeModal.vue'
import { useLanguageStore } from './stores/useLanguageStore'
import { useThemeStore } from './stores/useThemeStore'

const route = useRoute()
const showWelcome = ref(false)
const languageStore = useLanguageStore()
const themeStore = useThemeStore()
const isHeaderHidden = ref(false)
const showBackToTop = ref(false)

// 检查当前路由是否是社区页面
const isCommunityPage = computed(() => route.path === '/community')


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

onMounted(() => {
  // 应用主题
  themeStore.applyTheme()
  
  // 检查是否已经看过欢迎弹窗
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
  if (!hasSeenWelcome) {
    showWelcome.value = true
  }
  
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

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
  color: #000000;
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
  backdrop-filter: blur(5px);
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
  margin-top: 60px;
  padding-top: 0;
}

.header.hidden {
  transform: translateY(-100%);
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

.nav-item:hover {
  color: #ffffff;
  transform: translateX(-5px);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
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
}

.nav-item.theme-switch:hover,
.nav-item.lang-switch:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: none;
}

.nav-item.theme-switch::after,
.nav-item.lang-switch::after {
  display: none;
}

.app.no-background {
  background-color: var(--bg-color, #ffffff);
  transition: background-color 0.3s ease;
}

.app.no-background.dark-theme {
  background-color: var(--bg-color, #000000);
}

.app.no-background .background-animation {
  display: none;
}

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
</style>
