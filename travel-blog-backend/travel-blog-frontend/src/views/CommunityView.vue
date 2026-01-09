<template>
  <div class="community-page">
    <!-- 个人资料（登录后显示） -->
    <section v-if="isLoggedIn" class="profile-header">
      <div class="profile-container">
        <div class="profile-avatar">
          <img v-if="getAvatarUrl(userInfo?.avatar)" :src="getAvatarUrl(userInfo?.avatar)" :alt="userInfo?.username || 'User'" />
          <div v-else class="avatar-placeholder">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="75" cy="75" r="75" fill="#F3F4F6"/>
              <circle cx="75" cy="60" r="22" fill="#C4C4D6"/>
              <path d="M20 130h110v20H0v-20z" fill="#C4C4D6"/>
            </svg>
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ userInfo?.username || (languageStore.isZh ? '游客' : 'Guest') }}</h1>
          <p v-if="userInfo?.bio" class="profile-bio">{{ userInfo.bio }}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ postsCount }}</span>
              <span class="stat-label">{{ languageStore.isZh ? '动态' : 'Posts' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalLikes }}</span>
              <span class="stat-label">{{ languageStore.isZh ? '获赞' : 'Likes' }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalComments }}</span>
              <span class="stat-label">{{ languageStore.isZh ? '评论' : 'Comments' }}</span>
            </div>
          </div>
          <button class="edit-profile-btn" @click="showProfileModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            {{ languageStore.isZh ? '编辑资料' : 'Edit Profile' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 发布动态（未登录也显示但不可操作） -->
    <section class="post-creator">
      <div class="post-creator-container">
        <div class="post-creator-header">
          <div class="creator-avatar">
            <img
              v-if="getAvatarUrl(userInfo?.avatar)"
              :src="getAvatarUrl(userInfo?.avatar)"
              :alt="userInfo.username || 'User'"
              @error="handleAvatarError"
            />
            <div v-else class="avatar-placeholder">
              {{ userInfo?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>
          <textarea
            v-model="newPostContent"
            class="post-input"
            rows="3"
            :placeholder="isLoggedIn ? (languageStore.isZh ? '分享你的旅行故事...' : 'Share your travel story...') : (languageStore.isZh ? '请先登录以发布动态...' : 'Please login to post...')"
            :disabled="!isLoggedIn"
          ></textarea>
        </div>

        <div class="post-creator-actions">
          <div class="post-options">
            <button class="option-btn" type="button" @click="toggleEmojiPicker">
              <span>😊</span>
              <span>{{ languageStore.isZh ? '表情' : 'Emoji' }}</span>
            </button>
            <button class="option-btn" type="button" @click="handleImageUpload">
              <span>🖼️</span>
              <span>{{ languageStore.isZh ? '图片' : 'Image' }}</span>
            </button>
            <button class="option-btn" type="button" :disabled="!isLoggedIn" @click="handleLocation">
              <span>📍</span>
              <span>{{ locationName || (languageStore.isZh ? '位置' : 'Location') }}</span>
            </button>
          </div>
          <button
            class="publish-btn"
            :disabled="!isLoggedIn || !newPostContent.trim() || publishing"
            @click="handlePublishPost"
          >
            {{ !isLoggedIn ? (languageStore.isZh ? '请登录' : 'Login') : (publishing ? (languageStore.isZh ? '发布中...' : 'Publishing...') : (languageStore.isZh ? '发布' : 'Publish')) }}
          </button>
        </div>

        <!-- 表情选择器 -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <div class="emoji-picker-header">
            <span>{{ languageStore.isZh ? '选择表情' : 'Select Emoji' }}</span>
            <button class="emoji-picker-close" @click="showEmojiPicker = false">×</button>
          </div>
          <div class="emoji-grid">
            <button
              v-for="emoji in commonEmojis"
              :key="emoji"
              class="emoji-item"
              type="button"
              @click="insertEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- 位置显示 -->
        <div v-if="locationName" class="location-display">
          <span>📍</span>
          <span>{{ locationName }}</span>
          <button class="remove-location-btn" @click="clearLocation">×</button>
        </div>

        <!-- 图片预览 -->
        <div v-if="newPostImages.length" class="post-images-preview">
          <div v-for="(img, index) in newPostImages" :key="index" class="image-preview-item">
            <img :src="img" alt="preview" />
            <button class="remove-image-btn" @click="removeImage(index)">×</button>
          </div>
        </div>
        <input ref="imageInput" type="file" accept="image/*" multiple style="display: none" @change="handleImageSelect" />
      </div>
    </section>

    <!-- 导航：最新 / 热门 -->
    <section class="posts-nav">
      <div class="posts-nav-container">
        <button :class="['nav-tab', { active: activeTab === 'latest' }]" @click="activeTab = 'latest'">
          {{ languageStore.isZh ? '最新动态' : 'Latest' }}
        </button>
        <button :class="['nav-tab', { active: activeTab === 'hot' }]" @click="activeTab = 'hot'">
          {{ languageStore.isZh ? '热门动态' : 'Hot' }}
        </button>
      </div>
    </section>

    <!-- 动态列表 -->
    <section class="posts-content">
      <div class="posts-container">
        <div v-if="loading" class="loading-state">{{ languageStore.isZh ? '加载中...' : 'Loading...' }}</div>
        <div v-else-if="displayedPosts.length === 0" class="empty-state">
          {{ languageStore.isZh ? '还没有动态，快来发布第一条吧！' : 'No posts yet. Be the first to share!' }}
        </div>
        <template v-else>
          <article v-for="post in displayedPosts" :key="post._id || post.id" class="post-item">
            <header class="post-header">
              <div class="post-author">
                <div v-if="getAvatarUrl(post.author?.avatar)" class="author-avatar">
                  <img :src="getAvatarUrl(post.author?.avatar)" :alt="post.author?.username || 'User'" />
                </div>
                <div v-else class="author-avatar avatar-placeholder">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#F3F4F6"/>
                    <circle cx="20" cy="15" r="11" fill="#C4C4D6"/>
                    <path d="M5 32h30v10H0v-10z" fill="#C4C4D6"/>
                  </svg>
                </div>
                <div class="author-info">
                  <div class="author-name">{{ post.author?.username || 'User' }}</div>
                  <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                </div>
              </div>
              <!-- 编辑按钮 - 只对当前用户的动态显示 -->
              <div v-if="isCurrentUserPost(post)" class="post-edit-btn">
                <button class="edit-btn" @click="openEditModal(post)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </header>

            <div class="post-content">
              <p class="post-text">{{ post.content }}</p>
              <div v-if="post.location" class="post-location">
                <span>📍</span>
                <span>{{ post.location.name || `${post.location.coordinates?.lat}, ${post.location.coordinates?.lng}` }}</span>
              </div>
              <div v-if="post.images?.length" class="post-images">
                <img
                  v-for="(img, idx) in post.images"
                  :key="idx"
                  :src="img"
                  :alt="`image-${idx}`"
                  class="post-image"
                  :class="{ 'image-expanded': expandedImages[`${post._id || post.id}-${idx}`] }"
                  @click="toggleImageExpand(post, idx)"
                />
              </div>
            </div>

            <div class="post-actions">
              <button :class="['action-btn', { active: isLiked(post) }]" :disabled="!isLoggedIn" @click="handleLike(post)">
                ❤️ <span>{{ post.likes?.length || 0 }}</span>
              </button>
              <button class="action-btn" :disabled="!isLoggedIn" @click="toggleComment(post)">
                💬 <span>{{ post.comments?.length || 0 }}</span>
              </button>
              <button :class="['action-btn', { active: isFavorited(post) }]" :disabled="!isLoggedIn" @click="handleFavorite(post)">
                ⭐ <span>{{ post.favorites?.length || 0 }}</span>
              </button>
            </div>

            <div v-if="showComments[post._id || post.id]" class="comments-section">
              <div v-if="post.comments?.length" class="comments-list">
                <div v-for="(comment, idx) in post.comments" :key="idx" class="comment-item">
                  <div v-if="getAvatarUrl(comment.user?.avatar)" class="comment-avatar">
                    <img :src="getAvatarUrl(comment.user?.avatar)" :alt="comment.user?.username || 'User'" />
                  </div>
                  <div v-else class="comment-avatar avatar-placeholder">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="15" fill="#F3F4F6"/>
                      <circle cx="15" cy="11" r="8" fill="#C4C4D6"/>
                      <path d="M4 24h22v7H0v-7z" fill="#C4C4D6"/>
                    </svg>
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.user?.username || 'User' }}</span>
                      <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <div v-if="isLoggedIn" class="comment-input-section">
                <div class="comment-input-wrapper">
                  <input
                    v-model="commentInputs[post._id || post.id]"
                    type="text"
                    class="comment-input"
                    :placeholder="languageStore.isZh ? '写评论...' : 'Write a comment...'"
                    @keyup.enter="handleComment(post)"
                  />
                  <button
                    class="comment-submit-btn"
                    :disabled="!commentInputs[post._id || post.id]?.trim()"
                    @click="handleComment(post)"
                  >
                    {{ languageStore.isZh ? '发送' : 'Send' }}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </template>
      </div>
    </section>

    <!-- 个人资料编辑模态框 -->
    <div v-if="showProfileModal" class="profile-modal-overlay" @click.self="closeProfileModal">
      <div class="profile-modal">
        <div class="modal-header">
          <h3>{{ languageStore.isZh ? '编辑个人资料' : 'Edit Profile' }}</h3>
          <button class="close-btn" @click="closeProfileModal">×</button>
        </div>

        <form class="profile-form" @submit.prevent="handleUpdateProfile">
          <!-- 头像上传 -->
          <div class="form-group">
            <label class="form-label">{{ languageStore.isZh ? '头像' : 'Avatar' }}</label>
            <div class="avatar-upload-section">
              <div class="current-avatar">
                <img v-if="getAvatarUrl(profileForm.avatar)" :src="getAvatarUrl(profileForm.avatar)" :alt="profileForm.username" />
                <div v-else class="avatar-placeholder">
                  {{ profileForm.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
              </div>
              <div class="avatar-actions">
                <button type="button" class="upload-avatar-btn" @click="triggerAvatarUpload">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  {{ languageStore.isZh ? '更换头像' : 'Change Avatar' }}
                </button>
                <button v-if="profileForm.avatar" type="button" class="remove-avatar-btn" @click="removeAvatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  {{ languageStore.isZh ? '删除头像' : 'Remove Avatar' }}
                </button>
              </div>
            </div>
            <input ref="avatarInput" type="file" accept="image/*" style="display: none" @change="handleAvatarSelect" />
          </div>

          <!-- 用户名 -->
          <div class="form-group">
            <label class="form-label">{{ languageStore.isZh ? '用户名' : 'Username' }}</label>
            <input
              v-model="profileForm.username"
              type="text"
              class="form-input"
              :placeholder="languageStore.isZh ? '请输入用户名' : 'Enter username'"
              required
            />
          </div>

          <!-- 当前邮箱显示 -->
          <div class="form-group">
            <label class="form-label">{{ languageStore.isZh ? '当前邮箱' : 'Current Email' }}</label>
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
            <label class="form-label">{{ languageStore.isZh ? '个性签名' : 'Signature' }}</label>
            <input
              v-model="profileForm.signature"
              type="text"
              class="form-input"
              :placeholder="languageStore.isZh ? '请输入个性签名' : 'Enter your signature'"
              maxlength="50"
            />
            <small class="form-hint">{{ profileForm.signature?.length || 0 }}/50</small>
          </div>

          <!-- 个人简介 -->
          <div class="form-group">
            <label class="form-label">{{ languageStore.isZh ? '个人简介' : 'Bio' }}</label>
            <textarea
              v-model="profileForm.bio"
              class="form-textarea"
              rows="3"
              :placeholder="languageStore.isZh ? '介绍一下自己...' : 'Tell us about yourself...'"
            ></textarea>
          </div>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeProfileModal">
              {{ languageStore.isZh ? '取消' : 'Cancel' }}
            </button>
            <button type="submit" class="save-btn" :disabled="updatingProfile">
              {{ updatingProfile ? (languageStore.isZh ? '保存中...' : 'Saving...') : (languageStore.isZh ? '保存' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 编辑动态模态框 -->
    <div v-if="showEditModal" class="edit-modal-overlay" @click.self="closeEditModal">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h3>编辑动态</h3>
          <button class="close-btn" @click="closeEditModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="edit-modal-body">
          <textarea
            v-model="editContent"
            class="edit-textarea"
            placeholder="编辑你的动态内容..."
            rows="4"
          ></textarea>
          <div class="edit-images-preview" v-if="editImages.length">
            <div v-for="(img, index) in editImages" :key="index" class="edit-image-item">
              <img :src="img" alt="preview" />
              <button class="remove-image-btn" @click="removeEditImage(index)">×</button>
            </div>
          </div>
        </div>
        <div class="edit-modal-footer">
          <button class="delete-btn" @click="confirmDeletePost" :disabled="deleting">
            {{ deleting ? '删除中...' : '删除动态' }}
          </button>
          <div class="footer-actions">
            <button class="cancel-btn" @click="closeEditModal">取消</button>
            <button class="save-btn" @click="saveEditPost" :disabled="!editContent.trim() || saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 邮箱修改弹窗 -->
    <EmailChangeModal
      v-if="showEmailModal"
      :user-info="userInfo"
      :mode="emailModalMode"
      @close="showEmailModal = false"
      @confirmed="handleEmailChangeConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLanguageStore } from '../stores/useLanguageStore'
import { useUserStore } from '../stores/useUserStore'
import * as postsApi from '../api/posts'
import { uploadFile } from '../api/upload'
import EmailChangeModal from '../components/EmailChangeModal.vue'

const languageStore = useLanguageStore()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)
const isLoggedIn = computed(() => !!userStore.token)

const posts = ref<any[]>([])
const loading = ref(false)

const newPostContent = ref('')
const newPostImages = ref<string[]>([])
const publishing = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)

const showEmojiPicker = ref(false)
const locationName = ref('')
const locationCoords = ref<{ lat: number; lng: number } | null>(null)

const showComments = ref<Record<string, boolean>>({})
const commentInputs = ref<Record<string, string>>({})

// 原位图片放大功能
const expandedImages = ref<Record<string, boolean>>({})
const activeTab = ref<'latest' | 'hot'>('latest')

// 编辑动态相关
const showEditModal = ref(false)
const editingPost = ref<any>(null)
const editContent = ref('')
const editImages = ref<string[]>([])
const saving = ref(false)
const deleting = ref(false)

// 个人资料编辑相关
const showProfileModal = ref(false)
const updatingProfile = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const profileForm = ref({
  username: '',
  email: '',
  signature: '',
  bio: '',
  avatar: '',
  emailVerificationCode: ''
})

// 邮箱修改相关
const showEmailModal = ref(false)
const emailModalMode = ref<'password' | 'email'>('password')

// 使用内联SVG代替data URL，避免HTTP请求错误

const postsCount = computed(() => posts.value.length)
const totalLikes = computed(() => posts.value.reduce((sum, p) => sum + (p.likes?.length || 0), 0))
const totalComments = computed(() => posts.value.reduce((sum, p) => sum + (p.comments?.length || 0), 0))

const displayedPosts = computed(() => {
  if (activeTab.value === 'hot') {
    return [...posts.value].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  }
  return posts.value
})

const commonEmojis = ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾']

const loadPosts = async () => {
  loading.value = true
  try {
    const res = await postsApi.getPosts()
    if (res.success) {
      posts.value = res.data || []
    }
  } catch (err) {
    console.error('加载动态失败:', err)
  } finally {
    loading.value = false
  }
}

const handlePublishPost = async () => {
  if (!isLoggedIn.value || !newPostContent.value.trim()) return
  publishing.value = true
  try {
    const postData: any = {
      content: newPostContent.value.trim(),
      images: newPostImages.value
    }
    if (locationCoords.value) {
      postData.location = {
        name: locationName.value,
        coordinates: locationCoords.value
      }
    }
    const res = await postsApi.createPost(postData)
    if (res.success) {
      // 清空输入
      newPostContent.value = ''
      newPostImages.value = []
      locationName.value = ''
      locationCoords.value = null
      showEmojiPicker.value = false
      // 重新加载动态列表
      await loadPosts()
      // 显示成功提示（可选，使用更友好的方式）
      console.log(languageStore.isZh ? '动态发布成功！' : 'Post published successfully!')
    } else {
      alert(res.message || (languageStore.isZh ? '发布失败，请重试' : 'Failed to publish'))
    }
  } catch (err: any) {
    console.error('发布动态错误:', err)
    const errorMessage = err.response?.data?.message || err.message || (languageStore.isZh ? '发布失败，请检查网络连接或稍后重试' : 'Failed to publish, please check your connection or try again later')
    alert(errorMessage)
  } finally {
    publishing.value = false
  }
}

const handleImageUpload = () => {
  imageInput.value?.click()
}

// 压缩图片
const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }

    img.src = URL.createObjectURL(file)
  })
}

