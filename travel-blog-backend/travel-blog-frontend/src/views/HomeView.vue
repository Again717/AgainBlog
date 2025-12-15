<template>
  <div class="home">
    <!-- Hero Section - 图片轮播图 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-carousel">
          <div class="carousel-container">
            <div 
              v-for="(slide, index) in carouselSlides" 
              :key="index"
              class="carousel-slide"
              :class="{ active: currentSlide === index }"
            >
              <div class="slide-background" :style="{ backgroundImage: `url(${slide.image})` }"></div>
              <div class="slide-overlay"></div>
              <div class="hero-text">
                <div class="hero-category">{{ slide.category }}</div>
                <h1 class="hero-motto">{{ slide.title }}</h1>
                <button class="read-post-btn">READ POST →</button>
              </div>
            </div>
          </div>
          <!-- 轮播指示器 -->
          <div class="carousel-dots">
            <span 
              v-for="(slide, index) in carouselSlides" 
              :key="index"
              class="dot"
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"
            ></span>
          </div>
          <!-- UP NEXT 框 -->
          <div class="up-next-box">
            <div class="up-next-label">UP NEXT</div>
            <div class="up-next-title">{{ carouselSlides[(currentSlide + 1) % carouselSlides.length].title }}</div>
            <button class="up-next-arrow" @click="nextSlide">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 1 - Travel Tips -->
    <section class="tips-section">
      <div class="container">
        <div class="tips-content">
          <div class="tips-left">
            <h2 class="tips-title">{{ t('home.tips.title') }}</h2>
            <div class="tips-image">
              <img src="https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=600&h=400&fit=crop" alt="山谷小镇">
            </div>
          </div>
          <div class="tips-right">
            <div class="tips-text">
              <p>{{ t('home.tips.text1') }}</p>
              <p>{{ t('home.tips.text2') }}</p>
              <p>{{ t('home.tips.text3') }}</p>
            </div>
            <button class="read-story-btn">{{ t('home.tips.readMore') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2 - Again的旅行故事 -->
    <section class="destinations-section">
      <div class="container">
        <div class="destinations-header">
          <div class="section-number">In The World <span class="number-large">02</span></div>
          <h2 class="section-title-white">{{ t('home.stories.title') }}</h2>
        </div>
        <div class="destinations-carousel-wrapper">
          <swiper
            :modules="swiperModules"
            :slides-per-view="3"
            :space-between="30"
            :centered-slides="true"
            :loop="true"
            :speed="600"
            :grab-cursor="true"
            :watch-overflow="true"
            :navigation="{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }"
            :breakpoints="{
              320: { 
                slidesPerView: 1,
                spaceBetween: 20,
                centeredSlides: true
              },
              768: { 
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: true
              },
            }"
            class="destinations-swiper"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
            @slideChangeTransitionStart="onTransitionStart"
            @slideChangeTransitionEnd="onTransitionEnd"
          >
            <swiper-slide
              v-for="(destination, index) in destinations"
              :key="index"
              class="destination-slide"
            >
              <div class="destination-card">
                <div class="destination-image">
                  <img :src="destination.image" :alt="destination.name">
                </div>
                <div
                  class="destination-info"
                  :style="{ backgroundColor: destination.themeColor || '#ffffff' }"
                >
                  <h3 class="destination-name">{{ destination.name }}</h3>
                  <p class="destination-location">{{ destination.location }}</p>
                  <p class="destination-description">
                    {{ destination.description }}
                  </p>
                  <div class="destination-meta-row">
                    <p class="destination-count">
                      {{ destination.count }}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </p>
                    <div class="destination-actions">
                      <button
                        type="button"
                        class="destination-action-btn"
                        @click.stop="likeDestination(index)"
                      >
                        <span class="icon">❤</span>
                        <span class="text">{{ destination.likes }} 赞</span>
                      </button>
                      <button
                        type="button"
                        class="destination-action-btn"
                        @click.stop="openCommentModal(index)"
                      >
                        <span class="icon">💬</span>
                        <span class="text">{{ destination.comments }} 评论</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
          <!-- 导航箭头 -->
          <button 
            class="carousel-nav-btn prev-btn swiper-button-prev-custom"
            :disabled="isTransitioning"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            class="carousel-nav-btn next-btn swiper-button-next-custom"
            :disabled="isTransitioning"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 3 - Travelers Blog -->
    <section class="blog-section">
      <div class="container">
        <h2 class="blog-main-title">{{ t('home.blog.title') }}</h2>
        <div class="blog-content">
          <div class="blog-posts">
            <article class="blog-post" v-for="(post, index) in blogPosts" :key="index">
              <div class="post-category">{{ t('home.blog.category') }}</div>
              <h3 class="post-title">{{ post.title }}</h3>
              <div class="post-meta">
                <span class="post-author">{{ t('home.blog.author') }}</span>
                <span class="post-date">{{ post.date }}</span>
              </div>
            </article>
          </div>
          <div class="blog-images">
            <div class="blog-image-small">
              <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" alt="山谷日落">
            </div>
            <div class="blog-image-small">
              <img src="https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=300&h=200&fit=crop" alt="旅者眺望">
            </div>
            <div class="blog-image-large">
              <img src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop" alt="岩石拱门">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4 - Gallery -->
    <section class="gallery-section">
      <div class="container">
        <h2 class="section-title">{{ t('home.gallery.title') }}</h2>
        <div class="gallery-grid">
          <div class="gallery-item" v-for="(item, index) in galleryItems" :key="index">
            <img :src="item.image" :alt="item.location">
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ item.title }}</h3>
              <p class="gallery-location">{{ item.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5 - 留言板 -->
    <section class="message-board-section">
      <div class="container">
        <h2 class="section-title-white">留言板</h2>
        <div class="message-board-content">
          <div class="messages-list">
            <div class="message-item" v-for="(message, index) in messages" :key="index">
              <div class="message-avatar">{{ message.avatar }}</div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-author">{{ message.author }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <p class="message-text">{{ message.text }}</p>
              </div>
            </div>
          </div>
          <form class="message-form" @submit.prevent="submitMessage">
            <div class="form-row">
              <input 
                type="text" 
                v-model="newMessage.author" 
                placeholder="您的昵称" 
                class="message-input"
                required
              />
              <input 
                type="email" 
                v-model="newMessage.email" 
                placeholder="您的邮箱" 
                class="message-input"
                required
              />
            </div>
            <textarea 
              v-model="newMessage.text" 
              placeholder="留下您的想法..." 
              class="message-textarea"
              rows="4"
              required
            ></textarea>
            <button type="submit" class="message-submit-btn">发送留言</button>
          </form>
        </div>
      </div>
    </section>

    <!-- 卡片评论弹窗 -->
    <div
      v-if="showCommentModal && activeDestination"
      class="comment-modal-overlay"
      @click.self="closeCommentModal"
    >
      <div class="comment-modal">
        <h3 class="comment-modal-title">{{ activeDestination.name }}</h3>
        <p class="comment-modal-location">{{ activeDestination.location }}</p>
        <p class="comment-modal-description">
          {{ activeDestination.description }}
        </p>
        <textarea
          v-model="commentText"
          class="comment-modal-textarea"
          rows="4"
          placeholder="写下你想对这段旅行说的话..."
        ></textarea>
        <div class="comment-modal-actions">
          <button
            type="button"
            class="comment-modal-btn secondary"
            @click="closeCommentModal"
          >
            取消
          </button>
          <button
            type="button"
            class="comment-modal-btn primary"
            :disabled="!commentText.trim()"
            @click="submitComment"
          >
            发送评论
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useI18n } from '../utils/i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import type { Swiper as SwiperType } from 'swiper'

const { t, language } = useI18n()

// Swiper 模块
const swiperModules = [Navigation]
const swiperInstance = ref<SwiperType | null>(null)
const isTransitioning = ref(false)

// 轮播图数据
const currentSlide = ref(0)
const carouselSlides = computed(() => [
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=800&fit=crop',
    category: 'Travels, India',
    title: 'On the banks of the Ganga'
  },
  {
    image: 'https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=1400&h=800&fit=crop',
    category: 'Travels, Japan',
    title: 'Rural Japan on 35mm film'
  },
  {
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1400&h=800&fit=crop',
    category: 'Travels, Turkey',
    title: 'Turkey part 3'
  },
  {
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&h=800&fit=crop',
    category: 'Travels, Morocco',
    title: 'Morocco'
  },
  {
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1400&h=800&fit=crop',
    category: 'Travels, Western Europe',
    title: 'Western Europe on 35mm film'
  }
])

