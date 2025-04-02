<template>
  <DashboardLayout>
    <AdminHeader pageTitle="My Account" />
    <div class="account-page">
      <div class="back-button-container">
        <router-link to="/admin/dashboard" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </div>
      <div class="profile-section">
        <div class="profile-header">
          <div class="profile-avatar">
            <img v-if="userProfile.profileImage" :src="userProfile.profileImage" alt="Profile Image">
            <div v-else class="avatar-placeholder">
              {{ userInitials }}
            </div>
            <input 
              type="file" 
              ref="profileImageInput" 
              @change="handleProfileImageChange" 
              accept="image/*" 
              class="hidden-file-input"
            >
          </div>
          <div class="profile-info">
            <h2>{{ userProfile.firstName }} {{ userProfile.lastName }}</h2>
            <p class="role-badge">Admin</p>
          </div>
        </div>

        <div class="profile-details">
          <div class="personal-info-section">
            <div class="section-header">
              <h2>Personal Information</h2>
              <button 
                type="button" 
                class="edit-button" 
                @click="toggleEditMode('personal')" 
                v-if="!isEditingPersonal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Edit</span>
              </button>
              <div v-else class="edit-actions">
                <button type="button" class="cancel-edit-button" @click="cancelEdit('personal')">
                  <span>Cancel</span>
                </button>
              </div>
            </div>
            <form @submit.prevent="saveChanges">
              <div class="form-section">
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      v-model="userProfile.firstName" 
                      class="form-control"
                      placeholder="First Name"
                      :disabled="!isEditingPersonal"
                    >
                  </div>
                  <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      v-model="userProfile.lastName" 
                      class="form-control"
                      placeholder="Last Name"
                      :disabled="!isEditingPersonal"
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="userProfile.email" 
                    class="form-control"
                    placeholder="Email Address"
                    :disabled="!isEditingPersonal"
                  >
                </div>
                <div class="form-group">
                  <label for="department">Department</label>
                  <input 
                    type="text" 
                    id="department" 
                    v-model="userProfile.department" 
                    class="form-control"
                    placeholder="Department"
                    :disabled="!isEditingPersonal"
                  >
                </div>
              </div>

              <div class="password-section">
                <div class="section-header">
                  <h2>Change Password</h2>
                  <button 
                    type="button" 
                    class="edit-button" 
                    @click="toggleEditMode('password')" 
                    v-if="!isEditingPassword"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <div v-else class="edit-actions">
                    <button type="button" class="cancel-edit-button" @click="cancelEdit('password')">
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
                <div class="form-section">
                  <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input 
                      type="password" 
                      id="currentPassword" 
                      v-model="passwordData.currentPassword" 
                      class="form-control"
                      placeholder="Enter current password"
                      :disabled="!isEditingPassword"
                    >
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="newPassword">New Password</label>
                      <input 
                        type="password" 
                        id="newPassword" 
                        v-model="passwordData.newPassword" 
                        class="form-control"
                        placeholder="Enter new password"
                        :disabled="!isEditingPassword"
                      >
                    </div>
                    <div class="form-group">
                      <label for="confirmPassword">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirmPassword" 
                        v-model="passwordData.confirmPassword" 
                        class="form-control"
                        placeholder="Confirm new password"
                        :disabled="!isEditingPassword"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-actions" v-if="isEditingPersonal || isEditingPassword">
                <button type="button" class="btn btn-secondary" @click="resetForm">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Modal 
      :show="showSuccessModal" 
      @close="closeModal"
      title="Profile Updated"
      :show-footer="false"
      :close-on-overlay-click="false"
    >
      <div class="success-message">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-icon">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="checkmark" d="M22 4L12 14.01L9 11.01" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>{{ successMessage }}</p>
        <p>Thank you for using LabEase.</p>
      </div>
    </Modal>
    
    <!-- Image Preview Modal -->
    <Modal 
      :show="showImagePreviewModal" 
      @close="cancelImageChange"
      title="Profile Image Preview"
      type="preview"
    >
      <div class="image-preview-container">
        <img :src="previewImage" alt="Profile Preview" class="preview-image">
        <div class="preview-actions">
          <button type="button" class="cancel-button" @click="cancelImageChange">Cancel</button>
          <button type="button" class="confirm-button" @click="confirmImageChange">Confirm</button>
        </div>
      </div>
    </Modal>
    
    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteImageConfirmation" 
      @close="cancelDeleteImage"
      title="Delete Profile Image"
      @confirm="deleteProfileImage"
    >
      <p>Are you sure you want to delete your profile image?</p>
    </Modal>

    <!-- Profile Edit Options Modal -->
    <ProfileEditModal
      :show="showProfileEditModal"
      @close="showProfileEditModal = false"
      @update="handleUpdateProfile"
      @remove="handleRemoveAccount"
    />
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import Modal from '@/components/ui/Modal.vue'
import ProfileEditModal from '@/components/ui/ProfileEditModal.vue'