const handleImageSelect = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return

  // 限制最多上传9张图片
  const maxFiles = 9
  const filesToProcess = Array.from(files).slice(0, maxFiles)

  for (const file of filesToProcess) {
    if (file.type.startsWith('image/')) {
      try {
        // 检查文件大小，如果大于2MB则压缩
        if (file.size > 2 * 1024 * 1024) { // 2MB
          const compressedImage = await compressImage(file)
          newPostImages.value.push(compressedImage)
        } else {
          // 上传文件到服务器
          const uploadResult = await uploadFile(file)
          if (uploadResult.success) {
            newPostImages.value.push(uploadResult.data.url)
          }
        }
      } catch (error) {
        console.error('图片处理失败:', error)
        // 如果上传失败，尝试直接上传文件
        const uploadResult = await uploadFile(file)
        if (uploadResult.success) {
          newPostImages.value.push(uploadResult.data.url)
        } else {
          console.error('图片上传失败:', uploadResult.message)
        }
      }
    }
  }

  // 清空input值，允许重复选择同一文件
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const removeImage = (idx: number) => {
  newPostImages.value.splice(idx, 1)
}

const toggleEmojiPicker = () => {
  if (!isLoggedIn.value) return
  showEmojiPicker.value = !showEmojiPicker.value
}

