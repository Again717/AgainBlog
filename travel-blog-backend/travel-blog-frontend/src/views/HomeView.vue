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
          <div class="up-next-box" v-if="carouselSlides.length > 0">
            <div class="up-next-label">UP NEXT</div>
            <div class="up-next-title">{{ getNextSlideTitle() }}</div>
            <button class="up-next-arrow" @click="nextSlide">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 博主介绍模块 -->
    <section class="blogger-intro-section">
      <div class="container">
        <div class="blogger-intro-card">
          <div class="blogger-avatar-wrapper">
            <div class="blogger-avatar">A</div>
          </div>
          <div class="blogger-info">
            <h2 class="blogger-name">Again</h2>
            <div class="blogger-social">
              <a href="#" class="social-link" title="抖音">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="微博">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 7.684 7.684 0 0 0 2.88.556c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-1.782-2.222-3.127-4.281-3.5A8.327 8.327 0 0 0 8.691 2.188m.11 12.13c-1.2 0-2.365-.3-3.38-.86a.746.746 0 0 0-.96.213l-.66.99a.676.676 0 0 1-.78.3C1.772 14.308.87 12.03.87 9.53.87 6.17 4.08 3.28 8.691 3.28c2.365 0 4.535.88 6.186 2.48 1.65 1.6 2.56 3.7 2.56 6.01 0 2.31-.91 4.41-2.56 6.01a9.536 9.536 0 0 1-6.186 2.48m8.7-5.25h-1.75l-3.72-4.35v4.35H9.46V5.33h1.75l3.72 4.35V5.33h1.37zm1.13 4.46c0 .48-.39.87-.87.87a.875.875 0 0 1-.87-.87c0-.48.39-.87.87-.87.48 0 .87.39.87.87"/>
                </svg>
              </a>
              <a href="#" class="social-link" title="小红书">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </a>
            </div>
            <div class="blogger-details">
              <div class="detail-item">
                <span class="detail-label">爱好：</span>
                <span class="detail-tags">
                  <span class="tag">游泳</span>
                  <span class="tag">旅行</span>
                  <span class="tag">音乐</span>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">旅行足迹：</span>
                <span class="detail-tags">
                  <span class="tag">香港</span>
                  <span class="tag">上海</span>
                  <span class="tag">哈尔滨</span>
                  <span class="tag">长白山</span>
                  <span class="tag">广州</span>
                  <span class="tag">厦门</span>
                  <span class="tag">珠海</span>
                  <span class="tag">江门</span>
                  <span class="tag">汕头</span>
                  <span class="tag">潮汕</span>
                  <span class="tag">贵州</span>
                </span>
              </div>
            </div>
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
                <div
                  class="destination-image"
                  :class="{ 'clickable': activeSwiperSlideIndex === index }"
                  @click.stop="activeSwiperSlideIndex === index ? openCommentModal(index) : null"
                >
                  <img :src="destination.image" :alt="destination.name">
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <h3 class="overlay-title">{{ destination.name }}</h3>
                      <p class="overlay-location">{{ destination.location }}</p>
                    </div>
                  </div>
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
                        class="destination-action-btn like-btn"
                        :class="{ liked: destination.liked }"
                        :disabled="activeSwiperSlideIndex !== index"
                        @click.stop="activeSwiperSlideIndex === index ? likeDestination(index) : null"
                      >
                        <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span class="text">{{ destination.likes }}</span>
                      </button>
                      <button
                        type="button"
                        class="destination-action-btn comment-btn"
                        :disabled="activeSwiperSlideIndex !== index"
                        @click.stop="activeSwiperSlideIndex === index ? openCommentModal(index) : null"
                      >
                        <svg class="comment-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span class="text">{{ destination.comments }}</span>
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

    <!-- 卡片评论弹窗 - 重新设计 -->
    <div
      v-if="showCommentModal && activeDestination"
      class="comment-modal-overlay-new"
      @click.self="closeCommentModal"
    >
      <div class="comment-modal-new">
        <!-- 关闭按钮 -->
        <button class="modal-close-btn" @click="closeCommentModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-content-wrapper">
          <!-- 左侧图片预览区 -->
          <div class="modal-image-section">
            <div class="image-preview-container">
              <div
                class="preview-image"
                :style="{ background: previewImages[currentImageIndex].gradient }"
              >
                <div class="image-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                </div>
              </div>
              <div class="image-nav">
                <button @click="prevImage" class="nav-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <div class="image-indicators">
                  <span
                    v-for="(img, index) in previewImages"
                    :key="index"
                    class="indicator"
                    :class="{ active: index === currentImageIndex }"
                    @click="currentImageIndex = index"
                  ></span>
                </div>
                <button @click="nextImage" class="nav-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧评论区 -->
          <div class="modal-comments-section">
            <div class="modal-header">
              <div class="modal-destination-info">
                <h3 class="modal-destination-title">{{ activeDestination.name }}</h3>
                <p class="modal-destination-location">{{ activeDestination.location }}</p>
                <div class="modal-destination-stats">
                  <span class="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {{ activeDestination.likes }}
                  </span>
                  <span class="stat">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {{ activeDestination.comments }}
                  </span>
                </div>
              </div>
            </div>

            <div class="comments-container">
              <!-- 评论列表 -->
              <div class="comments-list">
                <div
                  v-for="(comment, index) in activeDestination.commentList"
                  :key="index"
                  class="comment-item"
                >
                  <div class="comment-main">
                    <div class="comment-avatar">
                      <img v-if="getAvatarUrl(comment.userAvatar)" :src="getAvatarUrl(comment.userAvatar)" :alt="comment.user" />
                      <span v-else>{{ comment.user.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-user">{{ comment.user }}</span>
                        <span class="comment-time">{{ comment.time }}</span>
                      </div>
                      <p class="comment-text">{{ comment.content }}</p>
                      <div class="comment-actions">
                        <button
                          class="action-btn like-comment-btn"
                          :class="{ liked: comment.liked }"
                          @click="likeComment(activeCommentIndex!, index)"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {{ comment.likes }}
                        </button>
                        <button
                          class="action-btn reply-btn"
                          @click="showReplyInput(activeCommentIndex!, index)"
                        >
                          回复
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 回复输入框 -->
                  <div v-if="showReplyInputs[`${activeCommentIndex}-${index}`]" class="reply-input-wrapper">
                    <textarea
                      v-model="replyTexts[`${activeCommentIndex}-${index}`]"
                      class="reply-textarea"
                      placeholder="写下你的回复..."
                      rows="2"
                    ></textarea>
                    <div class="reply-actions">
                      <button
                        class="cancel-reply-btn"
                        @click="cancelReply(activeCommentIndex!, index)"
                      >
                        取消
                      </button>
                      <button
                        class="submit-reply-btn"
                        :disabled="!replyTexts[`${activeCommentIndex}-${index}`]?.trim()"
                        @click="submitReply(activeCommentIndex!, index)"
                      >
                        回复
                      </button>
                    </div>
                  </div>

                  <!-- 回复列表 -->
                  <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                    <div
                      v-for="(reply, replyIndex) in comment.replies"
                      :key="replyIndex"
                      class="reply-item"
                    >
                      <div class="reply-avatar">
                        <img v-if="getAvatarUrl(reply.userAvatar)" :src="getAvatarUrl(reply.userAvatar)" :alt="reply.user" />
                        <span v-else>{{ reply.user.charAt(0).toUpperCase() }}</span>
                      </div>
                      <div class="reply-content">
                        <div class="reply-header">
                          <span class="reply-user">{{ reply.user }}</span>
                          <span class="reply-time">{{ reply.time }}</span>
                        </div>
                        <p class="reply-text">{{ reply.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 评论输入框 -->
              <div class="comment-input-section">
                <textarea
                  v-model="commentText"
                  class="comment-textarea-modal"
                  rows="3"
                  placeholder="写下你的想法..."
                ></textarea>
                <button
                  class="submit-comment-btn"
                  :disabled="!commentText.trim()"
                  @click="submitComment"
                >
                  发布
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 5 - 留言板 -->
    <section class="message-board-section">
      <div class="container">
        <h2 class="message-board-title">留言板</h2>
        <div class="message-board-content">
          <!-- 留言列表 -->
          <div class="messages-list">
            <div v-if="loadingMessages" class="loading-messages">
              <p>加载中...</p>
            </div>
            <div v-else-if="messages.length > 0" class="message-item" v-for="(message, index) in messages" :key="index">
              <div class="message-avatar">
                <img v-if="getAvatarUrl(message.userAvatar)" :src="getAvatarUrl(message.userAvatar)" :alt="message.author" />
                <span v-else>{{ message.avatar }}</span>
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-author">{{ message.author }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <p class="message-text">{{ message.text }}</p>
              </div>
            </div>
            <div v-else class="empty-messages">
              <p>还没有留言，快来留下第一条吧～</p>
            </div>
          </div>
          
          <!-- 评论表单 -->
          <div class="message-form-wrapper">
            <div v-if="!isLoggedIn" class="login-prompt">
              <p>请先登录后再发表评论</p>
              <RouterLink to="/login" class="login-link">前往登录</RouterLink>
            </div>
            <form v-else class="message-form" @submit.prevent="submitMessage">
              <div class="form-header">
                <div class="user-info">
                  <div class="user-avatar">{{ userAvatar }}</div>
                  <span class="user-name">{{ userStore.userInfo?.username || '用户' }}</span>
                </div>
              </div>
              <textarea 
                v-model="newMessage.text" 
                placeholder="写下你的想法..." 
                class="message-textarea"
                rows="4"
                required
              ></textarea>
              <div class="form-footer">
                <button type="submit" class="message-submit-btn" :disabled="!newMessage.text.trim()">
                  <span>发布评论</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片评论弹窗 - 重新设计 -->
    <div
      v-if="showCommentModal && activeDestination"
      class="comment-modal-overlay-new"
      @click.self="closeCommentModal"
    >
      <div class="comment-modal-new">
        <!-- 关闭按钮 -->
        <button class="modal-close-btn" @click="closeCommentModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-content-wrapper">
          <!-- 左侧图片预览区 -->
          <div class="modal-image-section">
            <div class="image-preview-container">
              <div 
                class="preview-image"
                :style="{ background: previewImages[currentImageIndex].gradient }"
              >
                <div class="image-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>
              <!-- 图片切换按钮 -->
              <button class="image-nav-btn prev-image-btn" @click="prevImage" v-if="previewImages.length > 1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button class="image-nav-btn next-image-btn" @click="nextImage" v-if="previewImages.length > 1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <!-- 图片指示器 -->
              <div class="image-indicators" v-if="previewImages.length > 1">
                <span 
                  v-for="(img, idx) in previewImages" 
                  :key="idx"
                  class="indicator-dot"
                  :class="{ active: idx === currentImageIndex }"
                  @click="currentImageIndex = idx"
                ></span>
              </div>
            </div>
          </div>
          
          <!-- 右侧评论和点赞区 -->
          <div class="modal-comment-section">
            <div class="comment-header">
              <h3 class="comment-title">{{ activeDestination.name }}</h3>
              <p class="comment-location">{{ activeDestination.location }}</p>
            </div>
            
            <!-- 点赞区域 -->
            <div class="like-section">
              <button 
                class="like-btn-modal"
                :class="{ liked: activeDestination.liked }"
                @click="likeDestination(activeCommentIndex!)"
              >
                <svg class="heart-icon-modal" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-count">{{ activeDestination.likes }}</span>
              </button>
            </div>
            
            <!-- 评论列表 -->
            <div class="comments-list-container">
              <div class="comments-header-row">
                <h4 class="comments-title">评论 ({{ activeDestination.comments }})</h4>
              </div>
              <div class="comments-list">
                <div v-if="activeDestination.commentList && activeDestination.commentList.length > 0" class="comments-items">
                  <div 
                    v-for="(comment, idx) in activeDestination.commentList" 
                    :key="idx"
                    class="comment-item"
                  >
                    <div class="comment-user-avatar">
                      <img v-if="getAvatarUrl(comment.userAvatar)" :src="getAvatarUrl(comment.userAvatar)" :alt="comment.user" />
                      <span v-else>{{ comment.user.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="comment-content-wrapper">
                      <div class="comment-user-name">{{ comment.user }}</div>
                      <div class="comment-text-content">{{ comment.content }}</div>
                      <div class="comment-time">{{ comment.time }}</div>
                      <div class="comment-actions">
                        <button 
                          class="comment-action-btn"
                          :class="{ liked: comment.liked }"
                          @click="likeComment(activeCommentIndex!, idx)"
                          :title="languageStore.isZh ? '点赞' : 'Like'"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          <span>{{ comment.likes || 0 }}</span>
                        </button>
                        <button
                          class="comment-action-btn reply-btn"
                          @click="showReplyInput(activeCommentIndex!, idx)"
                          :title="languageStore.isZh ? '回复' : 'Reply'"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>{{ languageStore.isZh ? '回复' : 'Reply' }}</span>
                        </button>
                        <!-- 删除按钮 - 只有评论作者才能看到 -->
                        <button
                          v-if="userStore.userInfo && comment.userId === userStore.userInfo.id"
                          class="comment-action-btn delete-btn"
                          @click="deleteComment(activeCommentIndex!, idx)"
                          :title="languageStore.isZh ? '删除评论' : 'Delete Comment'"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          <span>{{ languageStore.isZh ? '删除' : 'Delete' }}</span>
                        </button>
                      </div>
                      <!-- 回复输入框 -->
                      <div v-if="showReplyInputs[`${activeCommentIndex}-${idx}`]" class="reply-input-wrapper">
                        <textarea
                          v-model="replyTexts[`${activeCommentIndex}-${idx}`]"
                          class="reply-textarea"
                          rows="2"
                          :placeholder="languageStore.isZh ? '写下你的回复...' : 'Write your reply...'"
                        ></textarea>
                        <div class="reply-actions">
                          <button 
                            class="reply-submit-btn"
                            @click="submitReply(activeCommentIndex!, idx)"
                            :disabled="!replyTexts[`${activeCommentIndex}-${idx}`]?.trim()"
                          >
                            {{ languageStore.isZh ? '发送' : 'Send' }}
                          </button>
                          <button 
                            class="reply-cancel-btn"
                            @click="cancelReply(activeCommentIndex!, idx)"
                          >
                            {{ languageStore.isZh ? '取消' : 'Cancel' }}
                          </button>
                        </div>
                      </div>
                      <!-- 回复列表 -->
                      <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                        <div 
                          v-for="(reply, replyIdx) in comment.replies" 
                          :key="replyIdx"
                          class="reply-item"
                        >
                          <div class="reply-user-avatar">{{ reply.user.charAt(0) }}</div>
                          <div class="reply-content">
                            <div class="reply-user-name">{{ reply.user }}</div>
                            <div class="reply-text">{{ reply.content }}</div>
                            <div class="reply-time">{{ reply.time }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-comments">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>暂无评论</p>
                </div>
              </div>
            </div>
            
            <!-- 发表评论输入框 -->
            <div class="comment-input-section">
              <div v-if="!isLoggedIn" class="login-prompt-modal">
                <p>请先登录后再发表评论</p>
                <RouterLink to="/login" class="login-link-modal">前往登录</RouterLink>
              </div>
              <div v-else class="comment-input-wrapper">
                <textarea
                  v-model="commentText"
                  class="comment-textarea-modal"
                  rows="3"
                  placeholder="写下你的想法..."
                ></textarea>
                <button
                  class="submit-comment-btn"
                  :disabled="!commentText.trim()"
                  @click="submitComment"
                >
                  发布
                </button>
              </div>
            </div>
          </div>
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
import { useUserStore } from '../stores/useUserStore'
import { useLanguageStore } from '../stores/useLanguageStore'
import { RouterLink } from 'vue-router'
import { getCarouselImages } from '../api/carousel'
import {
  getTravelStories,
  likeTravelStory,
  commentTravelStory,
  likeTravelStoryComment,
  replyTravelStoryComment,
  deleteTravelStoryComment,
  type TravelStory
} from '../api/travelStories'
import { getPosts } from '../api/posts'

const { t, language } = useI18n()
const userStore = useUserStore()
const languageStore = useLanguageStore()

// Swiper 模块
const swiperModules = [Navigation]
const swiperInstance = ref<SwiperType | null>(null)
const isTransitioning = ref(false)
const activeSwiperSlideIndex = ref(0)

// 轮播图数据
const currentSlide = ref(0)
const carouselSlides = ref<Array<{ image: string; category: string; title: string }>>([])

// 从API加载轮播图数据
const loadCarouselImages = async () => {
  try {
    const response = await getCarouselImages()
    if (response.success && response.data) {
      carouselSlides.value = response.data.map((item: any) => ({
        image: item.imagePath,
        category: 'Travels, China',
        title: item.description || item.name
      }))
    }
  } catch (error) {
    console.error('加载轮播图失败:', error)
    // 如果API失败，使用默认数据
    carouselSlides.value = [
      {
        image: '/images/Home/长白山.jpg',
        category: 'Travels, China',
        title: '长白山 - 雪域仙境'
      },
      {
        image: '/images/Home/上海外滩.jpg',
        category: 'Travels, China',
        title: '上海外滩 - 东方明珠'
      },
      {
        image: '/images/Home/厦门鼓浪屿.jpg',
        category: 'Travels, China',
        title: '厦门鼓浪屿 - 海上花园'
      },
      {
        image: '/images/Home/哈尔滨.jpg',
        category: 'Travels, China',
        title: '哈尔滨 - 冰城雪韵'
      },
      {
        image: '/images/Home/贵州阿西里西大草原.jpg',
        category: 'Travels, China',
        title: '贵州阿西里西大草原 - 高原风光'
      }
    ]
  }
}

// 从API加载旅行故事数据
const loadTravelStories = async () => {
  try {
    isLoadingDestinations.value = true
    const response = await getTravelStories()
    if (response.success && response.data) {
      destinations.value = response.data
    }
  } catch (error) {
    console.error('加载旅行故事失败:', error)
    // 如果API失败，使用默认数据（保持向后兼容）
    destinations.value = [
      {
        _id: 'default-1',
        image: '/images/Home/长白山.jpg',
        name: '我在長白山很想你',
        location: '长白山，中国',
        description: '冷冽的山风裹着热乎乎的思念，在雪线边写下这句想你。长白山天池如镜，雪峰耸立，是东北最壮美的自然奇观。',
        count: '12 place to visited',
        themeColor: '#e0f2fe',
        likes: 32,
        comments: 8,
        liked: false,
        commentList: [
          { _id: 'c1', user: '旅行者A', content: '太美了！下次一定要去！', time: '2小时前', likes: 5, liked: false, replies: [] },
          { _id: 'c2', user: '游游', content: '雪景真的很震撼', time: '1天前', likes: 3, liked: false, replies: [] }
        ]
      },
      {
        _id: 'default-2',
        image: '/images/Home/上海外滩.jpg',
        name: '繁华都市的日常',
        location: '上海，中国',
        description: '人潮和霓虹灯下，每一次驻足都是和这座城的短暂对话。外滩万国建筑博览群，黄浦江畔的繁华与历史交融。',
        count: '28 place to visited',
        themeColor: '#fee2e2',
        likes: 45,
        comments: 12,
        liked: false,
        commentList: [
          { _id: 'c3', user: '城市探索者', content: '外滩的夜景真的很美', time: '3小时前', likes: 8, liked: false, replies: [] },
          { _id: 'c4', user: '摄影爱好者', content: '拍得真好！', time: '5小时前', likes: 4, liked: false, replies: [] }
        ]
      },
      {
        _id: 'default-3',
        image: '/images/Home/厦门鼓浪屿.jpg',
        name: '海天一色的城市',
        location: '鼓浪屿，中国',
        description: '老房子、红瓦和海风，把时间拉得很慢很慢。海上花园，琴岛风情，中西合璧的建筑艺术与浪漫的海岛风光。',
        count: '35 place to visited',
        themeColor: '#ffedd5',
        likes: 51,
        comments: 19,
        liked: false,
        commentList: [
          { _id: 'c5', user: '海岛控', content: '鼓浪屿真的很适合慢生活', time: '1天前', likes: 12, liked: false, replies: [] },
          { _id: 'c6', user: '文艺青年', content: '喜欢这种悠闲的感觉', time: '2天前', likes: 6, liked: false, replies: [] }
        ]
      },
      {
        _id: 'default-4',
        image: '/images/Home/哈尔滨.jpg',
        name: '冰城雪韵',
        location: '哈尔滨，中国',
        description: '冰城雪韵，欧式建筑与冰雪文化的完美结合，冬季的童话世界。抬头是灯火辉煌的高楼，低头是各自奔赴的生活。',
        count: '18 place to visited',
        themeColor: '#e5e7eb',
        likes: 63,
        comments: 21,
        liked: false,
        commentList: [
          { _id: 'c7', user: '冰雪爱好者', content: '哈尔滨的冬天太美了！', time: '4小时前', likes: 15, liked: false, replies: [] },
          { _id: 'c8', user: '北方人', content: '家乡的风景总是最美的', time: '6小时前', likes: 7, liked: false, replies: [] }
        ]
      },
      {
        _id: 'default-5',
        image: '/images/Home/贵州阿西里西大草原.jpg',
        name: '高原风光',
        location: '贵州阿西里西大草原，中国',
        description: '高原风光，云海翻腾，草原辽阔，是贵州的天然氧吧。按下快门的那一秒，风、光和心情刚刚好。',
        count: '22 place to visited',
        themeColor: '#fef3c7',
        likes: 27,
        comments: 6,
        liked: false,
        commentList: []
      }
    ]
  } finally {
    isLoadingDestinations.value = false
  }
}

// 加载留言板数据
const loadMessages = async () => {
  try {
    loadingMessages.value = true
    // 暂时使用硬编码数据，后续可以改为从API获取
    messages.value = [
      {
        avatar: userStore.userInfo?.username?.charAt(0).toUpperCase() || '旅',
        author: userStore.userInfo?.username || '旅行者',
        time: '2小时前',
        text: '这里的风景太美了！下次一定要来这里！',
        userId: userStore.userInfo?.id,
        userAvatar: userStore.userInfo?.avatar
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
    ]
  } catch (error) {
    console.error('加载留言板数据失败:', error)
  } finally {
    loadingMessages.value = false
  }
}

let autoPlayTimer: number | null = null

const nextSlide = () => {
  if (carouselSlides.value.length === 0) return
  stopAutoPlay()
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
  startAutoPlay()
}

const prevSlide = () => {
  if (carouselSlides.value.length === 0) return
  stopAutoPlay()
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length
  startAutoPlay()
}

const goToSlide = (index: number) => {
  if (carouselSlides.value.length === 0) return
  stopAutoPlay()
  currentSlide.value = index
  startAutoPlay()
}

// 获取下一张幻灯片的标题
const getNextSlideTitle = () => {
  if (carouselSlides.value.length === 0) return ''
  const nextIndex = (currentSlide.value + 1) % carouselSlides.value.length
  return carouselSlides.value[nextIndex]?.title || ''
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


onMounted(async () => {
  await loadCarouselImages()
  await loadTravelStories()
  await loadMessages()
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

// 目的地轮播数据 - 从API加载
const destinations = ref<TravelStory[]>([])
const isLoadingDestinations = ref(true)

// 卡片点赞（使用API）
const likeDestination = async (index: number) => {
  const item = destinations.value[index]
  if (!item || !isLoggedIn.value) return

  try {
    const response = await likeTravelStory(item._id)
    if (response.success && response.data) {
      // 更新本地数据
      const updatedItem = response.data
      destinations.value[index] = updatedItem
    }
  } catch (error) {
    console.error('点赞失败:', error)
    // 如果API失败，回退到本地状态变更（保持向后兼容）
    if (item.liked) {
      item.likes = Math.max(0, (item.likes || 0) - 1)
      item.liked = false
    } else {
      item.likes = (item.likes || 0) + 1
      item.liked = true
    }
  }
}

const showCommentModal = ref(false)
const activeCommentIndex = ref<number | null>(null)
const commentText = ref('')
const currentImageIndex = ref(0)
const showReplyInputs = ref<Record<string, boolean>>({})
const replyTexts = ref<Record<string, string>>({})

const activeDestination = computed(() => {
  if (activeCommentIndex.value === null) return null
  return destinations.value[activeCommentIndex.value] || null
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

// 预览图片列表（使用渐变背景代替）
const previewImages = computed(() => {
  return [
    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ]
})

const openCommentModal = (index: number) => {
  activeCommentIndex.value = index
  commentText.value = ''
  currentImageIndex.value = 0
  showCommentModal.value = true
}

const closeCommentModal = () => {
  showCommentModal.value = false
  commentText.value = ''
  currentImageIndex.value = 0
}

const submitComment = async () => {
  if (activeCommentIndex.value === null || !commentText.value.trim() || !isLoggedIn.value) return

  const item = destinations.value[activeCommentIndex.value]
  if (!item) return

  try {
    const response = await commentTravelStory(item._id, commentText.value.trim())
    if (response.success && response.data) {
      // 更新本地数据
      const updatedItem = response.data
      destinations.value[activeCommentIndex.value] = updatedItem
      commentText.value = ''
    }
  } catch (error) {
    console.error('评论失败:', error)
    // 如果API失败，保持本地状态（向后兼容）
    item.comments = (item.comments || 0) + 1
    if (!item.commentList) {
      item.commentList = []
    }
    item.commentList.unshift({
      _id: `local-${Date.now()}`,
      user: userStore.userInfo?.username || '游客',
      userAvatar: userStore.userInfo?.avatar,
      content: commentText.value.trim(),
      time: '刚刚',
      likes: 0,
      liked: false,
      replies: []
    })
    commentText.value = ''
  }
}

const likeComment = async (destinationIndex: number, commentIndex: number) => {
  const item = destinations.value[destinationIndex]
  if (!item || !item.commentList || !isLoggedIn.value) return

  const comment = item.commentList[commentIndex]
  if (!comment) return

  try {
    const response = await likeTravelStoryComment(item._id, comment._id)
    if (response.success && response.data) {
      // 更新本地数据
      const updatedItem = response.data
      destinations.value[destinationIndex] = updatedItem
    }
  } catch (error) {
    console.error('点赞评论失败:', error)
    // 如果API失败，回退到本地状态变更
    if (comment.liked) {
      comment.likes = Math.max(0, (comment.likes || 0) - 1)
      comment.liked = false
    } else {
      comment.likes = (comment.likes || 0) + 1
      comment.liked = true
    }
  }
}

const showReplyInput = (destinationIndex: number, commentIndex: number) => {
  const key = `${destinationIndex}-${commentIndex}`
  showReplyInputs.value[key] = true
  if (!replyTexts.value[key]) {
    replyTexts.value[key] = ''
  }
}

const cancelReply = (destinationIndex: number, commentIndex: number) => {
  const key = `${destinationIndex}-${commentIndex}`
  showReplyInputs.value[key] = false
  replyTexts.value[key] = ''
}

const submitReply = async (destinationIndex: number, commentIndex: number) => {
  const key = `${destinationIndex}-${commentIndex}`
  const replyText = replyTexts.value[key]?.trim()
  if (!replyText || !isLoggedIn.value) return

  const item = destinations.value[destinationIndex]
  if (!item || !item.commentList) return

  const comment = item.commentList[commentIndex]
  if (!comment) return

  try {
    const response = await replyTravelStoryComment(item._id, comment._id, replyText)
    if (response.success && response.data) {
      // 更新本地数据
      const updatedItem = response.data
      destinations.value[destinationIndex] = updatedItem
      replyTexts.value[key] = ''
      showReplyInputs.value[key] = false
    }
  } catch (error) {
    console.error('回复评论失败:', error)
    // 如果API失败，保持本地状态
    if (!comment.replies) {
      comment.replies = []
    }
    comment.replies.push({
      _id: `local-reply-${Date.now()}`,
      user: userStore.userInfo?.username || '游客',
      userAvatar: userStore.userInfo?.avatar,
      content: replyText,
      time: '刚刚'
    })
    replyTexts.value[key] = ''
    showReplyInputs.value[key] = false
  }
}

const deleteComment = async (destinationIndex: number, commentIndex: number) => {
  const item = destinations.value[destinationIndex]
  if (!item || !item.commentList) return

  const comment = item.commentList[commentIndex]
  if (!comment) return

  if (!confirm('确定要删除这条评论吗？')) return

  try {
    const response = await deleteTravelStoryComment(item._id, comment._id)
    if (response.success && response.data) {
      // 更新本地数据
      const updatedItem = response.data
      destinations.value[destinationIndex] = updatedItem
    }
  } catch (error) {
    console.error('删除评论失败:', error)
    alert('删除评论失败，请重试')
  }
}

const nextImage = () => {
  if (activeDestination.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % previewImages.value.length
  }
}

const prevImage = () => {
  if (activeDestination.value) {
    currentImageIndex.value = (currentImageIndex.value - 1 + previewImages.value.length) % previewImages.value.length
  }
}

// Swiper 事件处理
const onSlideChange = (swiper: SwiperType) => {
  // Creative Effect 会自动处理样式
  activeSwiperSlideIndex.value = swiper.realIndex
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
  activeSwiperSlideIndex.value = swiper.realIndex
}

// 留言板数据 - 从API获取真实用户数据
const messages = ref<Array<{
  avatar: string
  author: string
  time: string
  text: string
  userId?: string
  userAvatar?: string
}>>([])
const loadingMessages = ref(true)

const newMessage = ref({
  text: ''
})

// 检查是否已登录
const isLoggedIn = computed(() => {
  return !!userStore.token && !!userStore.userInfo
})

// 用户头像（取用户名首字母）
const userAvatar = computed(() => {
  if (userStore.userInfo?.username) {
    return userStore.userInfo.username.charAt(0).toUpperCase()
  }
  return 'U'
})

const submitMessage = () => {
  if (!isLoggedIn.value) {
    return
  }

  if (newMessage.value.text.trim()) {
    const now = new Date()
    const timeStr = now.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' +
                    now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

    messages.value.unshift({
      avatar: userStore.userInfo?.username?.charAt(0).toUpperCase() || 'U',
      author: userStore.userInfo?.username || '用户',
      time: timeStr,
      text: newMessage.value.text.trim(),
      userId: userStore.userInfo?.id,
      userAvatar: userStore.userInfo?.avatar
    })

    // 清空表单
    newMessage.value = {
      text: ''
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: transparent;
  color: #ffffff;
  z-index: 2;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.destinations-section .container {
  overflow: hidden;
}

/* Hero Section */
.hero-section {
  width: 100%;
  height: 90vh;
  padding: 0;
  position: relative;
  z-index: 2;
  margin-top: 0;
  padding-top: 0;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 90vh;
  min-height: 500px;
  max-height: 800px;
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

/* 白天模式下的轮播图覆盖层 - 更亮的背景以确保文字可见 */
.light-theme .slide-overlay {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
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
  text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.3);
}

/* 白天模式下轮播图文字颜色调整 - 使用深色文字在白色背景下 */
.light-theme .hero-motto {
  color: #1f2937;
  text-shadow: 2px 2px 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6);
}

.light-theme .hero-category {
  color: #374151;
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.7);
}

.light-theme .read-post-btn {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #374151;
  color: #374151;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 白天模式下其他文字元素的颜色调整 */
.light-theme .section-title-white {
  color: #1f2937 !important;
}

.light-theme .blogger-intro-section {
  background-color: rgba(255, 255, 255, 0.95);
  color: #1f2937;
}

.light-theme .destinations-section {
  color: #1f2937;
}

.light-theme .gallery-section {
  color: #1f2937;
}

.light-theme .message-board-section {
  color: #1f2937;
}

.light-theme .tips-section {
  color: #1f2937;
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

/* 博主介绍模块 */
.blogger-intro-section {
  padding: 4rem 0;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.blogger-intro-card {
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg-color, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem;
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
}

/* 白天模式下的博主介绍卡片 - 更明显的背景 */
.light-theme .blogger-intro-card {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.blogger-intro-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.blogger-avatar-wrapper {
  flex-shrink: 0;
}

.blogger-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.blogger-info {
  flex: 1;
  min-width: 0;
}

.blogger-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-color, #ffffff);
}

/* 白天模式下的博客自我介绍文字 */
.light-theme .blogger-name {
  color: #1f2937;
}

.blogger-social {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color, #ffffff);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.blogger-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.detail-label {
  font-weight: 600;
  color: var(--text-color, #ffffff);
  font-size: 0.95rem;
  white-space: nowrap;
}

/* 白天模式下的详细信息标签 */
.light-theme .detail-label {
  color: #1f2937;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 0.9rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-color, #ffffff);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

/* 白天模式下的标签 */
.light-theme .tag {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
  border-color: rgba(0, 0, 0, 0.1);
}

.light-theme .tag:hover {
  background: rgba(0, 0, 0, 0.1);
}

.tag:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .blogger-intro-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 2rem;
  }
  
  .blogger-details {
    align-items: center;
  }
  
  .detail-item {
    justify-content: center;
  }
}

/* Tips Section */
.tips-section {
  padding: 4rem 0;
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
  color: var(--text-color, #ffffff);
  margin-bottom: 2rem;
  line-height: 1.4;
  transition: color 0.3s ease;
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
  color: var(--text-secondary, rgba(255, 255, 255, 0.9));
  margin-bottom: 2rem;
  transition: color 0.3s ease;
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

/* 白天模式下的阅读故事按钮 */
.light-theme .read-story-btn {
  background-color: rgba(31, 41, 55, 0.9);
  color: white;
  border-color: #374151;
}

.light-theme .read-story-btn:hover {
  background-color: #374151;
  border-color: #4b5563;
}

/* Destinations Section */
.destinations-section {
  padding: 4rem 0;
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
  color: var(--text-color, rgba(255, 255, 255, 0.9));
  transition: color 0.3s ease;
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

.destination-image.clickable {
  cursor: pointer;
}

.destination-image:not(.clickable) {
  cursor: default;
  pointer-events: none;
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
  transition: color 0.3s ease;
}

.destination-location {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.destination-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

/* 根据背景色自适应文字颜色 */
.destination-info {
  transition: color 0.3s ease;
}

/* 浅色背景时使用深色文字 */
.destination-info[style*="background-color: #e0f2fe"],
.destination-info[style*="background-color: #fee2e2"],
.destination-info[style*="background-color: #ffedd5"],
.destination-info[style*="background-color: #e5e7eb"],
.destination-info[style*="background-color: #fef3c7"] {
  color: #1e3a5f;
}

.destination-info[style*="background-color: #e0f2fe"] .destination-name,
.destination-info[style*="background-color: #fee2e2"] .destination-name,
.destination-info[style*="background-color: #ffedd5"] .destination-name,
.destination-info[style*="background-color: #e5e7eb"] .destination-name,
.destination-info[style*="background-color: #fef3c7"] .destination-name {
  color: #000;
}

.destination-info[style*="background-color: #e0f2fe"] .destination-location,
.destination-info[style*="background-color: #fee2e2"] .destination-location,
.destination-info[style*="background-color: #ffedd5"] .destination-location,
.destination-info[style*="background-color: #e5e7eb"] .destination-location,
.destination-info[style*="background-color: #fef3c7"] .destination-location {
  color: #666;
}

.destination-info[style*="background-color: #e0f2fe"] .destination-description,
.destination-info[style*="background-color: #fee2e2"] .destination-description,
.destination-info[style*="background-color: #ffedd5"] .destination-description,
.destination-info[style*="background-color: #e5e7eb"] .destination-description,
.destination-info[style*="background-color: #fef3c7"] .destination-description {
  color: #555;
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
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.destination-action-btn .heart-icon,
.destination-action-btn .comment-icon {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
}

.destination-action-btn.like-btn.liked {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
}

.destination-action-btn.like-btn.liked .heart-icon {
  fill: white;
  stroke: white;
}

.destination-action-btn.comment-btn {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.destination-action-btn.comment-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.destination-action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.destination-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.destination-action-btn .text {
  font-weight: 600;
}

/* 夜间模式下的文字颜色自适应 */
.dark-theme .destination-card {
  background-color: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .destination-info {
  color: #e5e7eb;
}

.dark-theme .destination-name {
  color: #f9fafb;
}

.dark-theme .destination-location {
  color: #9ca3af;
}

.dark-theme .destination-description {
  color: #d1d5db;
}

.dark-theme .destination-count {
  color: #9ca3af;
}

.dark-theme .destination-action-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #e5e7eb;
  transition: all 0.3s ease;
}

.dark-theme .destination-action-btn.like-btn.liked {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 157, 0.4);
}

.dark-theme .destination-action-btn.comment-btn {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.dark-theme .destination-action-btn.comment-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.3);
  color: #c7d2fe;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.dark-theme .destination-action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  color: #f3f4f6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

/* 日间模式下的文字颜色 - 根据背景色自适应 */
.light-theme .destination-card {
  background-color: white;
  border-color: rgba(0, 0, 0, 0.15);
}

.light-theme .destination-info {
  color: #1e3a5f;
}

/* 浅色背景上的文字使用深色，但更柔和 */
.light-theme .destination-info[style*="background-color: #e0f2fe"] {
  color: #0c4a6e;
}

.light-theme .destination-info[style*="background-color: #fee2e2"] {
  color: #7f1d1d;
}

.light-theme .destination-info[style*="background-color: #ffedd5"] {
  color: #7c2d12;
}

.light-theme .destination-info[style*="background-color: #e5e7eb"] {
  color: #1f2937;
}

.light-theme .destination-info[style*="background-color: #fef3c7"] {
  color: #78350f;
}

.light-theme .destination-name {
  color: #111827;
  font-weight: 600;
}

.light-theme .destination-location {
  color: #4b5563;
}

.light-theme .destination-description {
  color: #374151;
  line-height: 1.6;
}

.light-theme .destination-count {
  color: #6b7280;
}

/* 带背景的按钮文字颜色优化 */
.light-theme .destination-action-btn {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.light-theme .destination-action-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.1);
  color: #111827;
}

.light-theme .destination-action-btn.like-btn.liked {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
  color: white;
}

.light-theme .destination-action-btn.comment-btn {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
}

.light-theme .destination-action-btn.comment-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.15);
  color: #4338ca;
}

/* 新的评论弹窗样式 - 左侧图片预览，右侧评论 */
.comment-modal-overlay-new {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.comment-modal-new {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: var(--bg-color, #ffffff);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  color: var(--text-color, #000000);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-color, #000000);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.modal-content-wrapper {
  display: flex;
  height: 100%;
  max-height: 90vh;
}

/* 左侧图片预览区 */
.modal-image-section {
  flex: 1;
  min-width: 0;
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.image-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 5;
}

.image-nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.prev-image-btn {
  left: 1rem;
}

.next-image-btn {
  right: 1rem;
}

.image-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 5;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

/* 右侧评论区 */
.modal-comment-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.modal-comment-section::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.comment-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.comment-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color, #000000);
}

.light-theme .comment-title {
  color: #111827;
}

.dark-theme .comment-title {
  color: #f9fafb;
}

.comment-location {
  font-size: 0.9rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.6));
}

.light-theme .comment-location {
  color: #6b7280;
}

.dark-theme .comment-location {
  color: #9ca3af;
}

/* 点赞区域 */
.like-section {
  margin-bottom: 1.5rem;
}

.like-btn-modal {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 24px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-color, #000000);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.like-btn-modal.liked {
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 157, 0.4);
}

.like-btn-modal:hover:not(.liked) {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.like-btn-modal.liked:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.5);
}

.heart-icon-modal {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.like-btn-modal.liked .heart-icon-modal {
  fill: white;
  stroke: white;
  animation: heartBeat 0.5s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.like-count {
  font-weight: 700;
}

/* 评论列表 */
.comments-list-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.comments-header-row {
  margin-bottom: 1rem;
}

.comments-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color, #000000);
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 200px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.comments-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.comments-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.03));
  border-radius: 12px;
  transition: all 0.3s ease;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
  width: 100%;
}

.light-theme .comment-item {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.light-theme .comment-item:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.dark-theme .comment-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark-theme .comment-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.comment-item:hover {
  background: var(--bg-secondary, rgba(0, 0, 0, 0.05));
  transform: translateX(4px);
  max-width: 100%;
  overflow: hidden;
}

.comment-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  font-size: 0.9rem;
  overflow: hidden;
}

.comment-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.comment-user-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.comment-content-wrapper {
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 60px);
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.comment-user-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: var(--text-color, #000000);
}

.light-theme .comment-user-name {
  color: #111827;
}

.dark-theme .comment-user-name {
  color: #f3f4f6;
}

.comment-text-content {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.8));
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.light-theme .comment-text-content {
  color: #374151;
}

.dark-theme .comment-text-content {
  color: #d1d5db;
}

.comment-time {
  font-size: 0.8rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.5));
}

.light-theme .comment-time {
  color: #9ca3af;
}

.dark-theme .comment-time {
  color: #6b7280;
}

/* 评论操作按钮 */
.comment-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
  align-items: center;
}

.comment-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  color: var(--text-secondary, rgba(0, 0, 0, 0.6));
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.comment-action-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.comment-action-btn.liked {
  background: rgba(255, 107, 157, 0.15);
  color: #ff6b9d;
}

.comment-action-btn.liked svg {
  fill: #ff6b9d;
  stroke: #ff6b9d;
}

.comment-action-btn.reply-btn {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.comment-action-btn.reply-btn:hover {
  background: rgba(99, 102, 241, 0.2);
}

.comment-action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.comment-action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.comment-action-btn svg {
  width: 14px;
  height: 14px;
}

.light-theme .comment-action-btn {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.6);
}

.light-theme .comment-action-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.dark-theme .comment-action-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.dark-theme .comment-action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 回复输入框 */
.reply-input-wrapper {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.03));
  border-radius: 8px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.reply-textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.15));
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #000000);
  font-size: 0.85rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.reply-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.reply-submit-btn,
.reply-cancel-btn {
  padding: 0.4rem 1rem;
  border-radius: 16px;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reply-submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.reply-submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.reply-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reply-cancel-btn {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary, rgba(0, 0, 0, 0.6));
}

.reply-cancel-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 回复列表 */
.replies-list {
  margin-top: 0.75rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border-color, rgba(0, 0, 0, 0.1));
}

.reply-item {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
  padding: 0.6rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
  border-radius: 8px;
}

.reply-user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-user-name {
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  color: var(--text-color, #000000);
}

.reply-text {
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 0.3rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.8));
}

.reply-time {
  font-size: 0.75rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.5));
}

.no-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.4));
  text-align: center;
}

.no-comments svg {
  margin-bottom: 1rem;
}

.no-comments p {
  font-size: 0.95rem;
}

/* 评论输入区 */
.comment-input-section {
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding-top: 1.5rem;
}

.login-prompt-modal {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary, rgba(0, 0, 0, 0.03));
  border-radius: 12px;
}

