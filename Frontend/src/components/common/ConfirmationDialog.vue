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
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="warning-message">{{ message }}</p>
          <p class="warning-note">This action will log you out of your account.</p>
        </div>
        <div class="confirmation-actions center">
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
  margin: 1rem 0;
}

.confirmation-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

.warning-message {
  font-weight: 500;
  color: #333;
}

.warning-note {
  color: #666;
  font-size: 14px;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.confirmation-actions.center {
  justify-content: center;
}

.cancel-button, .confirm-button {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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