let autoPlayTimer: number | null = null

const nextSlide = () => {
  stopAutoPlay()
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
  startAutoPlay()
}

const prevSlide = () => {
  stopAutoPlay()
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length
  startAutoPlay()
}

const goToSlide = (index: number) => {
  stopAutoPlay()
  currentSlide.value = index
  startAutoPlay()
}

const startAutoPlay = () => {
  autoPlayTimer = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 目的地轮播数据
const destinations = ref([
  {
    image: '/images/微信图片_20240121155016.jpg',
    name: '我在長白山很想你',
    location: '长白山，中国',
    description: '冷冽的山风裹着热乎乎的思念，在雪线边写下这句想你。',
    count: '12 place to visited',
    themeColor: '#e0f2fe',
    likes: 32,
    comments: 8
  },
  {
    image: '/images/微信图片_20240121155020.jpg',
    name: '繁华都市的日常',
    location: '上海，中国',
    description: '人潮和霓虹灯下，每一次驻足都是和这座城的短暂对话。',
    count: '28 place to visited',
    themeColor: '#fee2e2',
    likes: 45,
    comments: 12
  },
  {
    image: '/images/gulangyu.jpg',
    name: '海天一色的城市',
    location: '鼓浪屿，中国',
    description: '老房子、红瓦和海风，把时间拉得很慢很慢。',
    count: '35 place to visited',
    themeColor: '#ffedd5',
    likes: 51,
    comments: 19
  },
  {
    image: '/images/special-2.jpg',
    name: '魔都的夜晚',
    location: '上海，中国',
    description: '抬头是灯火辉煌的高楼，低头是各自奔赴的生活。',
    count: '18 place to visited',
    themeColor: '#e5e7eb',
    likes: 63,
    comments: 21
  },
  {
    image: '/images/微信图片_20240225195257.jpg',
    name: '旅行的美好瞬间',
    location: '旅行目的地',
    description: '按下快门的那一秒，风、光和心情刚刚好。',
    count: '22 place to visited',
    themeColor: '#fef3c7',
    likes: 27,
    comments: 6
  }
])

// 卡片点赞与评论（简单本地计数）
const likeDestination = (index: number) => {
  const item = destinations.value[index]
  if (!item) return
  item.likes = (item.likes || 0) + 1
}

const showCommentModal = ref(false)
const activeCommentIndex = ref<number | null>(null)
const commentText = ref('')

const activeDestination = computed(() => {
  if (activeCommentIndex.value === null) return null
  return destinations.value[activeCommentIndex.value] || null
})

const openCommentModal = (index: number) => {
  activeCommentIndex.value = index
  commentText.value = ''
  showCommentModal.value = true
}

const closeCommentModal = () => {
  showCommentModal.value = false
  commentText.value = ''
}

const submitComment = () => {
  if (activeCommentIndex.value === null || !commentText.value.trim()) return
  const item = destinations.value[activeCommentIndex.value]
  if (!item) return
  item.comments = (item.comments || 0) + 1
  // 这里可以后续接入真实评论提交逻辑
  showCommentModal.value = false
  commentText.value = ''
}

// Swiper 事件处理
const onSlideChange = (swiper: SwiperType) => {
  // Creative Effect 会自动处理样式
}

const onTransitionStart = (swiper: SwiperType) => {
  // 动画开始时禁用按钮
  isTransitioning.value = true
}

const onTransitionEnd = (swiper: SwiperType) => {
  // 动画结束时立即启用按钮
  isTransitioning.value = false
  
  // 确保 Swiper 导航按钮也恢复可用
  nextTick(() => {
    if (swiper.navigation) {
      // 强制更新导航按钮状态
      swiper.navigation.update()
    }
  })
}

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})