.login-prompt-modal p {
  margin-bottom: 0.75rem;
  color: var(--text-secondary, rgba(0, 0, 0, 0.7));
  font-size: 0.9rem;
}

.login-link-modal {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.login-link-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.comment-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment-textarea-modal {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.15));
  background: var(--bg-secondary, rgba(0, 0, 0, 0.03));
  color: var(--text-color, #000000);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: all 0.3s ease;
}

.comment-textarea-modal:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: var(--bg-color, #ffffff);
}

.comment-textarea-modal::placeholder {
  color: var(--text-secondary, rgba(0, 0, 0, 0.4));
}

.submit-comment-btn {
  align-self: flex-end;
  padding: 0.625rem 1.5rem;
  border-radius: 20px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.submit-comment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-comment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content-wrapper {
    flex-direction: column;
  }
  
  .modal-image-section {
    height: 300px;
  }
  
  .preview-image {
    min-height: 300px;
  }
  
  .modal-comment-section {
    max-height: calc(90vh - 300px);
  }
}

/* 旧评论弹窗样式（保留以防需要） */
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
  color: var(--text-color, #ffffff);
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.3;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  transition: color 0.3s ease;
}

/* 白天模式下的博客标题 */
.light-theme .blog-main-title {
  color: #1f2937;
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

/* 白天模式下的文章分类 */
.light-theme .post-category {
  color: rgba(0, 0, 0, 0.7);
}

.post-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

/* 白天模式下的文章标题 */
.light-theme .post-title {
  color: #1f2937;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 白天模式下的文章元信息 */
.light-theme .post-meta {
  color: rgba(0, 0, 0, 0.6);
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
  padding: 4rem 0;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color, #ffffff);
  text-align: center;
  margin-bottom: 3rem;
  transition: color 0.3s ease;
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

/* 白天模式下的画廊覆盖层 */
.light-theme .gallery-overlay {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3));
  color: #1f2937;
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
  padding: 5rem 0;
  position: relative;
  z-index: 1;
  background-color: transparent;
}

.message-board-title {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color, #ffffff);
  transition: color 0.3s ease;
}

.message-board-content {
  max-width: 800px;
  margin: 0 auto;
}

/* 留言列表 */
.messages-list {
  margin-bottom: 2.5rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.messages-list::-webkit-scrollbar {
  width: 6px;
}

.messages-list::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.messages-list::-webkit-scrollbar-thumb {
  background: var(--border-color, rgba(255, 255, 255, 0.2));
  border-radius: 3px;
  transition: background 0.3s ease;
}

.messages-list::-webkit-scrollbar-thumb:hover {
  background: var(--border-color, rgba(255, 255, 255, 0.3));
}

.message-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border-radius: 16px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  transition: all 0.3s ease;
}

.message-item:hover {
  border-color: var(--border-color, rgba(255, 255, 255, 0.2));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  flex-shrink: 0;
  color: white;
  overflow: hidden;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.message-avatar span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-messages {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
}

.loading-messages p {
  margin: 0;
  font-size: 0.9rem;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.message-author {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color, #ffffff);
}

.message-time {
  font-size: 0.8rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
  white-space: nowrap;
}

.message-text {
  color: var(--text-secondary, rgba(255, 255, 255, 0.9));
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
  word-wrap: break-word;
}

.empty-messages {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
  font-size: 0.95rem;
}

/* 评论表单区域 */
.message-form-wrapper {
  margin-top: 2rem;
}

.login-prompt {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.login-prompt p {
  color: var(--text-secondary, rgba(255, 255, 255, 0.8));
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.login-link {
  display: inline-block;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.login-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.message-form {
  background: var(--bg-secondary, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.message-form:hover {
  border-color: var(--border-color, rgba(255, 255, 255, 0.15));
}

.form-header {
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-color, #ffffff);
}

.message-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
  border-radius: 12px;
  background: var(--bg-color, rgba(255, 255, 255, 0.05));
  color: var(--text-color, #ffffff);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.message-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: var(--bg-color, rgba(255, 255, 255, 0.08));
}

.message-textarea::placeholder {
  color: var(--text-secondary, rgba(255, 255, 255, 0.5));
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.message-submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.message-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.message-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.message-submit-btn svg {
  width: 16px;
  height: 16px;
}

/* 主题适配 */
.light-theme .message-board-section {
  background-color: transparent;
}

.light-theme .message-board-title {
  color: #000000;
}

.light-theme .message-item {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.light-theme .message-item:hover {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.light-theme .message-author {
  color: #000000;
}

.light-theme .message-time {
  color: rgba(0, 0, 0, 0.6);
}

.light-theme .message-text {
  color: rgba(0, 0, 0, 0.8);
}

.light-theme .empty-messages {
  color: rgba(0, 0, 0, 0.5);
}

.light-theme .login-prompt {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.light-theme .login-prompt p {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .message-form {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.1);
}

.light-theme .message-form:hover {
  border-color: rgba(0, 0, 0, 0.15);
}

.light-theme .user-name {
  color: #000000;
}

.light-theme .message-textarea {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.15);
  color: #000000;
}

.light-theme .message-textarea:focus {
  background: rgba(0, 0, 0, 0.05);
  border-color: #667eea;
}

.light-theme .message-textarea::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.light-theme .messages-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

.light-theme .messages-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark-theme .message-board-section {
  background-color: transparent;
}

.dark-theme .message-board-title {
  color: #ffffff;
}

.dark-theme .message-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .message-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark-theme .message-author {
  color: #ffffff;
}

.dark-theme .message-time {
  color: rgba(255, 255, 255, 0.6);
}

.dark-theme .message-text {
  color: rgba(255, 255, 255, 0.9);
}

.dark-theme .empty-messages {
  color: rgba(255, 255, 255, 0.6);
}

.dark-theme .login-prompt {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .login-prompt p {
  color: rgba(255, 255, 255, 0.8);
}

.dark-theme .message-form {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-theme .message-form:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.dark-theme .user-name {
  color: #ffffff;
}

.dark-theme .message-textarea {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.dark-theme .message-textarea:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #667eea;
}

.dark-theme .message-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
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
