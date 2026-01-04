<template>
  <div class="tips-page">
    <!-- 发布攻略模块 -->
    <section class="publish-section">
      <div class="container">
        <div class="publish-card">
          <div class="publish-header">
            <h2>{{ languageStore.isZh ? '分享旅行攻略' : 'Share Travel Tips' }}</h2>
            <p>{{ languageStore.isZh ? '与旅友们分享你的旅行经验和攻略' : 'Share your travel experiences and tips with fellow travelers' }}</p>
          </div>

          <div class="publish-form" v-if="isLoggedIn">
            <div class="form-row">
              <input
                v-model="newTip.title"
                type="text"
                :placeholder="languageStore.isZh ? '攻略标题...' : 'Tip title...'"
                class="title-input"
              />
              <select v-model="newTip.category" class="category-select">
                <option value="">{{ languageStore.isZh ? '选择国内外' : 'Select Domestic/International' }}</option>
                <option value="domestic">{{ languageStore.isZh ? '国内' : 'Domestic' }}</option>
                <option value="international">{{ languageStore.isZh ? '国外' : 'International' }}</option>
              </select>
            </div>

            <div class="form-row">
              <select v-model="newTip.region" class="region-select">
                <option value="">{{ languageStore.isZh ? '选择地区' : 'Select Region' }}</option>
                <!-- 华北地区 -->
                <optgroup :label="languageStore.isZh ? '华北地区' : 'North China'">
                  <option value="beijing">{{ languageStore.isZh ? '北京市' : 'Beijing' }}</option>
                  <option value="tianjin">{{ languageStore.isZh ? '天津市' : 'Tianjin' }}</option>
                  <option value="hebei">{{ languageStore.isZh ? '河北省' : 'Hebei' }}</option>
                  <option value="shandong">{{ languageStore.isZh ? '山东省' : 'Shandong' }}</option>
                  <option value="henan">{{ languageStore.isZh ? '河南省' : 'Henan' }}</option>
                </optgroup>
                <!-- 东北地区 -->
                <optgroup :label="languageStore.isZh ? '东北地区' : 'Northeast China'">
                  <option value="heilongjiang">{{ languageStore.isZh ? '黑龙江省' : 'Heilongjiang' }}</option>
                  <option value="jilin">{{ languageStore.isZh ? '吉林省' : 'Jilin' }}</option>
                  <option value="liaoning">{{ languageStore.isZh ? '辽宁省' : 'Liaoning' }}</option>
                </optgroup>
                <!-- 华东地区 -->
                <optgroup :label="languageStore.isZh ? '华东地区' : 'East China'">
                  <option value="shanghai">{{ languageStore.isZh ? '上海市' : 'Shanghai' }}</option>
                  <option value="jiangsu">{{ languageStore.isZh ? '江苏省' : 'Jiangsu' }}</option>
                  <option value="zhejiang">{{ languageStore.isZh ? '浙江省' : 'Zhejiang' }}</option>
                  <option value="anhui">{{ languageStore.isZh ? '安徽省' : 'Anhui' }}</option>
                  <option value="fujian">{{ languageStore.isZh ? '福建省' : 'Fujian' }}</option>
                  <option value="jiangxi">{{ languageStore.isZh ? '江西省' : 'Jiangxi' }}</option>
                </optgroup>
                <!-- 中南地区 -->
                <optgroup :label="languageStore.isZh ? '中南地区' : 'Central-South China'">
                  <option value="hubei">{{ languageStore.isZh ? '湖北省' : 'Hubei' }}</option>
                  <option value="hunan">{{ languageStore.isZh ? '湖南省' : 'Hunan' }}</option>
                  <option value="guangdong">{{ languageStore.isZh ? '广东省' : 'Guangdong' }}</option>
                  <option value="guangxi">{{ languageStore.isZh ? '广西壮族自治区' : 'Guangxi' }}</option>
                  <option value="hainan">{{ languageStore.isZh ? '海南省' : 'Hainan' }}</option>
                  <option value="guizhou">{{ languageStore.isZh ? '贵州省' : 'Guizhou' }}</option>
                  <option value="yunnan">{{ languageStore.isZh ? '云南省' : 'Yunnan' }}</option>
                </optgroup>
                <!-- 西南地区 -->
                <optgroup :label="languageStore.isZh ? '西南地区' : 'Southwest China'">
                  <option value="chongqing">{{ languageStore.isZh ? '重庆市' : 'Chongqing' }}</option>
                  <option value="sichuan">{{ languageStore.isZh ? '四川省' : 'Sichuan' }}</option>
                  <option value="guizhou">{{ languageStore.isZh ? '贵州省' : 'Guizhou' }}</option>
                  <option value="yunnan">{{ languageStore.isZh ? '云南省' : 'Yunnan' }}</option>
                  <option value="xizang">{{ languageStore.isZh ? '西藏自治区' : 'Tibet' }}</option>
                </optgroup>
                <!-- 西北地区 -->
                <optgroup :label="languageStore.isZh ? '西北地区' : 'Northwest China'">
                  <option value="shanxi">{{ languageStore.isZh ? '山西省' : 'Shanxi' }}</option>
                  <option value="gansu">{{ languageStore.isZh ? '甘肃省' : 'Gansu' }}</option>
                  <option value="qinghai">{{ languageStore.isZh ? '青海省' : 'Qinghai' }}</option>
                  <option value="ningxia">{{ languageStore.isZh ? '宁夏回族自治区' : 'Ningxia' }}</option>
                  <option value="xinjiang">{{ languageStore.isZh ? '新疆维吾尔自治区' : 'Xinjiang' }}</option>
                </optgroup>
                <!-- 国外地区 -->
                <optgroup :label="languageStore.isZh ? '国外地区' : 'International'">
                  <option value="japan">{{ languageStore.isZh ? '日本' : 'Japan' }}</option>
                  <option value="korea">{{ languageStore.isZh ? '韩国' : 'Korea' }}</option>
                  <option value="thailand">{{ languageStore.isZh ? '泰国' : 'Thailand' }}</option>
                  <option value="vietnam">{{ languageStore.isZh ? '越南' : 'Vietnam' }}</option>
                  <option value="singapore">{{ languageStore.isZh ? '新加坡' : 'Singapore' }}</option>
                  <option value="malaysia">{{ languageStore.isZh ? '马来西亚' : 'Malaysia' }}</option>
                  <option value="indonesia">{{ languageStore.isZh ? '印尼' : 'Indonesia' }}</option>
                  <option value="philippines">{{ languageStore.isZh ? '菲律宾' : 'Philippines' }}</option>
                  <option value="other-international">{{ languageStore.isZh ? '其他国家' : 'Other Countries' }}</option>
                </optgroup>
              </select>

              <input
                v-model="newTip.location"
                type="text"
                :placeholder="languageStore.isZh ? '具体地点...' : 'Specific location...'"
                class="location-input"
              />
            </div>

            <textarea
              v-model="newTip.content"
              :placeholder="languageStore.isZh ? '分享你的旅行攻略和经验...' : 'Share your travel tips and experiences...'"
              class="content-textarea"
              rows="4"
            ></textarea>

            <div class="form-row">
              <div class="image-upload-section">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageSelect"
                  style="display: none"
                />
                <button type="button" class="upload-btn" @click="triggerImageUpload">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 12.414 11H13a2 2 0 0 1 2 2v1.172a2 2 0 0 1-.586 1.414l-1.707 1.707a1 1 0 0 1-1.414 0L9.586 14A2 2 0 0 1 9 12.586V12a2 2 0 0 1 2-2z"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  {{ languageStore.isZh ? '添加图片' : 'Add Images' }}
                </button>
                <div class="image-previews" v-if="newTip.images.length">
                  <div
                    v-for="(img, index) in newTip.images"
                    :key="index"
                    class="image-preview-item"
                  >
                    <img :src="img" alt="preview" />
                    <button class="remove-image-btn" @click="removeImage(index)">×</button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="publish-btn"
                :disabled="!canPublish"
                @click="publishTip"
              >
                {{ publishing ? (languageStore.isZh ? '发布中...' : 'Publishing...') : (languageStore.isZh ? '发布攻略' : 'Publish Tip') }}
              </button>
            </div>
          </div>

          <div v-else class="login-prompt">
            <p>{{ languageStore.isZh ? '请先登录后再分享攻略' : 'Please login to share travel tips' }}</p>
            <RouterLink to="/login" class="login-btn">{{ languageStore.isZh ? '前往登录' : 'Login' }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 筛选和搜索区域 -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container">
          <!-- 搜索 -->
          <div class="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="languageStore.isZh ? '搜索攻略...' : 'Search tips...'"
              @input="handleSearch"
            />
          </div>

          <!-- 分类筛选 -->
          <div class="filter-group">
            <label>{{ languageStore.isZh ? '分类' : 'Category' }}</label>
            <select v-model="selectedCategory" @change="applyFilters">
              <option value="">{{ languageStore.isZh ? '全部' : 'All' }}</option>
              <option value="domestic">{{ languageStore.isZh ? '国内' : 'Domestic' }}</option>
              <option value="international">{{ languageStore.isZh ? '国外' : 'International' }}</option>
            </select>
          </div>

          <!-- 地区筛选 -->
          <div class="filter-group">
            <label>{{ languageStore.isZh ? '地区/省份' : 'Region/Province' }}</label>
            <select v-model="selectedRegion" @change="applyFilters">
              <option value="">{{ languageStore.isZh ? '全部' : 'All' }}</option>
              <!-- 华北地区 -->
              <optgroup :label="languageStore.isZh ? '华北地区' : 'North China'">
                <option value="beijing">{{ languageStore.isZh ? '北京市' : 'Beijing' }}</option>
                <option value="tianjin">{{ languageStore.isZh ? '天津市' : 'Tianjin' }}</option>
                <option value="hebei">{{ languageStore.isZh ? '河北省' : 'Hebei' }}</option>
                <option value="shandong">{{ languageStore.isZh ? '山东省' : 'Shandong' }}</option>
                <option value="henan">{{ languageStore.isZh ? '河南省' : 'Henan' }}</option>
              </optgroup>
              <!-- 东北地区 -->
              <optgroup :label="languageStore.isZh ? '东北地区' : 'Northeast China'">
                <option value="heilongjiang">{{ languageStore.isZh ? '黑龙江省' : 'Heilongjiang' }}</option>
                <option value="jilin">{{ languageStore.isZh ? '吉林省' : 'Jilin' }}</option>
                <option value="liaoning">{{ languageStore.isZh ? '辽宁省' : 'Liaoning' }}</option>
              </optgroup>
              <!-- 华东地区 -->
              <optgroup :label="languageStore.isZh ? '华东地区' : 'East China'">
                <option value="shanghai">{{ languageStore.isZh ? '上海市' : 'Shanghai' }}</option>
                <option value="jiangsu">{{ languageStore.isZh ? '江苏省' : 'Jiangsu' }}</option>
                <option value="zhejiang">{{ languageStore.isZh ? '浙江省' : 'Zhejiang' }}</option>
                <option value="anhui">{{ languageStore.isZh ? '安徽省' : 'Anhui' }}</option>
                <option value="fujian">{{ languageStore.isZh ? '福建省' : 'Fujian' }}</option>
                <option value="jiangxi">{{ languageStore.isZh ? '江西省' : 'Jiangxi' }}</option>
              </optgroup>
              <!-- 中南地区 -->
              <optgroup :label="languageStore.isZh ? '中南地区' : 'Central-South China'">
                <option value="henan">{{ languageStore.isZh ? '河南省' : 'Henan' }}</option>
                <option value="hubei">{{ languageStore.isZh ? '湖北省' : 'Hubei' }}</option>
                <option value="hunan">{{ languageStore.isZh ? '湖南省' : 'Hunan' }}</option>
                <option value="guangdong">{{ languageStore.isZh ? '广东省' : 'Guangdong' }}</option>
                <option value="guangxi">{{ languageStore.isZh ? '广西壮族自治区' : 'Guangxi' }}</option>
                <option value="hainan">{{ languageStore.isZh ? '海南省' : 'Hainan' }}</option>
                <option value="guizhou">{{ languageStore.isZh ? '贵州省' : 'Guizhou' }}</option>
                <option value="yunnan">{{ languageStore.isZh ? '云南省' : 'Yunnan' }}</option>
              </optgroup>
              <!-- 西南地区 -->
              <optgroup :label="languageStore.isZh ? '西南地区' : 'Southwest China'">
                <option value="chongqing">{{ languageStore.isZh ? '重庆市' : 'Chongqing' }}</option>
                <option value="sichuan">{{ languageStore.isZh ? '四川省' : 'Sichuan' }}</option>
                <option value="guizhou">{{ languageStore.isZh ? '贵州省' : 'Guizhou' }}</option>
                <option value="yunnan">{{ languageStore.isZh ? '云南省' : 'Yunnan' }}</option>
                <option value="xizang">{{ languageStore.isZh ? '西藏自治区' : 'Tibet' }}</option>
              </optgroup>
              <!-- 西北地区 -->
              <optgroup :label="languageStore.isZh ? '西北地区' : 'Northwest China'">
                <option value="shanxi">{{ languageStore.isZh ? '山西省' : 'Shanxi' }}</option>
                <option value="gansu">{{ languageStore.isZh ? '甘肃省' : 'Gansu' }}</option>
                <option value="qinghai">{{ languageStore.isZh ? '青海省' : 'Qinghai' }}</option>
                <option value="ningxia">{{ languageStore.isZh ? '宁夏回族自治区' : 'Ningxia' }}</option>
                <option value="xinjiang">{{ languageStore.isZh ? '新疆维吾尔自治区' : 'Xinjiang' }}</option>
              </optgroup>
              <!-- 国外地区 -->
              <optgroup :label="languageStore.isZh ? '国外地区' : 'International'">
                <option value="japan">{{ languageStore.isZh ? '日本' : 'Japan' }}</option>
                <option value="korea">{{ languageStore.isZh ? '韩国' : 'Korea' }}</option>
                <option value="thailand">{{ languageStore.isZh ? '泰国' : 'Thailand' }}</option>
                <option value="vietnam">{{ languageStore.isZh ? '越南' : 'Vietnam' }}</option>
                <option value="singapore">{{ languageStore.isZh ? '新加坡' : 'Singapore' }}</option>
                <option value="malaysia">{{ languageStore.isZh ? '马来西亚' : 'Malaysia' }}</option>
                <option value="indonesia">{{ languageStore.isZh ? '印尼' : 'Indonesia' }}</option>
                <option value="philippines">{{ languageStore.isZh ? '菲律宾' : 'Philippines' }}</option>
                <option value="other-international">{{ languageStore.isZh ? '其他国家' : 'Other Countries' }}</option>
              </optgroup>
            </select>
          </div>

          <!-- 排序 -->
          <div class="filter-group">
            <label>{{ languageStore.isZh ? '排序' : 'Sort' }}</label>
            <select v-model="sortBy" @change="applyFilters">
              <option value="newest">{{ languageStore.isZh ? '最新发布' : 'Newest' }}</option>
              <option value="popular">{{ languageStore.isZh ? '最热门' : 'Most Popular' }}</option>
              <option value="nearest">{{ languageStore.isZh ? '距离最近' : 'Nearest' }}</option>
              <option value="farthest">{{ languageStore.isZh ? '距离最远' : 'Farthest' }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- 攻略瀑布流 -->
    <section class="tips-section">
      <div class="container">
        <div class="tips-grid" ref="tipsGrid">
          <div
            v-for="tip in filteredTips"
            :key="tip.id"
            class="tip-card"
            @click="openTipDetail(tip)"
            @dblclick="toggleLike(tip)"
          >
            <div class="tip-image">
              <img :src="tip.coverImage" :alt="tip.title" />
              <div class="tip-overlay">
                <div class="tip-info">
                  <h3 class="tip-title">{{ tip.title }}</h3>
                  <div class="tip-meta">
                    <span class="tip-author">{{ tip.author }}</span>
                    <span class="tip-location">{{ tip.location }}</span>
                  </div>
                </div>
                <div class="tip-actions">
                  <button class="like-btn" @click.stop="toggleLike(tip)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{{ tip.likes }}</span>
                  </button>
                  <button class="view-btn" @click.stop="openTipDetail(tip)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredTips.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 12.414 11H13a2 2 0 0 1 2 2v1.172a2 2 0 0 1-.586 1.414l-1.707 1.707a1 1 0 0 1-1.414 0L9.586 14A2 2 0 0 1 9 12.586V12a2 2 0 0 1 2-2z"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <p>{{ languageStore.isZh ? '暂无相关攻略' : 'No tips found' }}</p>
        </div>
      </div>
    </section>

    <!-- 攻略详情弹窗 -->
    <div v-if="selectedTip" class="tip-detail-modal" @click.self="closeTipDetail">
      <div class="modal-content">
        <button class="modal-close" @click="closeTipDetail">×</button>

        <div class="tip-detail-header">
          <div class="tip-detail-meta">
            <h2 class="tip-detail-title">{{ selectedTip.title }}</h2>
            <div class="tip-detail-info">
              <span class="tip-detail-author">{{ selectedTip.author }}</span>
              <span class="tip-detail-date">{{ formatDate(selectedTip.createdAt) }}</span>
              <span class="tip-detail-location">{{ selectedTip.location }}</span>
            </div>
          </div>
          <div class="tip-detail-actions">
            <button
              class="detail-like-btn"
              :class="{ liked: selectedTip.liked }"
              @click="toggleLike(selectedTip)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{{ selectedTip.likes }}</span>
            </button>
          </div>
        </div>

        <div class="tip-detail-content">
          <p class="tip-content">{{ selectedTip.content }}</p>

          <div v-if="selectedTip.images && selectedTip.images.length" class="tip-detail-images">
            <img
              v-for="(img, index) in selectedTip.images"
              :key="index"
              :src="img"
              :alt="`tip-image-${index}`"
              class="detail-image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useLanguageStore } from '../stores/useLanguageStore'
import { useUserStore } from '../stores/useUserStore'
import { RouterLink } from 'vue-router'

const languageStore = useLanguageStore()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.token)

// 发布相关
const newTip = ref({
  title: '',
  category: '',
  region: '',
  location: '',
  content: '',
  images: [] as string[]
})

const publishing = ref(false)
const imageInput = ref<HTMLInputElement | null>(null)

const canPublish = computed(() => {
  return newTip.value.title.trim() &&
         newTip.value.content.trim() &&
         newTip.value.category &&
         newTip.value.region
})

// 筛选和搜索
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedRegion = ref('')
const sortBy = ref('newest')
const userLocation = ref<{ lat: number; lng: number } | null>(null)

// 攻略数据
const tips = ref([
  {
    id: 1,
    title: '北京胡同深度游攻略',
    category: 'domestic',
    region: 'beijing',
    location: '北京市',
    content: '北京的胡同文化是老北京的灵魂所在。在胡同中漫步，你能感受到传统北京的生活气息。推荐路线：从南锣鼓巷开始，穿过什刹海，结束于后海酒吧一条街。记得品尝北京小吃，如糖葫芦、爆肚等。',
    coverImage: 'https://images.unsplash.com/photo-1558661093-bbf759ee7def?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558661093-bbf759ee7def?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    author: '北京通',
    likes: 156,
    liked: false,
    createdAt: new Date('2024-12-20')
  },
  {
    id: 2,
    title: '东京樱花季完美攻略',
    category: 'international',
    region: 'japan',
    location: '日本东京',
    content: '东京的樱花季是最美的季节。推荐去上野公园、新宿御苑和千鸟渊公园赏樱。记得提前预订酒店，因为樱花季人满为患。最佳观赏时间是3月底到4月初。',
    coverImage: 'https://images.unsplash.com/photo-1524413840807-0c3cb103ad00?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1524413840807-0c3cb103ad00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop'
    ],
    author: '樱花爱好者',
    likes: 203,
    liked: false,
    createdAt: new Date('2024-12-18')
  },
  {
    id: 3,
    title: '厦门鼓浪屿一日游',
    category: 'domestic',
    region: 'fujian',
    location: '福建省厦门市鼓浪屿',
    content: '鼓浪屿是厦门的明珠，被称为"海上花园"。岛上禁止机动车，环境优美。推荐景点：日光岩、菽庄花园、皓月园。记得品尝沙茶面和土笋冻。',
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=550&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    author: '海边漫步者',
    likes: 89,
    liked: false,
    createdAt: new Date('2024-12-15')
  },
  {
    id: 7,
    title: '桂林山水甲天下',
    category: 'domestic',
    region: 'guangxi',
    location: '广西壮族自治区桂林市',
    content: '桂林山水甲天下，阳朔西街是最具代表性的景点。推荐乘坐竹筏游漓江，欣赏两岸奇峰怪石。夜晚可以去阳朔西街品尝各种小吃，感受当地民俗文化。',
    coverImage: 'https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=400&h=480&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    author: '山水画家',
    likes: 145,
    liked: false,
    createdAt: new Date('2024-12-22')
  },
  {
    id: 8,
    title: '成都火锅与熊猫之旅',
    category: 'domestic',
    region: 'sichuan',
    location: '四川省成都市',
    content: '成都不仅是火锅之都，还是熊猫的故乡。推荐去成都大熊猫繁育研究基地近距离观察国宝，品尝正宗四川火锅，体验成都的慢节奏生活。',
    coverImage: 'https://images.unsplash.com/photo-1517151605781-b9b2c8c8c37?w=400&h=520&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517151605781-b9b2c8c8c37?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    author: '四川美食家',
    likes: 167,
    liked: false,
    createdAt: new Date('2024-12-21')
  },
  {
    id: 4,
    title: '普吉岛潜水体验',
    category: 'international',
    region: 'thailand',
    location: '普吉岛',
    content: '普吉岛是泰国最受欢迎的岛屿之一，以美丽的海滩和丰富的海洋生物闻名。潜水季节是11月到4月，水下能见度很高。推荐潜点：珊瑚岛、大小皮皮岛。',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=450&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop'
    ],
    author: '潜水爱好者',
    likes: 134,
    liked: false,
    createdAt: new Date('2024-12-12')
  },
  {
    id: 5,
    title: '杭州西湖经典路线',
    category: 'domestic',
    region: 'hangzhou',
    location: '杭州西湖',
    content: '西湖被誉为"中国最美的湖"。推荐游览路线：从断桥开始，游览白堤、苏堤，参观灵隐寺和飞来峰。秋天来看红叶，夏天来避暑。',
    coverImage: 'https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=400&h=480&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1464822759844-d150ad0d275c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    author: '江南游子',
    likes: 178,
    liked: false,
    createdAt: new Date('2024-12-10')
  },
  {
    id: 6,
    title: '首尔宫廷文化之旅',
    category: 'international',
    region: 'korea',
    location: '首尔',
    content: '首尔拥有丰富的历史文化遗产。必去景点：景福宫、光化门广场、明洞购物区。体验韩国的宫廷文化，品尝韩餐，感受韩流的魅力。',
    coverImage: 'https://images.unsplash.com/photo-1517151605781-6f6b66a6c37?w=400&h=520&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517151605781-6f6b66a6c37?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    author: '韩粉',
    likes: 92,
    liked: false,
    createdAt: new Date('2024-12-08')
  }
])

