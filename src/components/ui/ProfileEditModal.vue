<template>
  <Modal 
    :show="show" 
    @close="$emit('close')"
    title="Profile Options"
    :showFooter="false"
  >
    <div class="profile-edit-options">
      <button class="option-button update" @click="$emit('update')">
        <div class="option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="option-content">
          <h3>Update Profile</h3>
          <p>Edit your personal information and password</p>
        </div>
      </button>
      
      <button class="option-button remove" @click="confirmDelete">
        <div class="option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="option-content">
          <h3>Remove Account</h3>
          <p>Permanently delete your account and all data</p>
        </div>
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteConfirmation" 
      @close="cancelDelete"
      title="Confirm Account Removal"
      @confirm="$emit('remove')"
      confirmText="Delete Account"
      cancelText="Cancel"
    >
      <div class="delete-confirmation">
        <p>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.</p>
        <div class="warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 17H12.01" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.93 2.93L2.93 10.93C1.68 12.18 1.68 14.25 2.93 15.5L10.93 23.5C12.18 24.75 14.25 24.75 15.5 23.5L23.5 15.5C24.75 14.25 24.75 12.18 23.5 10.93L15.5 2.93C14.25 1.68 12.18 1.68 10.93 2.93Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import Modal from '@/components/ui/Modal.vue'

export default {
  name: 'ProfileEditModal',
  components: {
    Modal
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showDeleteConfirmation: false
    }
  },
  methods: {
    confirmDelete() {
      this.showDeleteConfirmation = true
    },
    cancelDelete() {
      this.showDeleteConfirmation = false
    }
  },
  emits: ['close', 'update', 'remove']
}
</script>

<style scoped>
.profile-edit-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid #eee;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-button.update {
  color: #DD3859;
}

.option-button.update:hover {
  border-color: #DD3859;
}

.option-button.remove {
  color: #666;
}

.option-button.remove:hover {
  border-color: #666;
  color: #DD3859;
}

.option-icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  margin: 0 0 0.25rem 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}

.option-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.delete-confirmation {
  text-align: center;
}

.warning-icon {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}
</style>
