<template>
  <div class="profile-modal-overlay" @click.self="$emit('close')">
    <div class="profile-modal">
      <div class="modal-header">
        <h3 class="modal-title">{{ languageStore.isZh ? '编辑个人信息' : 'Edit Profile' }}</h3>
        <button class="modal-close-btn" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="profile-form">
          <!-- 用户名 -->
          <div class="form-group">
            <label>{{ languageStore.isZh ? '用户名' : 'Username' }}</label>
            <input
              v-model="form.username"
              type="text"
              :placeholder="languageStore.isZh ? '请输入用户名' : 'Enter username'"
              required
            />
          </div>

          <!-- 当前邮箱显示 -->
          <div class="form-group">
            <label>{{ languageStore.isZh ? '当前邮箱' : 'Current Email' }}</label>
            <div class="current-email-display">
              <span class="current-email">{{ userInfo?.email }}</span>
              <div class="email-change-buttons">
                <button
                  type="button"
                  class="email-change-btn password-btn"
                  @click="handleEmailChange('password')"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  {{ languageStore.isZh ? '密码验证' : 'Password' }}
                </button>
                <button
                  type="button"
                  class="email-change-btn code-btn"
                  @click="handleEmailChange('email')"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {{ languageStore.isZh ? '发送验证码' : 'Send Code' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 个性签名 -->
          <div class="form-group">
            <label>{{ languageStore.isZh ? '个性签名' : 'Signature' }}</label>
            <input
              v-model="form.signature"
              type="text"
              :placeholder="languageStore.isZh ? '请输入个性签名' : 'Enter your signature'"
              maxlength="50"
            />
            <small class="form-hint">{{ form.signature?.length || 0 }}/50</small>
          </div>

          <!-- 个人简介 -->
          <div class="form-group">
            <label>{{ languageStore.isZh ? '个人简介' : 'Bio' }}</label>
            <textarea
              v-model="form.bio"
              :placeholder="languageStore.isZh ? '介绍一下自己...' : 'Tell us about yourself...'"
              rows="3"
            ></textarea>
          </div>

          <!-- 头像 -->
          <div class="form-group">
            <label>{{ languageStore.isZh ? '头像' : 'Avatar' }}</label>
            <div class="avatar-upload-section">
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="handleAvatarSelect"
                style="display: none"
              />
              <div class="current-avatar" @click="triggerAvatarUpload">
                <img v-if="getAvatarUrl(form.avatar)" :src="getAvatarUrl(form.avatar)" :alt="languageStore.isZh ? '当前头像' : 'Current Avatar'" />
                <div v-else class="avatar-placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="40" fill="#F3F4F6"/>
                    <circle cx="40" cy="30" r="15" fill="#C4C4D6"/>
                    <path d="M20 55h40v15H5v-15z" fill="#C4C4D6"/>
                  </svg>
                </div>
                <div class="avatar-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 12.414 11H13a2 2 0 0 1 2 2v1.172a2 2 0 0 1-.586 1.414l-1.707 1.707a1 1 0 0 1-1.414 0L9.586 14A2 2 0 0 1 9 12.586V12a2 2 0 0 1 2-2z"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <span>{{ languageStore.isZh ? '更换头像' : 'Change Avatar' }}</span>
                </div>
              </div>
              <button type="button" class="remove-avatar-btn" v-if="form.avatar" @click="removeAvatar">
                {{ languageStore.isZh ? '移除头像' : 'Remove Avatar' }}
              </button>
            </div>
          </div>

          <!-- 表单操作 -->
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="updating">
              {{ updating ? (languageStore.isZh ? '保存中...' : 'Saving...') : (languageStore.isZh ? '保存' : 'Save') }}
            </button>
            <button type="button" class="cancel-btn" @click="$emit('close')">
              {{ languageStore.isZh ? '取消' : 'Cancel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/useLanguageStore'
import { useUserStore } from '../stores/useUserStore'
import { updateProfile } from '../api/auth'
import { uploadFile } from '../api/upload'

const languageStore = useLanguageStore()
const userStore = useUserStore()

interface UserInfo {
  id: string
  username: string
  email?: string
  signature?: string
  bio?: string
  avatar?: string
}

const props = defineProps<{
  userInfo: UserInfo | null
}>()

const emit = defineEmits<{
  close: []
  saved: [user: UserInfo]
  emailChange: [mode: 'password' | 'email']
}>()

const updating = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const form = ref({
  username: props.userInfo?.username || '',
  signature: props.userInfo?.signature || '',
  bio: props.userInfo?.bio || '',
  avatar: props.userInfo?.avatar || ''
})

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

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarSelect = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && file.type.startsWith('image/')) {
    try {
      // 上传文件到服务器
      const uploadResult = await uploadFile(file)
      if (uploadResult.success) {
        form.value.avatar = uploadResult.data.url
      }
    } catch (error) {
      console.error('头像上传失败:', error)
      alert(languageStore.isZh ? '头像上传失败，请重试' : 'Avatar upload failed, please try again')
    }
  }
}

const removeAvatar = () => {
  form.value.avatar = ''
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

const handleEmailChange = (mode: 'password' | 'email') => {
  emit('emailChange', mode)
}

const handleSubmit = async () => {
  if (!props.userInfo) return

  updating.value = true
  try {
    const updateData = {
      username: form.value.username,
      signature: form.value.signature,
      bio: form.value.bio,
      avatar: form.value.avatar
    }

    const response = await updateProfile(updateData)

    // 更新本地存储和状态
    userStore.setUserInfo(response.user)
    if (response.token) {
      userStore.setToken(response.token)
    }

    emit('saved', response.user)

    // 显示成功提示
    alert(languageStore.isZh ? '个人信息更新成功！' : 'Profile updated successfully!')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    alert(languageStore.isZh ? '更新失败，请重试' : 'Update failed, please try again')
  } finally {
    updating.value = false
  }
}
</script>

<style scoped>
.profile-modal-overlay {
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

.profile-modal {
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
  color: #374151;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

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

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.current-avatar:hover {
  border-color: #3b82f6;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 0.75rem;
  text-align: center;
  padding: 0.5rem;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.remove-avatar-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.remove-avatar-btn:hover {
  background: #dc2626;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .profile-modal {
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-header,
  .modal-body {
    padding: 1rem;
  }

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

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>