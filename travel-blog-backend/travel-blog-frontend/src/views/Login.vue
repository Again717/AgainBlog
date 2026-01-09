<template>
  <div class="login-page">
    <!-- 登录表单区域 - 居中 -->
    <div class="login-center">
      <transition name="form-slide" mode="out-in">
        <div :key="isRegister ? 'register' : 'login'" class="login-form-container">
          <div class="form-header">
            <h2 class="form-title">{{ isRegister ? '创建账户' : '欢迎回来' }}</h2>
            <p class="form-subtitle">{{ isRegister ? '加入我们，开始你的旅行故事' : '登录你的账户以继续探索' }}</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="login-form">
          <div v-if="isRegister" class="form-group">
            <label>用户名</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              required
              minlength="3"
              maxlength="20"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>邮箱</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="请输入邮箱"
              required
              class="form-input"
            />
          </div>
          
          <div v-if="isRegister" class="form-group">
            <label>邮箱验证码</label>
            <div class="verification-code-group">
              <input
                v-model="form.verificationCode"
                type="text"
                placeholder="请输入验证码"
                required
                maxlength="6"
                class="form-input code-input"
              />
              <button 
                type="button" 
                class="send-code-btn" 
                :disabled="codeSent || codeCountdown > 0"
                @click="sendVerificationCode"
              >
                {{ codeCountdown > 0 ? `${codeCountdown}秒` : (codeSent ? '已发送' : '发送验证码') }}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              required
              minlength="8"
              class="form-input"
            />
          </div>
          
          <div v-if="!isRegister" class="hold-to-verify">
            <button 
              type="button"
              class="hold-button"
              :class="{ holding: isHolding, verified: isVerified }"
              @mousedown="startHold"
              @mouseup="endHold"
              @mouseleave="endHold"
              @touchstart="startHold"
              @touchend="endHold"
              :disabled="isVerified || loading"
            >
              <span class="hold-progress" :style="{ width: holdProgress + '%' }"></span>
              <span class="hold-text">
                {{ isVerified ? '✓ 已验证' : (isHolding ? '保持按住...' : '长按验证') }}
              </span>
            </button>
          </div>
          
          <button 
            type="submit" 
            class="submit-button" 
            :disabled="loading || (!isRegister && !isVerified)"
          >
            <span v-if="loading" class="button-loading"></span>
            <span>{{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}</span>
          </button>
        </form>
        
        <div class="switch-mode">
          <span class="switch-text">{{ isRegister ? '已有账户？' : '还没有账户？' }}</span>
          <button type="button" class="switch-button" @click="toggleMode">
            {{ isRegister ? '去登录' : '去注册' }}
          </button>
        </div>
        </div>
      </transition>
    </div>
    
    <!-- 验证码发送成功弹窗 -->
    <VerificationCodeModal 
      v-if="showVerificationModal" 
      :email="form.email"
      @close="showVerificationModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onActivated, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/useUserStore'
import { useThemeStore } from '../stores/useThemeStore'
import VerificationCodeModal from '../components/VerificationCodeModal.vue'
import * as auth from '../api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 是否为注册模式
const isRegister = ref(false)

// 验证码弹窗
const showVerificationModal = ref(false)

// 加载状态
const loading = ref(false)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  password: '',
  verificationCode: '' // 邮箱验证码
})

// 验证码相关
const codeSent = ref(false)
const codeCountdown = ref(0)
let codeTimerInterval: number | null = null

// 长按验证相关
const isHolding = ref(false)
const isVerified = ref(false)
const holdProgress = ref(0)
let holdTimer: number | null = null
let holdInterval: number | null = null

// 切换登录/注册模式
const toggleMode = () => {
  isRegister.value = !isRegister.value
  // 重置表单和状态
  form.username = ''
  form.email = ''
  form.password = ''
  form.verificationCode = ''
  isVerified.value = false
  holdProgress.value = 0
  if (holdTimer) clearTimeout(holdTimer)
  if (holdInterval) clearInterval(holdInterval)
  // 切换模式后尝试恢复倒计时，避免状态被重置
  restoreCountdown()
}

