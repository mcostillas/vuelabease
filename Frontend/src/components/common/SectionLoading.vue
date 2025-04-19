<template>
  <transition name="fade">
    <div class="section-loading" v-if="loading" :style="{ height: height }">
      <div class="spinner-container">
        <div class="spinner"></div>
        <div v-if="showText" class="loading-text">{{ text }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SectionLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '200px'
    },
    text: {
      type: String,
      default: 'Loading...'
    },
    showText: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.section-loading {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(221, 56, 89, 0.2);
  border-radius: 50%;
  border-top-color: #DD3859;
  animation: spin 1s ease-in-out infinite;
}

.loading-text {
  font-size: 14px;
  color: #DD3859;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
