<template>
  <div class="community-page">
    <!-- 个人资料（登录后显示） -->
    <section v-if="isLoggedIn" class="profile-header">
      <div class="profile-container">
        <div class="profile-avatar">
          <img :src="userInfo?.avatar || placeholderAvatar" :alt="userInfo?.username || 'User'" />
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
        </div>
      </div>
    </section>

    <!-- 发布动态（未登录也显示但不可操作） -->
    <section class="post-creator">
      <div class="post-creator-container">
        <div class="post-creator-header">
          <div class="creator-avatar">
            <img :src="userInfo?.avatar || placeholderAvatarSmall" :alt="userInfo?.username || 'User'" />
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
                <img :src="post.author?.avatar || placeholderAvatarSmall" :alt="post.author?.username || 'User'" class="author-avatar" />
                <div class="author-info">
                  <div class="author-name">{{ post.author?.username || 'User' }}</div>
                  <div class="post-time">{{ formatTime(post.createdAt) }}</div>
                </div>
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
                  @click="previewImage(img)"
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
                  <img :src="comment.user?.avatar || placeholderAvatarSmall" :alt="comment.user?.username || 'User'" class="comment-avatar" />
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

    <!-- 图片预览 -->
    <div v-if="previewImageUrl" class="image-modal" @click="previewImageUrl = null">
      <img :src="previewImageUrl" alt="preview" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLanguageStore } from '../stores/useLanguageStore'
import { useUserStore } from '../stores/useUserStore'
import * as postsApi from '../api/posts'

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

const previewImageUrl = ref<string | null>(null)
const activeTab = ref<'latest' | 'hot'>('latest')

const placeholderAvatar = 'https://via.placeholder.com/150'
const placeholderAvatarSmall = 'https://via.placeholder.com/40'

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
      newPostContent.value = ''
      newPostImages.value = []
      locationName.value = ''
      locationCoords.value = null
      await loadPosts()
    }
  } catch (err: any) {
    alert(err.response?.data?.message || (languageStore.isZh ? '发布失败，请重试' : 'Failed to publish'))
  } finally {
    publishing.value = false
  }
}

const handleImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result as string
        if (result) newPostImages.value.push(result)
      }
      reader.readAsDataURL(file)
    }
  })
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

const previewImage = (url: string) => {
  previewImageUrl.value = url
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

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  padding-bottom: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
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
  border: 1px solid var(--border-color, transparent);
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
  border: 1px solid var(--border-color, transparent);
}

.dark-theme .post-item {
  background-color: var(--bg-color, #1a1a1a);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border-color: var(--border-color, #333333);
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
  object-fit: cover;
}

.author-name {
  font-weight: 700;
}

.post-time {
  font-size: 0.9rem;
  color: #777;
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
}

.post-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
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

.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.image-modal img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
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
}
</style>