// 恢复倒计时状态
const restoreCountdown = () => {
  // 如果已经有定时器在运行，不重复启动
  if (codeTimerInterval) {
    return
  }
  
  try {
    const savedData = localStorage.getItem('verificationCodeCountdown')
    if (!savedData) {
      return
    }
    
    const { email: savedEmail, endTime } = JSON.parse(savedData)
    const now = Date.now()
    const remaining = Math.ceil((endTime - now) / 1000)
    
    // 如果倒计时已过期，清除保存的数据
    if (remaining <= 0) {
      localStorage.removeItem('verificationCodeCountdown')
      codeSent.value = false
      codeCountdown.value = 0
      return
    }
    
    // 恢复倒计时状态（不管邮箱是否匹配，因为用户可能还没输入邮箱）
    codeSent.value = true
    codeCountdown.value = remaining
    
    // 启动倒计时
    codeTimerInterval = window.setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(codeTimerInterval!)
        codeTimerInterval = null
        codeSent.value = false
        codeCountdown.value = 0
        localStorage.removeItem('verificationCodeCountdown')
      } else {
        // 更新保存的结束时间
        const currentEmail = form.email || savedEmail
        const newEndTime = Date.now() + codeCountdown.value * 1000
        localStorage.setItem('verificationCodeCountdown', JSON.stringify({
          email: currentEmail,
          endTime: newEndTime
        }))
      }
    }, 1000)
  } catch (error) {
    console.error('恢复倒计时状态失败:', error)
    localStorage.removeItem('verificationCodeCountdown')
    codeSent.value = false
    codeCountdown.value = 0
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!form.email) {
    alert('请先输入邮箱')
    return
  }
  
  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    alert('请输入正确的邮箱格式')
    return
  }
  
  // 检查是否已有倒计时在运行
  if (codeCountdown.value > 0) {
    return
  }
  
  // 检查 localStorage 中是否有未过期的倒计时（无论当前邮箱输入如何，都要先尊重旧的倒计时）
  try {
    const savedData = localStorage.getItem('verificationCodeCountdown')
    if (savedData) {
      const { endTime } = JSON.parse(savedData)
      const now = Date.now()
      const remaining = Math.ceil((endTime - now) / 1000)
      if (remaining > 0) {
        codeSent.value = true
        codeCountdown.value = remaining
        if (!codeTimerInterval) {
          codeTimerInterval = window.setInterval(() => {
            codeCountdown.value--
            if (codeCountdown.value <= 0) {
              clearInterval(codeTimerInterval!)
              codeTimerInterval = null
              codeSent.value = false
              localStorage.removeItem('verificationCodeCountdown')
            } else {
              const newEndTime = Date.now() + codeCountdown.value * 1000
              localStorage.setItem('verificationCodeCountdown', JSON.stringify({
                email: form.email,
                endTime: newEndTime
              }))
            }
          }, 1000)
        }
        return
      }
    }
  } catch (error) {
    console.error('检查倒计时状态失败:', error)
  }
  
  try {
    // 调用后端API发送验证码
    const response = await auth.sendVerificationCode(form.email)
    codeSent.value = true
    codeCountdown.value = 60
    
    // 保存倒计时结束时间到 localStorage
    const endTime = Date.now() + 60 * 1000 // 60秒后
    localStorage.setItem('verificationCodeCountdown', JSON.stringify({
      email: form.email,
      endTime: endTime
    }))
    
    // 清除旧的定时器
    if (codeTimerInterval) {
      clearInterval(codeTimerInterval)
    }
    
    // 启动倒计时
    codeTimerInterval = window.setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(codeTimerInterval!)
        codeTimerInterval = null
        codeSent.value = false
        localStorage.removeItem('verificationCodeCountdown')
      } else {
        // 更新保存的结束时间
        const newEndTime = Date.now() + codeCountdown.value * 1000
        localStorage.setItem('verificationCodeCountdown', JSON.stringify({
          email: form.email,
          endTime: newEndTime
        }))
      }
    }, 1000)
    
    // 显示验证码发送成功弹窗
    showVerificationModal.value = true
  } catch (error: any) {
    console.error('发送验证码失败:', error)
    alert(error.response?.data?.message || '发送验证码失败，请重试')
  }
}

// 开始长按
const startHold = () => {
  if (isVerified.value) return
  
  isHolding.value = true
  holdProgress.value = 0
  
  holdInterval = window.setInterval(() => {
    if (holdProgress.value < 100) {
      holdProgress.value += 2
    } else {
      endHold()
      isVerified.value = true
      holdProgress.value = 100
    }
  }, 30)
}

// 结束长按
const endHold = () => {
  isHolding.value = false
  if (holdInterval) {
    clearInterval(holdInterval)
    holdInterval = null
  }
  
  if (!isVerified.value) {
    holdTimer = window.setTimeout(() => {
      holdProgress.value = 0
    }, 300)
  }
}