const blogPosts = ref([
  {
    title: "我们终于再次出国，重新拥抱那些遥远的海岸线。",
    date: "2024年3月15日"
  },
  {
    title: "人们远行，是为了看见别人日常里的惊奇与热情。",
    date: "2024年3月10日"
  },
  {
    title: "放慢脚步才能真正体会城市脉搏，感受属于它的味道。",
    date: "2024年3月5日"
  }
])

const galleryItems = ref([
  {
    image: "https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=500&h=400&fit=crop",
    title: "阿马尔菲·海崖小镇",
    location: "意大利 萨莱诺"
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
    title: "英属维京群岛",
    location: "加勒比海 Quamico"
  },
  {
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=400&fit=crop",
    title: "杰克逊霍尔雪谷",
    location: "美国 怀俄明"
  },
  {
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=400&fit=crop",
    title: "马丘比丘古迹",
    location: "秘鲁 吉奥拉"
  },
  {
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500&h=400&fit=crop",
    title: "阿马尔菲·冬日",
    location: "意大利 萨莱诺"
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
    title: "原野清晨",
    location: "自然秘境"
  }
])

// 留言板数据
const messages = ref([
  {
    avatar: '旅',
    author: '旅行者',
    time: '2小时前',
    text: '这里的风景太美了！下次一定要来这里！'
  },
  {
    avatar: '游',
    author: '游游',
    time: '1天前',
    text: '分享了很多实用的旅行 tips，非常有用！'
  },
  {
    avatar: '客',
    author: '游客123',
    time: '3天前',
    text: '期待更多精彩的内容和故事！'
  }
])