export default {
  name: 'AdminAccountPage',
  components: {
    DashboardLayout,
    AdminHeader,
    Modal,
    ProfileEditModal
  },
  data() {
    return {
      userProfile: {
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        profileImage: null
      },
      originalProfile: null,
      isEditingPersonal: false,
      isEditingPassword: false,
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showSuccessModal: false,
      successMessage: '',
      showImagePreviewModal: false,
      tempProfileImage: null,
      showDeleteImageConfirmation: false,
      showProfileEditModal: false
    }
  },
  computed: {
    userInitials() {
      const first = this.userProfile.firstName ? this.userProfile.firstName.charAt(0).toUpperCase() : '';
      const last = this.userProfile.lastName ? this.userProfile.lastName.charAt(0).toUpperCase() : '';
      return first + last;
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.profileImageInput.click();
    },
    handleProfileImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        this.showImagePreviewModal = true;
      };
      reader.readAsDataURL(file);
    },
    confirmImageChange() {
      // Set the profile image to the preview image
      this.userProfile.profileImage = this.previewImage;
      this.showImagePreviewModal = false;
      
      // Save changes immediately
      this.saveProfileImage();
    },
    cancelImageChange() {
      // Clear the selected file and preview
      this.selectedImageFile = null;
      this.previewImage = null;
      this.showImagePreviewModal = false;
      this.$refs.profileImageInput.value = '';
    },
    saveProfileImage() {
      try {
        // Get current user data from localStorage
        const userData = localStorage.getItem('labease_user_data');
        let parsedData = userData ? JSON.parse(userData) : {};
        
        // Update profile image
        parsedData.profileImage = this.userProfile.profileImage;
        
        // Save back to localStorage
        localStorage.setItem('labease_user_data', JSON.stringify(parsedData));
        
        // Show success message
        this.successMessage = 'Profile image updated successfully';
        
        // Show success modal
        this.showSuccessModal = true;
      } catch (error) {
        console.error('Error saving profile image:', error);
        this.errorMessage = 'Failed to save profile image';
      }
    },
    toggleEditMode(section) {
      if (section === 'personal') {
        this.isEditingPersonal = true;
        // Store original values for cancellation
        this.originalProfile = { ...this.userProfile };
      } else if (section === 'password') {
        this.isEditingPassword = true;
        // Store original values for cancellation
        this.originalPasswordData = { ...this.passwordData };
      }
    },
    cancelEdit(section) {
      if (section === 'personal') {
        this.isEditingPersonal = false;
        // Restore original values
        if (this.originalProfile) {
          this.userProfile = { ...this.originalProfile };
        }
      } else if (section === 'password') {
        this.isEditingPassword = false;
        // Restore original values
        if (this.originalPasswordData) {
          this.passwordData = { ...this.originalPasswordData };
        } else {
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        }
      }
    },
    loadUserProfile() {
      // In a real app, this would fetch data from an API
      // For now, we'll load from localStorage
      try {
        const userData = localStorage.getItem('labease_user_data');
        if (userData) {
          const parsedData = JSON.parse(userData);
          this.userProfile.firstName = parsedData.firstName || '';
          this.userProfile.lastName = parsedData.lastName || '';
          this.userProfile.email = parsedData.email || '';
          this.userProfile.department = parsedData.department || '';
          this.userProfile.profileImage = parsedData.profileImage || null;
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Failed to load user profile';
      }
    },
    saveChanges() {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      // Validate password change if attempted
      if (this.isEditingPassword && (this.passwordData.newPassword || this.passwordData.confirmPassword)) {
        if (!this.passwordData.currentPassword) {
          this.errorMessage = 'Current password is required';
          this.isLoading = false;
          return;
        }
        
        if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
          this.errorMessage = 'New passwords do not match';
          this.isLoading = false;
          return;
        }
        
        // In a real app, this would verify the current password and update it
        console.log('Password would be updated in a real app');
      }
      
      // In a real app, this would save to an API
      // For now, we'll save to localStorage
      try {
        const userData = {
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          email: this.userProfile.email,
          department: this.userProfile.department,
          profileImage: this.userProfile.profileImage,
        };
        
        localStorage.setItem('labease_user_data', JSON.stringify(userData));
        
        // Update the user's name in the auth token (this is just for demo purposes)
        try {
          const token = localStorage.getItem('labease_auth_token');
          if (token) {
            const tokenData = JSON.parse(atob(token));
            tokenData.name = `${this.userProfile.firstName} ${this.userProfile.lastName}`;
            localStorage.setItem('labease_auth_token', btoa(JSON.stringify(tokenData)));
          }
        } catch (e) {
          console.error('Error updating token:', e);
        }
        
        // Set success message and show modal
        this.successMessage = 'Your profile has been updated successfully!';
        
        // Show success modal
        this.showSuccessModal = true;
        
        // Reset editing modes
        this.isEditingPersonal = false;
        this.isEditingPassword = false;
        
        // Reset password fields
        this.passwordData.currentPassword = '';
        this.passwordData.newPassword = '';
        this.passwordData.confirmPassword = '';
      } catch (error) {
        console.error('Error saving profile:', error);
        this.errorMessage = 'Failed to save profile';
      } finally {
        this.isLoading = false;
      }
    },
    resetForm() {
      // Reset the form to the original values
      this.loadUserProfile();
      
      // Clear password fields
      this.passwordData.currentPassword = '';
      this.passwordData.newPassword = '';
      this.passwordData.confirmPassword = '';
      
      // Clear messages
      this.errorMessage = '';
      this.successMessage = '';
      
      // Reset editing modes
      this.isEditingPersonal = false;
      this.isEditingPassword = false;
    },
    closeModal() {
      this.showSuccessModal = false;
    },
    confirmDeleteImage() {
      this.showDeleteImageConfirmation = true;
    },
    
    cancelDeleteImage() {
      this.showDeleteImageConfirmation = false;
    },
    
    deleteProfileImage() {
      // Remove profile image
      this.userProfile.profileImage = null;
      
      // Save changes
      try {
        // Get current user data from localStorage
        const userData = localStorage.getItem('labease_user_data');
        let parsedData = userData ? JSON.parse(userData) : {};
        
        // Update profile image to null
        parsedData.profileImage = null;
        
        // Save back to localStorage
        localStorage.setItem('labease_user_data', JSON.stringify(parsedData));
        
        // Close modal
        this.showDeleteImageConfirmation = false;
        
        // Show success message
        this.successMessage = 'Profile image removed successfully';
        this.showSuccessModal = true;
      } catch (error) {
        console.error('Error removing profile image:', error);
        this.errorMessage = 'Failed to remove profile image';
      }
    },
    handleUpdateProfile() {
      this.showProfileEditModal = false;
      this.toggleEditMode('personal');
    },
    
    handleRemoveAccount() {
      // Implement account removal logic
      this.showProfileEditModal = false;
      
      // For demonstration purposes, show a success message
      this.successMessage = 'Your account has been successfully deleted.';
      this.showSuccessModal = true;
      
      // In a real implementation, you would:
      // 1. Call an API to delete the account
      // 2. Clear local storage/cookies
      // 3. Redirect to login page
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.$router.push('/login');
      }, 2000);
    },
  },
  mounted() {
    this.loadUserProfile();
  }
}
</script>

