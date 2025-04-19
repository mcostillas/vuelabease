<template>
  <transition name="fade">
    <div class="loading-overlay" v-if="isLoading">
      <div class="text-animation-container">
        <div class="text-animation">
          <span>L</span>
          <span>a</span>
          <span>b</span>
          <span>E</span>
          <span>a</span>
          <span>s</span>
          <span>e</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.text-animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-animation {
  display: flex;
  font-size: 36px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
}

.text-animation span {
  color: #DD3859;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.5s infinite;
}

.text-animation span:nth-child(2) {
  animation-delay: 0.1s;
}

.text-animation span:nth-child(3) {
  animation-delay: 0.2s;
}

.text-animation span:nth-child(4) {
  animation-delay: 0.3s;
}

.text-animation span:nth-child(5) {
  animation-delay: 0.4s;
}

.text-animation span:nth-child(6) {
  animation-delay: 0.5s;
}

.text-animation span:nth-child(7) {
  animation-delay: 0.6s;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