const newMessage = ref({
  author: '',
  email: '',
  text: ''
})

const submitMessage = () => {
  if (newMessage.value.author && newMessage.value.email && newMessage.value.text) {
    const now = new Date()
    const timeStr = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' + 
                    now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    
    messages.value.unshift({
      avatar: newMessage.value.author.charAt(0),
      author: newMessage.value.author,
      time: timeStr,
      text: newMessage.value.text
    })
    
    // 清空表单
    newMessage.value = {
      author: '',
      email: '',
      text: ''
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  position: relative;
  background-color: transparent;
  color: #ffffff;
  min-height: 100vh;
  z-index: 2;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.destinations-section .container {
  overflow: hidden;
}

/* Hero Section */
.hero-section {
  width: 100%;
  padding: 0;
  position: relative;
  z-index: 2;
  margin-top: 6rem;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 500px;
  max-height: 700px;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
  z-index: 1;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  z-index: 1;
}

.hero-text {
  text-align: center;
  padding: 2rem;
  z-index: 2;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero-category {
  font-size: 0.9rem;
  color: #FFD700;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.hero-motto {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  max-width: 900px;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.read-post-btn {
  background-color: rgba(50, 50, 50, 0.9);
  color: white;
  border: 2px solid white;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  letter-spacing: 0.5px;
}

.read-post-btn:hover {
  background-color: rgba(70, 70, 70, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: white;
  width: 24px;
  border-radius: 4px;
}

.up-next-box {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #FFD700;
  padding: 1.5rem 2rem;
  z-index: 10;
  border-radius: 0 0 0 12px;
  max-width: 280px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.up-next-box:hover {
  background-color: #FFC700;
}

.up-next-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.up-next-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  line-height: 1.4;
}

.up-next-arrow {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  background: transparent;
  border: none;
  color: #000;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.up-next-box:hover .up-next-arrow {
  transform: translateX(3px);
}

/* Tips Section */
.tips-section {
  padding: 4rem 2rem;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.tips-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.tips-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.tips-image {
  border-radius: 8px;
  overflow: hidden;
}

.tips-image img {
  width: 100%;
  height: auto;
  display: block;
}

.tips-text {
  font-size: 1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.tips-text p {
  margin-bottom: 1rem;
}

.read-story-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.875rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.read-story-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Destinations Section */
.destinations-section {
  padding: 4rem 2rem;
  background-color: transparent;
  color: white;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.destinations-header {
  position: relative;
  margin-bottom: 3rem;
}

.section-number {
  position: absolute;
  top: -1rem;
  left: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.section-number .number-large {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.section-title-white {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0;
  text-align: left;
  color: rgba(255, 255, 255, 0.9);
}

.destinations-carousel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-bottom: 4rem;
  padding-left: 0;
  padding-right: 0;
  min-width: 0;
}

.destinations-swiper {
  width: 100%;
  overflow: hidden;
  padding: 2rem 0;
  margin: 0;
  min-width: 0;
}

.destinations-swiper :deep(.swiper-container) {
  overflow: hidden;
  padding-left: 0;
  padding-right: 0;
}

.destinations-swiper :deep(.swiper-wrapper) {
  align-items: center;
  display: flex;
  width: 100%;
  transform: translate3d(0, 0, 0);
}

.destinations-swiper :deep(.swiper-slide) {
  width: 400px;
  height: 520px;
  flex-shrink: 0;
  flex-grow: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0.7;
  transform: scale(0.9);
  box-sizing: border-box;
}

.destination-slide {
  width: 100%;
  height: 100%;
}

/* 活动卡片（中间）更大更突出 */
.destinations-swiper :deep(.swiper-slide-active) {
  z-index: 10;
  opacity: 1;
  transform: scale(1.1);
}

.destinations-swiper :deep(.swiper-slide-active .destination-card) {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.destination-card {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* 活动卡片有更大的阴影 */
.destinations-swiper :deep(.swiper-slide-active .destination-card) {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.destination-image {
  width: 100%;
  flex: 2;
  position: relative;
  overflow: hidden;
  min-height: 0;
  max-height: 65%;
  height: 0;
  padding-bottom: 65%;
}

.destination-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.destination-info {
  padding: 1.5rem;
  color: #1e3a5f;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.destination-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  color: #000;
}

.destination-location {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.destination-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.destination-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.destination-count {
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.destination-count svg {
  color: #999;
}

.destination-actions {
  display: flex;
  gap: 0.5rem;
}

.destination-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
  cursor: pointer;
  font-size: 0.8rem;
  color: #555;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.destination-action-btn .icon {
  font-size: 0.9rem;
}

.destination-action-btn:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* 日间 / 夜间模式下的文字颜色自适应 */
@media (prefers-color-scheme: dark) {
  .destination-card {
    background-color: #111827;
    border-color: rgba(249, 250, 251, 0.08);
  }

  .destination-info {
    color: #e5e7eb;
  }

  .destination-name {
    color: #f9fafb;
  }

  .destination-location {
    color: #9ca3af;
  }

  .destination-description {
    color: #d1d5db;
  }

  .destination-count {
    color: #9ca3af;
  }

  .destination-action-btn {
    background: rgba(31, 41, 55, 0.9);
    border-color: rgba(55, 65, 81, 0.9);
    color: #e5e7eb;
  }

  .destination-action-btn:hover {
    background: rgba(55, 65, 81, 1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  }
}

/* 评论弹窗样式 */
.comment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.comment-modal {
  width: 100%;
  max-width: 480px;
  background: #0b1120;
  border-radius: 18px;
  padding: 1.75rem 2rem 1.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(148, 163, 184, 0.2);
  color: #e5e7eb;
}

.comment-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.comment-modal-location {
  font-size: 0.9rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.comment-modal-description {
  font-size: 0.9rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.comment-modal-textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.comment-modal-textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.6);
  background: rgba(15, 23, 42, 1);
}

.comment-modal-textarea::placeholder {
  color: #6b7280;
}

.comment-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.comment-modal-btn {
  min-width: 84px;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease,
    transform 0.1s ease, border-color 0.2s ease;
}

.comment-modal-btn.secondary {
  background: transparent;
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.6);
}

.comment-modal-btn.secondary:hover {
  background: rgba(15, 23, 42, 0.9);
}

.comment-modal-btn.primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.45);
}

.comment-modal-btn.primary:hover:not(:disabled) {
  background: #2563eb;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.6);
  transform: translateY(-1px);
}

.comment-modal-btn.primary:disabled {
  background: #1f2937;
  color: #6b7280;
  box-shadow: none;
  cursor: not-allowed;
}

.carousel-nav-btn {
  position: absolute;
  bottom: 1rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  pointer-events: auto;
  min-width: 40px;
  min-height: 40px;
}

.carousel-nav-btn.prev-btn {
  left: calc(50% - 60px);
}

.carousel-nav-btn.next-btn {
  right: calc(50% - 60px);
}

.carousel-nav-btn:hover:not(:disabled) {
  opacity: 0.8;
  transform: scale(1.1);
}

.carousel-nav-btn.prev-btn:hover:not(:disabled) {
  transform: translateX(-5px) scale(1.1);
}

.carousel-nav-btn.next-btn:hover:not(:disabled) {
  transform: translateX(5px) scale(1.1);
}

.carousel-nav-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
  pointer-events: none;
}

.carousel-nav-btn svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
  pointer-events: none;
}

.destinations-swiper :deep(.swiper-button-next),
.destinations-swiper :deep(.swiper-button-prev) {
  display: none;
}

/* Blog Section */
.blog-section {
  padding: 4rem 2rem;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.blog-main-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.3;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.blog-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.blog-posts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.blog-post {
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.blog-post:last-child {
  border-bottom: none;
}

.post-category {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.post-author {
  font-weight: 500;
}

.blog-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.blog-image-small {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.blog-image-small img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.blog-image-large {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.blog-image-large img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

/* Gallery Section */
.gallery-section {
  padding: 4rem 2rem;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 1.5rem;
  color: white;
  transform: translateY(0);
  transition: transform 0.3s;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.gallery-location {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Message Board Section */
.message-board-section {
  padding: 4rem 2rem;
  background-color: #000000;
  color: white;
  position: relative;
  z-index: 1;
}

.message-board-content {
  max-width: 800px;
  margin: 0 auto;
}

.messages-list {
  margin-bottom: 3rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 1rem;
}

.messages-list::-webkit-scrollbar {
  width: 6px;
}

.messages-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.messages-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.message-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.message-author {
  font-weight: 600;
  color: #ffffff;
}

.message-time {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.message-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.message-form {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message-input,
.message-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.message-input:focus,
.message-textarea:focus {
  outline: none;
  border-color: rgba(150, 200, 255, 0.6);
  box-shadow: 0 0 0 3px rgba(150, 200, 255, 0.2);
  background: rgba(255, 255, 255, 0.12);
}

.message-input::placeholder,
.message-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.message-textarea {
  resize: vertical;
  min-height: 120px;
  grid-column: 1 / -1;
}

.message-submit-btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.message-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(150, 200, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, #5a6578 0%, #3d4758 50%, #2a3042 100%);
}

@media (max-width: 1024px) {
  .hero-carousel {
    height: 500px;
  }

  .hero-motto {
    font-size: 2.5rem;
  }

  .tips-content {
    grid-template-columns: 1fr;
  }

  .blog-content {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-carousel {
    height: 400px;
  }

  .hero-motto {
    font-size: 1.8rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