<style scoped>
.account-page {
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.back-button-container {
  margin-bottom: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  color: #dd3859;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: translateX(-5px);
}

.back-button svg {
  margin-left: 0.5rem;
}

.profile-section {
  padding: 0;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(221, 56, 89, 0.1);
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f5f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: #64748b;
  background-color: #e2e8f0;
}

.avatar-edit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.avatar-edit-overlay:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.avatar-delete-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background-color: rgba(221, 56, 89, 0.8);
  border-radius: 0 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: -2px 2px 6px rgba(0, 0, 0, 0.1);
}

.avatar-delete-overlay:hover {
  background-color: rgba(221, 56, 89, 1);
  transform: scale(1.05);
}

.avatar-delete-overlay svg {
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2));
}

.profile-info h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #333;
}

.role-badge {
  display: inline-block;
  background-color: #DD3859;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(221, 56, 89, 0.2);
}

.personal-info-section, .password-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #DD3859;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: rgba(221, 56, 89, 0.05);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.cancel-edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.cancel-edit-button:hover {
  background-color: #f5f5f5;
}

.form-section {
  background-color: white;
  border-radius: 12px;
  border: 1px solid #DD3859;
  padding: 24px;
  margin-bottom: 24px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.2s;
  background-color: white;
}

.form-control:focus {
  outline: none;
  border-color: #DD3859;
  box-shadow: 0 0 0 3px rgba(221, 56, 89, 0.1);
}

.form-control:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.8;
}

.form-text {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 6px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #DD3859;
  color: white;
}

.btn-primary:hover {
  background-color: #c82c4f;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #555;
}

.btn-secondary:hover {
  background-color: #e5e5e5;
}

.delete-confirmation-container {
  padding: 24px;
  text-align: center;
}

.delete-confirmation-container p {
  margin-bottom: 24px;
  font-size: 16px;
  color: #334155;
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.delete-button {
  padding: 10px 24px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(221, 56, 89, 0.3);
}

.delete-button:hover {
  background-color: #c62a48;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(221, 56, 89, 0.4);
}

.delete-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(221, 56, 89, 0.3);
}

.cancel-button {
  padding: 10px 24px;
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancel-button:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.cancel-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.delete-icon {
  margin-bottom: 24px;
  text-align: center;
}

.delete-icon svg {
  width: 64px;
  height: 64px;
}

.success-message {
  text-align: center;
  padding: 1rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  animation: scaleIn 0.5s ease-in-out;
}

.checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 1s ease-in-out forwards;
  animation-delay: 0.5s;
}

@keyframes dash {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-message p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
  animation: fadeIn 0.5s ease-in-out forwards;
  opacity: 0;
}

.success-message p:nth-child(2) {
  animation-delay: 0.3s;
}

.success-message p:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-edit-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-info {
  position: relative;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