// 筛选和排序
const filteredTips = computed(() => {
  let filtered = tips.value.filter(tip => {
    const matchesSearch = !searchQuery.value ||
      tip.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tip.location.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = !selectedCategory.value || tip.category === selectedCategory.value
    const matchesRegion = !selectedRegion.value || tip.region === selectedRegion.value

    return matchesSearch && matchesCategory && matchesRegion
  })

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.likes - a.likes
      case 'nearest':
        // 根据距离排序（需要位置信息）
        if (userLocation.value) {
          // 这里可以实现实际的距离计算
          // 暂时按创建时间倒序作为替代
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
          // 如果没有用户位置，按热门度排序
          return b.likes - a.likes
        }
      case 'farthest':
        // 距离最远的（反向距离排序）
        if (userLocation.value) {
          // 这里可以实现实际的距离计算（反向）
          // 暂时按创建时间正序作为替代
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        } else {
          // 如果没有用户位置，按热门度倒序
          return a.likes - b.likes
        }
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return filtered
})

// 详情弹窗
const selectedTip = ref(null)

// 发布功能
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return

  const maxFiles = 5
  const filesToProcess = Array.from(files).slice(0, maxFiles)

  for (const file of filesToProcess) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      await new Promise<void>((resolve) => {
        reader.onload = (ev) => {
          const result = ev.target?.result as string
          if (result) newTip.value.images.push(result)
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // 清空input值
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const removeImage = (index: number) => {
  newTip.value.images.splice(index, 1)
}

const publishTip = async () => {
  if (!canPublish.value || !isLoggedIn.value) return

  publishing.value = true
  try {
    // 这里可以调用真实的API发布攻略
    const tipData = {
      ...newTip.value,
      author: userStore.userInfo?.username || '用户',
      likes: 0,
      liked: false,
      createdAt: new Date(),
      coverImage: newTip.value.images[0] || ''
    }

    tips.value.unshift(tipData)

    // 重置表单
    newTip.value = {
      title: '',
      category: '',
      region: '',
      location: '',
      content: '',
      images: []
    }

    alert(languageStore.isZh ? '攻略发布成功！' : 'Tip published successfully!')
  } catch (error) {
    console.error('发布攻略失败:', error)
    alert(languageStore.isZh ? '发布失败，请重试' : 'Failed to publish')
  } finally {
    publishing.value = false
  }
}

// 筛选功能
const handleSearch = () => {
  // 搜索会自动触发computed重新计算
}

const applyFilters = () => {
  // 筛选会自动触发computed重新计算
}

// 点赞功能
const toggleLike = (tip: any) => {
  if (!isLoggedIn.value) {
    alert(languageStore.isZh ? '请先登录后再点赞' : 'Please login to like tips')
    return
  }

  if (tip.liked) {
    tip.likes--
    tip.liked = false
  } else {
    tip.likes++
    tip.liked = true
  }
}

// 详情弹窗
const openTipDetail = (tip: any) => {
  selectedTip.value = tip
}

const closeTipDetail = () => {
  selectedTip.value = null
}

// 点击和双击处理
let clickTimeout: number | null = null

const handleCardClick = (tip: any) => {
  if (clickTimeout) {
    clearTimeout(clickTimeout)
    clickTimeout = null
    return
  }

  clickTimeout = window.setTimeout(() => {
    openTipDetail(tip)
    clickTimeout = null
  }, 200) // 200ms 内认为是单击
}

const handleDoubleClick = (tip: any) => {
  if (clickTimeout) {
    clearTimeout(clickTimeout)
    clickTimeout = null
  }

  toggleLike(tip)
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString(languageStore.isZh ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 瀑布流布局
const tipsGrid = ref<HTMLElement | null>(null)

// 获取用户位置
const getUserLocation = () => {
  if (!navigator.geolocation) {
    console.warn(languageStore.isZh ? '浏览器不支持地理定位' : 'Geolocation not supported')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      userLocation.value = { lat: latitude, lng: longitude }
      console.log(languageStore.isZh ? '已获取用户位置' : 'User location obtained')
    },
    (error) => {
      console.warn(languageStore.isZh ? '无法获取位置：' : 'Could not get location: ', error.message)
      // 不显示错误提示，因为这不是关键功能
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5分钟缓存
    }
  )
}

onMounted(() => {
  nextTick(() => {
    // 初始化瀑布流布局
    initializeMasonry()
    // 获取用户位置（用于距离排序）
    getUserLocation()
  })
})

const initializeMasonry = () => {
  if (!tipsGrid.value) return

  // 使用CSS Grid实现瀑布流效果
  const grid = tipsGrid.value
  grid.style.display = 'grid'
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))'
  grid.style.gap = '1rem'
}
</script>

<style scoped>
.tips-page {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background-color: transparent;
  color: var(--text-color, #000000);
  overflow-x: hidden;
}

/* 发布攻略模块 */
.publish-section {
  padding: 3rem 0;
  background-color: transparent;
  color: var(--text-color, #000000);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.publish-card {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.publish-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.publish-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.publish-form {
  margin-top: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.title-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.2));
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}

.title-input::placeholder {
  color: var(--text-secondary, rgba(0, 0, 0, 0.5));
}

.category-select,
.region-select,
.location-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.2));
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 1rem;
  min-width: 150px;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}