const insertEmoji = (emoji: string) => {
  newPostContent.value += emoji
  showEmojiPicker.value = false
}

const handleLocation = () => {
  if (!isLoggedIn.value) return
  if (!navigator.geolocation) {
    alert(languageStore.isZh ? '浏览器不支持定位' : 'Geolocation not supported')
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      locationCoords.value = { lat: latitude, lng: longitude }
      locationName.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    },
    (error) => {
      console.error('定位失败:', error)
      alert(languageStore.isZh ? '获取位置失败，请检查权限' : 'Failed to get location, check permissions')
    }
  )
}

const clearLocation = () => {
  locationName.value = ''
  locationCoords.value = null
}

const isLiked = (post: any) => {
  if (!userInfo.value) return false
  const uid = userInfo.value.id
  return post.likes?.some((l: any) => (typeof l === 'string' ? l : l._id || l.id) === uid)
}

const handleLike = async (post: any) => {
  if (!isLoggedIn.value) return
  const id = post._id || post.id
  const res = await postsApi.likePost(id)
  if (res.success) {
    const idx = posts.value.findIndex((p) => (p._id || p.id) === id)
    if (idx !== -1) posts.value[idx] = res.data
  }
}

const isFavorited = (post: any) => {
  if (!userInfo.value) return false
  const uid = userInfo.value.id
  return post.favorites?.some((f: any) => (typeof f === 'string' ? f : f._id || f.id) === uid)
}