// 提交表单
const handleSubmit = async () => {
  loading.value = true

  try {
    if (isRegister.value) {
      // 注册 - 需要验证码
      if (!form.verificationCode) {
        alert('请输入邮箱验证码')
        loading.value = false
        return
      }
      await auth.register(form.username, form.email, form.password, form.verificationCode)
      // 注册成功后自动登录
      const loginResponse = await auth.login(form.email, form.password)
      
      if (loginResponse.token && loginResponse.user) {
        userStore.setToken(loginResponse.token)
        // 确保头像URL是完整的
        if (loginResponse.user.avatar && loginResponse.user.avatar.startsWith('/uploads/')) {
          loginResponse.user.avatar = `http://localhost:3000${loginResponse.user.avatar}`
        }
        userStore.setUserInfo(loginResponse.user)
        // 跳转到原始路径或首页
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      }
    } else {
      // 登录
      const response = await auth.login(form.email, form.password)
      
      if (response.token && response.user) {
        userStore.setToken(response.token)
        userStore.setUserInfo(response.user)
        // 跳转到原始路径或首页
        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      }
    }
  } catch (error: any) {
    console.error('操作失败:', error)
    alert(error.response?.data?.message || '操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 监听邮箱变化：不清除倒计时，始终以剩余时间为准（防止状态被重置）
watch(() => form.email, () => {
  // 仅作监听，不修改倒计时状态
}, { immediate: false })

// 组件挂载时恢复倒计时状态
onMounted(() => {
  restoreCountdown()
})

// 组件激活时也恢复倒计时状态（用于 keep-alive 场景）
onActivated(() => {
  restoreCountdown()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (codeTimerInterval) {
    clearInterval(codeTimerInterval)
  }
  if (holdTimer) {
    clearTimeout(holdTimer)
  }
  if (holdInterval) {
    clearInterval(holdInterval)
  }
})
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  width: 100%;
  padding: 2rem;
  background-color: transparent;
  position: relative;
}

/* 居中登录表单区域 */
.login-center {
  width: 100%;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: var(--bg-color, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.dark-theme .login-form-container {
  background: rgba(26, 26, 26, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color, #000000);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary, #666666);
  margin: 0;
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color, #000000);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color, rgba(0, 0, 0, 0.2));
  border-radius: 10px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: var(--bg-secondary, #ffffff);
  color: var(--text-color, #000000);
  backdrop-filter: blur(10px);
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 
    0 0 0 3px rgba(76, 175, 80, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--bg-color, #ffffff);
}

.form-input::placeholder {
  color: var(--text-secondary, #999999);
}

.dark-theme .form-input {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.dark-theme .form-input:focus {
  border-color: rgba(150, 200, 255, 0.6);
  box-shadow: 
    0 0 0 3px rgba(150, 200, 255, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.12);
}

.dark-theme .form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  background: linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #FFFFFF 100%);
  border: 1px solid rgba(135, 206, 235, 0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  box-shadow: 
    0 4px 12px rgba(135, 206, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(135, 206, 235, 0.5),
    0 0 30px rgba(135, 206, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  background: linear-gradient(135deg, #00BFFF 0%, #87CEEB 50%, #E0F7FA 100%);
  color: #ffffff;
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hold-to-verify {
  margin-bottom: 1.5rem;
}

.hold-button {
  width: 100%;
  height: 56px;
  position: relative;
  background: linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #FFFFFF 100%);
  border: 1px solid rgba(135, 206, 235, 0.3);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  box-shadow: 
    0 4px 12px rgba(135, 206, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.hold-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(135, 206, 235, 0.5),
    0 0 30px rgba(135, 206, 235, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  background: linear-gradient(135deg, #00BFFF 0%, #87CEEB 50%, #E0F7FA 100%);
  color: #ffffff;
}

.hold-button.holding {
  transform: scale(0.98);
}

.hold-button.verified {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%);
  color: #ffffff;
  cursor: default;
}

.hold-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.hold-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.1s linear;
  z-index: 1;
}

.hold-text {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.switch-mode {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.switch-text {
  color: var(--text-secondary, #666666);
  font-size: 0.9rem;
}

.switch-button {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
}

.switch-button:hover {
  color: #45a049;
  text-decoration: underline;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 6px;
}

.dark-theme .switch-text {
  color: rgba(255, 255, 255, 0.7);
}

.dark-theme .switch-button {
  color: rgba(150, 200, 255, 0.9);
}

.dark-theme .switch-button:hover {
  color: rgba(150, 200, 255, 1);
  background: rgba(150, 200, 255, 0.1);
}

/* 切换动画 */
.form-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.form-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.form-slide-enter-from {
  opacity: 0;
  transform: translateX(50px) translateY(20px) scale(0.9);
  filter: blur(10px);
}

.form-slide-leave-to {
  opacity: 0;
  transform: translateX(-50px) translateY(-20px) scale(0.9);
  filter: blur(10px);
}

.form-slide-enter-to,
.form-slide-leave-from {
  opacity: 1;
  transform: translateX(0) translateY(0) scale(1);
  filter: blur(0);
}

/* 验证码输入组 */
.verification-code-group {
  display: flex;
  gap: 0.75rem;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  flex-shrink: 0;
  padding: 0.875rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  background: #4CAF50;
  border: 1px solid #4CAF50;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-code-btn:hover:not(:disabled) {
  background: #45a049;
  border-color: #45a049;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-1px);
}

.send-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.dark-theme .send-code-btn {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.dark-theme .send-code-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(135, 206, 235, 0.4);
}

/* 移动端优化 */
@media (max-width: 480px) {
  .login-page {
    padding: 1.5rem 1rem;
  }

  .login-form-container {
    padding: 0;
  }

  .form-header {
    margin-bottom: 2rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.9rem;
  }
}
</style>
