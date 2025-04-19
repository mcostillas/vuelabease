<template>
  <transition name="fade">
    <div v-if="show" class="confirmation-overlay">
      <div class="confirmation-dialog">
        <div class="confirmation-header">
          <h3>{{ title }}</h3>
          <button class="close-button" @click="cancel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="confirmation-content">
          <div class="icon-container">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12H9" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>{{ message }}</p>
        </div>
        <div class="confirmation-actions">
          <button class="cancel-button" @click="cancel">{{ cancelText }}</button>
          <button class="confirm-button" @click="confirm">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmation'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.confirmation-dialog {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modal-appear 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.confirmation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.confirmation-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #DD3859;
  font-family: 'Poppins', sans-serif;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #DD3859;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 50%;
}

.close-button:hover {
  opacity: 0.7;
}

.confirmation-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.confirmation-content p {
  margin: 0;
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  text-align: center;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.cancel-button, .confirm-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #eee;
}

.confirm-button {
  background-color: #DD3859;
  color: white;
  border: none;
}

.confirm-button:hover {
  background-color: #c8314f;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}



@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