const handleFavorite = async (post: any) => {
  if (!isLoggedIn.value) return
  const id = post._id || post.id
  const res = await postsApi.favoritePost(id)
  if (res.success) {
    const idx = posts.value.findIndex((p) => (p._id || p.id) === id)
    if (idx !== -1) posts.value[idx] = res.data
  }
}

const toggleComment = (post: any) => {
  const id = post._id || post.id
  showComments.value[id] = !showComments.value[id]
  if (!commentInputs.value[id]) commentInputs.value[id] = ''
}

const handleComment = async (post: any) => {
  if (!isLoggedIn.value) return
  const id = post._id || post.id
  const content = commentInputs.value[id]?.trim()
  if (!content) return
  const res = await postsApi.commentPost(id, content)
  if (res.success) {
    commentInputs.value[id] = ''
    const idx = posts.value.findIndex((p) => (p._id || p.id) === id)
    if (idx !== -1) posts.value[idx] = res.data
  }
}

const toggleImageExpand = (post: any, imageIndex: number) => {
  const key = `${post._id || post.id}-${imageIndex}`
  expandedImages.value[key] = !expandedImages.value[key]
}

// 判断是否是当前用户的动态
const isCurrentUserPost = (post: any) => {
  if (!userInfo.value) return false
  return post.author?._id === userInfo.value.id || post.author?.id === userInfo.value.id
}

