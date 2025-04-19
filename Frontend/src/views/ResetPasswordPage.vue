<template>
  <div class="reset-password-container">
    <div class="reset-password-form-wrapper">
      <div class="header-container">
        <router-link to="/login" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
        <h1 class="form-title">Reset Password</h1>
      </div>
      
      <div class="reset-password-form">
        <p class="subtitle">Enter your new password below</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="input-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                placeholder="Enter your new password"
                required
              >
              <span class="input-icon toggle-password" @click="togglePasswordVisibility">
                <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 3L21 21" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="Confirm your new password"
                required
              >
              <span class="input-icon toggle-password" @click="toggleConfirmPasswordVisibility">
                <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 3L21 21" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
              </svg>
              Submitting...
            </span>
            <span v-else>Reset Password</span>
          </button>
        </form>

        <p class="login-text">
          Remember your password? <router-link to="/login" class="login-link">Log In</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

// Reactive variables
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);
const router = useRouter();

// Toggle password visibility
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// Toggle confirm password visibility
function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
}

// Handle form submission
async function handleSubmit() {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validate password
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long';
    return;
  }
  
  // Check if passwords match
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  
  // Show loading state
  isSubmitting.value = true;
  
  try {
    // Get the hash fragment from the URL which contains the access token
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (!accessToken) {
      throw new Error('No access token found. Please request a new password reset link.');
    }
    
    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password.value
    });
    
    if (error) {
      throw error;
    }
    
    // Show success message
    successMessage.value = 'Your password has been successfully reset.';
    
    // Clear form
    password.value = '';
    confirmPassword.value = '';
    
    // Redirect to login page after 3 seconds
    setTimeout(() => {
      router.push('/login');
    }, 3000);
    
  } catch (error) {
    console.error('Error resetting password:', error.message);
    errorMessage.value = error.message || 'An error occurred. Please try again later.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
}

/* Container */
.reset-password-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #ffffff;
}

.reset-password-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

/* Header Container */
.header-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

/* Back Button */
.back-button {
  position: relative;
  display: flex;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: fit-content;
  margin-right: 1rem;
}

.back-button:hover {
  transform: translateX(-5px);
}

/* Form Title */
.form-title {
  color: #dd3859;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

/* Form */
.reset-password-form {
  margin-top: 0;
  width: 100%;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem;
  padding-right: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #dd3859;
}

.input-icon {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
}

.toggle-password:hover {
  color: #dd3859;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: #fed7d7;
  border-radius: 4px;
}

.success-message {
  color: #38a169;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: #c6f6d5;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #dd3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  background-color: #c62c4c;
}

.submit-btn:disabled {
  background-color: #f0a1b1;
  cursor: not-allowed;
}

.spinner {
  animation: rotate 2s linear infinite;
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
}

.spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.login-text {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #666;
}

.login-link {
  color: #dd3859;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #c62c4c;
  text-decoration: underline;
}
</style>
