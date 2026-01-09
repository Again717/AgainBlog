<template>
  <div class="email-modal-overlay" @click="handleClose">
    <div class="email-modal" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          {{ languageStore.isZh ? '修改邮箱地址' : 'Change Email Address' }}
        </h3>
        <button class="modal-close-btn" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div class="current-email-info">
          <span class="info-label">{{ languageStore.isZh ? '当前邮箱：' : 'Current Email: ' }}</span>
          <span class="current-email-value">{{ userInfo?.email }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">{{ languageStore.isZh ? '新邮箱地址' : 'New Email Address' }}</label>
          <input
            v-model="newEmail"
            type="email"
            class="form-input"
            :placeholder="languageStore.isZh ? '请输入新邮箱地址' : 'Enter new email address'"
            required
          />
        </div>

        <!-- 密码验证 -->
        <div v-if="mode === 'password'" class="form-group">
          <label class="form-label">{{ languageStore.isZh ? '当前密码' : 'Current Password' }}</label>
          <input
            v-model="currentPassword"
            type="password"
            class="form-input"
            :placeholder="languageStore.isZh ? '请输入当前密码' : 'Enter current password'"
            required
          />
        </div>

        <!-- 邮箱验证码验证 -->
        <div v-if="mode === 'email'" class="form-group">
          <label class="form-label">{{ languageStore.isZh ? '邮箱验证码' : 'Email Verification Code' }}</label>
          <div class="email-input-group">
            <input
              v-model="emailVerificationCode"
              type="text"
              class="form-input"
              :placeholder="languageStore.isZh ? '请输入验证码' : 'Enter verification code'"
              required
            />
            <button
              v-if="!emailVerificationSent"
              type="button"
              class="send-verification-btn"
              @click="sendVerificationCode"
              :disabled="sendingVerification || !newEmail.trim() || newEmail === userInfo?.email"
            >
              {{ sendingVerification ? (languageStore.isZh ? '发送中...' : 'Sending...') : (languageStore.isZh ? '发送验证码' : 'Send Code') }}
            </button>
          </div>
          <p v-if="emailVerificationSent" class="verification-hint">
            {{ languageStore.isZh ? '验证码已发送到当前邮箱，请检查邮箱并输入验证码' : 'Verification code sent to current email, please check and enter the code' }}
          </p>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="cancel-btn" @click="handleClose">
          {{ languageStore.isZh ? '取消' : 'Cancel' }}
        </button>
        <button
          type="button"
          class="confirm-btn"
          @click="confirmChange"
          :disabled="updating || !newEmail.trim() ||
                    (mode === 'password' && !currentPassword.trim()) ||
                    (mode === 'email' && !emailVerificationCode?.trim())"
        >
          {{ updating ? (languageStore.isZh ? '修改中...' : 'Updating...') : (languageStore.isZh ? '确认修改' : 'Confirm Change') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '../stores/useLanguageStore'
import { useUserStore } from '../stores/useUserStore'
import { updateProfile, sendEmailVerification } from '../api/auth'

const languageStore = useLanguageStore()
const userStore = useUserStore()

interface UserInfo {
  id: string
  username: string
  email?: string
}

const props = defineProps<{
  userInfo: UserInfo | null
  mode: 'password' | 'email'
}>()

const emit = defineEmits<{
  close: []
  confirmed: [user: UserInfo]
}>()

const updating = ref(false)
const newEmail = ref('')
const currentPassword = ref('')
const emailVerificationCode = ref('')
const emailVerificationSent = ref(false)
const sendingVerification = ref(false)

const sendVerificationCode = async () => {
  if (!newEmail.value.trim()) {
    alert(languageStore.isZh ? '请输入邮箱地址' : 'Please enter email address')
    return
  }

  if (newEmail.value === props.userInfo?.email) {
    alert(languageStore.isZh ? '新邮箱不能与当前邮箱相同' : 'New email cannot be the same as current email')
    return
  }

  sendingVerification.value = true
  try {
    const response = await sendEmailVerification(newEmail.value.trim())
    if (response.message) {
      emailVerificationSent.value = true
      alert(languageStore.isZh ? '验证码已发送到当前邮箱，请检查并输入验证码' : 'Verification code sent to current email, please check and enter the code')
    }
  } catch (error: any) {
    console.error('发送验证码失败:', error)
    const errorMessage = error.response?.data?.message || (languageStore.isZh ? '发送验证码失败' : 'Failed to send verification code')
    alert(errorMessage)
  } finally {
    sendingVerification.value = false
  }
}

const confirmChange = async () => {
  if (!newEmail.value.trim()) {
    alert(languageStore.isZh ? '请输入新邮箱地址' : 'Please enter new email address')
    return
  }

  if (newEmail.value === props.userInfo?.email) {
    alert(languageStore.isZh ? '新邮箱不能与当前邮箱相同' : 'New email cannot be the same as current email')
    return
  }

  // 验证输入
  if (props.mode === 'password' && !currentPassword.value.trim()) {
    alert(languageStore.isZh ? '请输入当前密码' : 'Please enter current password')
    return
  }

  if (props.mode === 'email' && !emailVerificationCode.value?.trim()) {
    alert(languageStore.isZh ? '请输入邮箱验证码' : 'Please enter email verification code')
    return
  }

  updating.value = true
  try {
    const updateData: any = {
      email: newEmail.value.trim()
    }

    if (props.mode === 'password') {
      updateData.currentPassword = currentPassword.value.trim()
    } else if (props.mode === 'email') {
      updateData.emailVerificationCode = emailVerificationCode.value.trim()
    }

    const response = await updateProfile(updateData)

    if (response.success) {
      // 更新用户store
      userStore.setUserInfo(response.user)
      if (response.token) {
        userStore.setToken(response.token)
      }

      emit('confirmed', response.user)
      alert(languageStore.isZh ? '邮箱修改成功' : 'Email changed successfully')
    } else {
      alert(response.message || (languageStore.isZh ? '修改失败' : 'Change failed'))
    }
  } catch (error: any) {
    console.error('邮箱修改失败:', error)
    const errorMessage = error.response?.data?.message || (languageStore.isZh ? '修改失败，请稍后重试' : 'Change failed, please try again later')
    alert(errorMessage)
  } finally {
    updating.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

/* 移动端响应式 */
@media (max-width: 768px) {
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