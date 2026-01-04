<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
      <div class="modal-header">
        <h2 class="modal-title">{{ languageStore.isZh ? '验证码已发送' : 'Verification Code Sent' }}</h2>
      </div>
      <div class="modal-body">
        <p class="modal-text">
          {{ languageStore.isZh 
            ? `验证码已发送到您的邮箱：${email}` 
            : `Verification code has been sent to your email: ${email}` }}
        </p>
        <p class="modal-tip">
          {{ languageStore.isZh 
            ? '请查收邮件并输入验证码，验证码有效期为5分钟' 
            : 'Please check your email and enter the code. The code is valid for 5 minutes' }}
        </p>
      </div>
      <div class="modal-footer">
        <button class="confirm-btn" @click="handleClose">
          {{ languageStore.isZh ? '我知道了' : 'Got it' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '../stores/useLanguageStore'

const languageStore = useLanguageStore()

const props = defineProps<{
  email: string
}>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(4px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-color, #ffffff);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--border-color, #e5e5e5);
}

@keyframes slideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #4CAF50;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color, #000000);
  margin: 0;
  line-height: 1.3;
}

.modal-body {
  margin-bottom: 2rem;
  text-align: center;
}

.modal-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color, #000000);
  margin-bottom: 1rem;
  word-break: break-all;
}

.modal-tip {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-secondary, #666666);
  margin: 0;
}

.modal-footer {
  text-align: center;
}

.confirm-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #45a049 0%, #5cb85c 100%);
}

.confirm-btn:active {
  transform: translateY(0);
}

/* 暗色模式适配 */
.dark-theme .modal-content {
  background: var(--bg-color, #1a1a1a);
  border-color: var(--border-color, #333333);
}

.dark-theme .modal-title {
  color: var(--text-color, #ffffff);
}

.dark-theme .modal-text {
  color: var(--text-color, #ffffff);
}

.dark-theme .modal-tip {
  color: var(--text-secondary, #cccccc);
}
</style>