// 打开编辑模态框
const openEditModal = (post: any) => {
  editingPost.value = post
  editContent.value = post.content
  editImages.value = post.images || []
  showEditModal.value = true
}

// 关闭编辑模态框
const closeEditModal = () => {
  showEditModal.value = false
  editingPost.value = null
  editContent.value = ''
  editImages.value = []
  saving.value = false
  deleting.value = false
}

// 个人资料编辑相关方法
const openProfileModal = () => {
  let avatarUrl = userInfo.value?.avatar || ''
  // 确保头像URL是完整的
  if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
    avatarUrl = `http://localhost:3000${avatarUrl}`
  }

  profileForm.value = {
    username: userInfo.value?.username || '',
    email: userInfo.value?.email || '',
    signature: userInfo.value?.signature || '',
    bio: userInfo.value?.bio || '',
    avatar: avatarUrl,
    emailVerificationCode: ''
  }
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
  profileForm.value = {
    username: '',
    email: '',
    signature: '',
    bio: '',
    avatar: '',
    emailVerificationCode: ''
  }
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert(languageStore.isZh ? '请选择图片文件' : 'Please select an image file')
    return
  }

  // 验证文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert(languageStore.isZh ? '图片大小不能超过5MB' : 'Image size cannot exceed 5MB')
    return
  }

  try {
    // 上传头像
    const response = await uploadFile(file)
    if (response.success) {
      // 确保URL是完整的
      let avatarUrl = response.data.url
      if (avatarUrl.startsWith('/uploads/')) {
        avatarUrl = `http://localhost:3000${avatarUrl}`
      }
      profileForm.value.avatar = avatarUrl
    } else {
      alert(languageStore.isZh ? '头像上传失败' : 'Avatar upload failed')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    alert(languageStore.isZh ? '头像上传失败，请重试' : 'Avatar upload failed, please try again')
  }
}

