<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form-wrapper">
      <router-link to="/login" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
      
      <div class="forgot-password-form">
        <h1>Forgot Password</h1>
        <p class="subtitle">Enter your email to reset your password</p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="Enter your email address"
              required
            >
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

<script>
export default {
  name: 'ForgotPasswordPage',
  data() {
    return {
      email: '',
      errorMessage: '',
      successMessage: '',
      isSubmitting: false
    }
  },
  methods: {
    handleSubmit() {
      // Clear previous messages
      this.errorMessage = ''
      this.successMessage = ''
      
      // Basic validation
      if (!this.email) {
        this.errorMessage = 'Please enter your email address'
        return
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.errorMessage = 'Please enter a valid email address'
        return
      }
      
      // Show loading state
      this.isSubmitting = true
      
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real application, this would send a request to the server
        // For now, we'll simulate a successful response
        
        // Create a notification for admin (in a real app, this would be server-side)
        const notification = {
          id: Date.now(),
          type: 'password_reset',
          email: this.email,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }
        
        // Store the notification in localStorage (simulating database)
        const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]')
        notifications.push(notification)
        localStorage.setItem('admin_notifications', JSON.stringify(notifications))
        
        // Reset form and show success message
        this.isSubmitting = false
        this.successMessage = 'Password reset request submitted. An administrator will contact you shortly.'
        this.email = ''
      }, 1500) // Simulate network delay
    }
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
.forgot-password-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #ffffff;
}

.forgot-password-form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

/* Back Button */
.back-button {
  position: relative;
  display: block;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: fit-content;
}

.back-button:hover {
  transform: translateX(-5px);
}

/* Form */
.forgot-password-form {
  margin-top: 0;
  width: 100%;
}

.forgot-password-form h1 {
  color: #dd3859;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
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

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #dd3859;
}

/* Submit Button */
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
  transition: all 0.3s ease;
  margin-top: 1rem;
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: #c62a48;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(221, 56, 89, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background-color: #e0819a;
  cursor: not-allowed;
}

/* Messages */
.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: rgba(229, 62, 62, 0.1);
  border-radius: 4px;
}

.success-message {
  color: #38a169;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  background-color: rgba(56, 161, 105, 0.1);
  border-radius: 4px;
}

/* Login Link */
.login-text {
  text-align: center;
  margin-top: 2rem;
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
  color: #c62a48;
  text-decoration: underline;
}

/* Loading Spinner */
.spinner {
  animation: rotate 2s linear infinite;
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.path {
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

/* Responsive Design */
@media (max-width: 480px) {
  .forgot-password-form-wrapper {
    padding: 1.5rem;
  }
  
  .forgot-password-form h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