.content-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.2));
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}

.content-textarea::placeholder {
  color: var(--text-secondary, rgba(0, 0, 0, 0.5));
}

.image-upload-section {
  flex: 1;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  border-radius: 8px;
  color: var(--text-color, #000000);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: var(--bg-secondary, rgba(0, 0, 0, 0.1));
}

.image-previews {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.image-preview-item {
  position: relative;
  width: 60px;
  height: 60px;
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
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-btn {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.publish-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 2rem;
}

.login-prompt p {
  margin-bottom: 1rem;
  opacity: 0.9;
}

.login-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 筛选区域 */
.filters-section {
  padding: 2rem 0;
  background: var(--bg-color, #ffffff);
  border-bottom: 1px solid var(--border-color, #e5e5e5);
}

/* 白天模式下的筛选区域 */
.light-theme .filters-section {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

.filters-container {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-secondary, #f9f9f9);
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 8px;
  flex: 1;
  min-width: 250px;
}

.search-box svg {
  color: var(--text-secondary, #666);
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 1rem;
  color: var(--text-color, #000000);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-color, #000000);
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 8px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 0.9rem;
  cursor: pointer;
}

/* 攻略瀑布流 */
.tips-section {
  padding: 2rem 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
}

.tip-card {
  background: var(--bg-color, #ffffff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  break-inside: avoid;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

/* 白天模式下的攻略卡片 */
.light-theme .tip-card {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tip-image {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 133%; /* 4:3 比例 */
  overflow: hidden;
}

.tip-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tip-card:hover .tip-image img {
  transform: scale(1.05);
}

.tip-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 白天模式下的攻略覆盖层 */
.light-theme .tip-overlay {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
}

/* 白天模式下的攻略标题 */
.light-theme .tip-info h3 {
  color: #1f2937;
}

/* 白天模式下的攻略元信息 */
.light-theme .tip-meta span {
  color: rgba(31, 41, 55, 0.8);
}

.tip-card:hover .tip-overlay {
  opacity: 1;
}

.tip-info h3 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.tip-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tip-author,
.tip-location {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
}

.tip-actions {
  display: flex;
  gap: 0.5rem;
  align-self: flex-end;
}

.like-btn,
.view-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

/* 白天模式下的按钮 */
.light-theme .like-btn,
.light-theme .view-btn {
  background: rgba(31, 41, 55, 0.1);
  border-color: rgba(31, 41, 55, 0.3);
  color: #374151;
}

.like-btn:hover,
.view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary, #666);
}

.empty-state svg {
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* 详情弹窗 */
.tip-detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

/* 白天模式下的详情弹窗 */
.light-theme .modal-content {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
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

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-color, #000000);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.tip-detail-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color, #e5e5e5);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tip-detail-title {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color, #000000);
}

.tip-detail-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}

.tip-detail-actions {
  flex-shrink: 0;
}

.detail-like-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color, #e5e5e5);
  border-radius: 24px;
  color: var(--text-color, #000000);
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-like-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.detail-like-btn.liked {
  background: rgba(255, 107, 157, 0.1);
  color: #ff6b9d;
  border-color: #ff6b9d;
}

.detail-like-btn.liked svg {
  fill: #ff6b9d;
  stroke: #ff6b9d;
}

.tip-detail-content {
  padding: 2rem;
}

.tip-content {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-color, #000000);
  margin-bottom: 2rem;
}

.tip-detail-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.detail-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .form-row {
    flex-direction: column;
  }

  .tips-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .tip-detail-header {
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
</style>