const removeAvatar = () => {
  profileForm.value.avatar = ''
}

// 处理邮箱修改请求
const handleEmailChange = (mode: 'password' | 'email') => {
  emailModalMode.value = mode
  showEmailModal.value = true
}


// 处理邮箱修改确认
const handleEmailChangeConfirmed = (user: any) => {
  showEmailModal.value = false
  // 用户store已在组件内部更新
}



const handleUpdateProfile = async () => {
  if (!profileForm.value.username.trim()) {
    alert(languageStore.isZh ? '用户名不能为空' : 'Username is required')
    return
  }

  updatingProfile.value = true
  try {
    const updateData: any = {
      username: profileForm.value.username.trim(),
      signature: profileForm.value.signature?.trim() || undefined,
      bio: profileForm.value.bio?.trim() || undefined,
      avatar: profileForm.value.avatar || undefined
    }

    const response = await updateProfile(updateData)

    if (response.success) {
      // 更新用户store
      userStore.setUserInfo(response.user)
      if (response.token) {
        userStore.setToken(response.token)
      }

      // 刷新用户头像显示（确保URL是完整的）
      if (response.user.avatar && response.user.avatar.startsWith('/uploads/')) {
        response.user.avatar = `http://localhost:3000${response.user.avatar}`
        userStore.setUserInfo(response.user)
      }

      closeProfileModal()
      alert(languageStore.isZh ? '个人资料更新成功' : 'Profile updated successfully')
    } else {
      alert(response.message || (languageStore.isZh ? '更新失败' : 'Update failed'))
    }
  } catch (error: any) {
    console.error('更新个人资料失败:', error)
    const errorMessage = error.response?.data?.message || (languageStore.isZh ? '更新失败，请重试' : 'Update failed, please try again')
    alert(errorMessage)
  } finally {
    updatingProfile.value = false
  }
}

// 保存编辑后的动态
const saveEditPost = async () => {
  if (!editingPost.value || !editContent.value.trim()) return

  saving.value = true
  try {
    const postId = editingPost.value._id || editingPost.value.id
    const res = await postsApi.updatePost(postId, {
      content: editContent.value.trim(),
      images: editImages.value
    })

    if (res.success) {
      // 更新本地数据
      const index = posts.value.findIndex(p => (p._id || p.id) === postId)
      if (index !== -1) {
        posts.value[index] = res.data
      }
      closeEditModal()
      alert(languageStore.isZh ? '动态更新成功！' : 'Post updated successfully!')
    } else {
      alert(res.message || (languageStore.isZh ? '更新失败' : 'Update failed'))
    }
  } catch (error) {
    console.error('更新动态失败:', error)
    alert(languageStore.isZh ? '更新失败，请重试' : 'Update failed, please try again')
  } finally {
    saving.value = false
  }
}

