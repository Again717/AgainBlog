<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="welcome-title">{{ t('welcome.title') }}</h2>
      </div>
      <div class="modal-body">
        <p class="welcome-text">
          {{ t('welcome.text1') }}
        </p>
        <p class="welcome-text">
          {{ t('welcome.text2') }}
        </p>
      </div>
      <div class="modal-footer">
        <button class="enter-btn" @click="handleClose">{{ t('welcome.enter') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../utils/i18n'

const { t } = useI18n()

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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
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

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a5f;
  margin: 0;
  line-height: 1.3;
}

.modal-body {
  margin-bottom: 2.5rem;
}

.welcome-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

.modal-footer {
  text-align: center;
}

.enter-btn {
  background: linear-gradient(135deg, #1e3a5f 0%, #3d6fa8 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(30, 58, 95, 0.3);
}

.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.4);
}

.enter-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 2rem 1.5rem;
    width: 95%;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-text {
    font-size: 1rem;
  }

  .enter-btn {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
}
</style>