// 确认删除动态
const confirmDeletePost = async () => {
  if (!editingPost.value) return

  if (!confirm(languageStore.isZh ? '确定要删除这条动态吗？此操作不可恢复。' : 'Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }

  deleting.value = true
  try {
    const postId = editingPost.value._id || editingPost.value.id
    const res = await postsApi.deletePost(postId)

    if (res.success) {
      // 从本地数据中移除
      const index = posts.value.findIndex(p => (p._id || p.id) === postId)
      if (index !== -1) {
        posts.value.splice(index, 1)
      }
      closeEditModal()
      alert(languageStore.isZh ? '动态删除成功！' : 'Post deleted successfully!')
    } else {
      alert(res.message || (languageStore.isZh ? '删除失败' : 'Delete failed'))
    }
  } catch (error) {
    console.error('删除动态失败:', error)
    alert(languageStore.isZh ? '删除失败，请重试' : 'Delete failed, please try again')
  } finally {
    deleting.value = false
  }
}

// 移除编辑图片
const removeEditImage = (index: number) => {
  editImages.value.splice(index, 1)
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
  img.style.display = 'none'
  // 创建替代的文本头像
  const parent = img.parentElement
  if (parent) {
    const placeholder = document.createElement('div')
    placeholder.className = 'avatar-placeholder'
    placeholder.textContent = userInfo.value?.username?.charAt(0).toUpperCase() || 'U'
    parent.appendChild(placeholder)
  }
}

const formatTime = (time: string | Date) => {
  const date = new Date(time)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return languageStore.isZh ? '刚刚' : 'Just now'
  if (mins < 60) return `${mins}${languageStore.isZh ? '分钟前' : ' min ago'}`
  if (hours < 24) return `${hours}${languageStore.isZh ? '小时前' : ' hours ago'}`
  if (days < 7) return `${days}${languageStore.isZh ? '天前' : ' days ago'}`
  return date.toLocaleDateString()
}

onMounted(async () => {
  await loadPosts()
  // 刷新用户信息以确保头像等信息是最新的
  await userStore.refreshUserInfo()
})
</script>

<style scoped>
.community-page {
  width: 100%;
  min-height: 100vh;
  background-color: transparent;
  color: var(--text-color, #000000);
  padding-bottom: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}

.dark-theme .community-page {
  background-color: var(--bg-color, #000000);
  color: var(--text-color, #ffffff);
}

.profile-header {
  background-color: var(--bg-color, #ffffff);
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dark-theme .profile-header {
  background-color: var(--bg-color, #000000);
  border-bottom-color: var(--border-color, #333333);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  text-align: center;
  width: 100%;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.profile-bio {
  color: #444;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.post-creator {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.post-creator-container {
  background-color: var(--bg-color, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

/* 白天模式下的发布容器 */
.light-theme .post-creator-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-theme .post-creator-container {
  background-color: var(--bg-color, #1a1a1a);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--border-color, #333333);
}

.post-creator-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.creator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.creator-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1rem;
  overflow: hidden;
}

.avatar-placeholder svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.post-input {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-color, #000000);
  font-family: inherit;
  background-color: transparent;
}

.post-input:disabled {
  background-color: var(--bg-secondary, #f5f5f5);
  cursor: not-allowed;
  opacity: 0.7;
}

.dark-theme .post-input {
  color: var(--text-color, #ffffff);
}

.dark-theme .post-input:disabled {
  background-color: var(--bg-secondary, #2a2a2a);
}

.post-creator-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.post-options {
  display: flex;
  gap: 1rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: none;
  border: 1px solid var(--border-color, #eee);
  border-radius: 8px;
  color: var(--text-color, #444);
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background-color: var(--bg-secondary, #f5f5f5);
}

.dark-theme .option-btn {
  border-color: var(--border-color, #333333);
  color: var(--text-color, #ffffff);
}

.dark-theme .option-btn:hover {
  background-color: var(--bg-secondary, #2a2a2a);
}

.publish-btn {
  padding: 0.75rem 2rem;
  background-color: #ff6b9d;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.publish-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-color, #fff);
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.5rem;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dark-theme .emoji-picker {
  background-color: var(--bg-color, #1a1a1a);
  border-color: var(--border-color, #333333);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.emoji-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  font-weight: 600;
  position: sticky;
  top: 0;
  background-color: var(--bg-color, #fff);
  color: var(--text-color, #000000);
  transition: all 0.3s ease;
}

.dark-theme .emoji-picker-header {
  background-color: var(--bg-color, #1a1a1a);
  border-bottom-color: var(--border-color, #333333);
  color: var(--text-color, #ffffff);
}

.emoji-picker-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  padding: 1rem;
}

.emoji-item {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: var(--bg-secondary, #f5f5f5);
}

.dark-theme .emoji-item:hover {
  background-color: var(--bg-secondary, #2a2a2a);
}

.location-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f0f7ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  margin-top: 1rem;
  color: #0066cc;
  font-size: 0.95rem;
}

.remove-location-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 1.1rem;
}

.post-images-preview {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.image-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  cursor: pointer;
}

.posts-nav {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: 1rem;
}

.posts-nav-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  background-color: var(--bg-color, #ffffff);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color, transparent);
}

.dark-theme .posts-nav-container {
  background-color: var(--bg-color, #1a1a1a);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--border-color, #333333);
}

.nav-tab {
  flex: 1;
  padding: 0.7rem 1rem;
  background: none;
  border: none;
  color: var(--text-secondary, #555);
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-tab.active {
  background-color: #ff6b9d;
  color: #fff;
}

.dark-theme .nav-tab {
  color: var(--text-secondary, #cccccc);
}

.posts-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.post-item {
  background-color: var(--bg-color, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

/* 白天模式下的动态项 */
.light-theme .post-item {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-theme .post-item {
  background-color: var(--bg-color, #1a1a1a);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--border-color, #333333);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-weight: 700;
  color: var(--text-color, #000000);
}

.post-time {
  font-size: 0.9rem;
  color: #777;
}

/* 白天模式下的时间显示 */
.light-theme .post-time {
  color: #6b7280;
}

/* 夜间模式下的时间显示 */
.dark-theme .post-time {
  color: #9ca3af;
}

.post-content {
  margin-top: 1rem;
}

.post-text {
  color: var(--text-color, #000000);
  line-height: 1.6;
}

.post-location {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.6rem;
  padding: 0.4rem 0.6rem;
  background: #f0f7ff;
  border-radius: 6px;
  color: #0066cc;
  font-size: 0.9rem;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
  max-width: 100%;
}

.post-image {
  width: 100%;
  max-width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.post-image:hover {
  transform: scale(1.05);
}

/* 图片原位放大样式 */
.image-expanded {
  width: auto !important;
  max-width: 300px !important;
  height: auto !important;
  max-height: 300px !important;
  z-index: 10 !important;
  cursor: zoom-out !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px !important;
  object-fit: contain !important;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary, #666);
  font-weight: 600;
  transition: color 0.2s;
}

.action-btn.active {
  color: #ff6b9d;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark-theme .action-btn {
  color: var(--text-secondary, #cccccc);
}

.comments-section {
  margin-top: 1rem;
  border-top: 1px solid var(--border-color, #f0f0f0);
  padding-top: 1rem;
  transition: border-color 0.3s ease;
}

.dark-theme .comments-section {
  border-top-color: var(--border-color, #333333);
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-author {
  font-weight: 700;
}

.comment-time {
  font-size: 0.85rem;
  color: #777;
}

.comment-text {
  color: var(--text-color, #000000);
}

.comment-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.comment-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 20px;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  transition: all 0.3s ease;
}

.dark-theme .comment-input {
  background-color: var(--bg-color, #1a1a1a);
  color: var(--text-color, #ffffff);
  border-color: var(--border-color, #333333);
}

  .comment-submit-btn {
    padding: 0.7rem 1.5rem;
    background: #ff6b9d;
    color: #fff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }

/* 编辑按钮样式 */
.post-edit-btn {
  /* Edit button is positioned to the right by justify-content: space-between on .post-header */
}

.edit-btn {
  background: none;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary, #666);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background-color: var(--bg-secondary, #f5f5f5);
  border-color: var(--border-color, #ccc);
}

.dark-theme .edit-btn {
  border-color: var(--border-color, #333333);
  color: var(--text-secondary, #cccccc);
}

.dark-theme .edit-btn:hover {
  background-color: var(--bg-secondary, #2a2a2a);
}

/* 编辑模态框样式 */
.edit-modal-overlay {
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
  padding: 1rem;
}

.edit-modal {
  background: var(--bg-color, #ffffff);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.edit-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
}

.edit-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color, #000000);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary, #666);
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: var(--bg-secondary, #f5f5f5);
}

.edit-modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.edit-textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s ease;
  margin-bottom: 1rem;
}

.edit-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.edit-images-preview {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.edit-image-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color, #e5e5e5);
}

.edit-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-image-item .remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e5e5e5);
  gap: 1rem;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #dc2626;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-secondary, #666);
}

.cancel-btn:hover {
  background: var(--bg-secondary, #e5e5e5);
}

.save-btn {
  background: #ff6b9d;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #ff5a8d;
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 夜间模式样式 */
.dark-theme .edit-modal {
  background: var(--bg-color, #1a1a1a);
  border-color: var(--border-color, #333333);
}

.dark-theme .edit-modal-header {
  border-bottom-color: var(--border-color, #333333);
}

.dark-theme .edit-modal-footer {
  border-top-color: var(--border-color, #333333);
}

.dark-theme .edit-textarea {
  background: var(--bg-color, #1a1a1a);
  border-color: var(--border-color, #333333);
  color: var(--text-color, #ffffff);
}

.dark-theme .edit-textarea:focus {
  border-color: #667eea;
}

.dark-theme .edit-image-item {
  border-color: var(--border-color, #333333);
}

.dark-theme .close-btn:hover {
  background-color: var(--bg-secondary, #2a2a2a);
}

.dark-theme .cancel-btn {
  background: var(--bg-secondary, #2a2a2a);
  color: var(--text-secondary, #cccccc);
}

.dark-theme .cancel-btn:hover {
  background: var(--bg-secondary, #333333);
}


/* 个人资料编辑模态框 */
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
  padding: 1rem;
}

.profile-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.profile-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.change-email-btn {
  padding: 0.375rem 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.change-email-btn:hover {
  background: #2563eb;
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

.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.upload-avatar-btn,
.remove-avatar-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-avatar-btn {
  background: #667eea;
  color: white;
}

.upload-avatar-btn:hover {
  background: #5a67d8;
}

.remove-avatar-btn {
  background: #ef4444;
  color: white;
}

.remove-avatar-btn:hover {
  background: #dc2626;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  min-width: 100px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .profile-container,
  .post-creator,
  .posts-content {
    padding: 0 1rem;
  }

  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }


  .email-change-buttons {
    flex-direction: column;
    gap: 0.375rem;
  }

  .email-change-btn {
    justify-content: center;
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
}
</style>




