<template>
  <div class="reset-password-container">
    <div class="reset-password-form-wrapper">
      <div class="header-container">
        <router-link to="/login" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </router-link>
        <h1 class="form-title">Set New Password</h1>
      </div>

      <div class="reset-password-form">
        <p class="subtitle">Enter your new password below</p>

        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Enter your new password"
                required
              />
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
            <span v-else>Set New Password</span>
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
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useRoute } from 'vue-router';

// Reactive variables
const password = ref('');
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();

// Retrieve email from query parameters
onMounted(() => {
  email.value = route.query.email || '';
  if (!email.value) {
    errorMessage.value = 'Invalid or missing email. Please request a new password reset link.';
  }
});

// Handle password reset form submission
async function handleResetPassword() {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';

  // Basic validation
  if (!password.value) {
    errorMessage.value = 'Please enter your new password';
    return;
  }

  if (!email.value) {
    errorMessage.value = 'Invalid or missing email. Please request a new password reset link.';
    return;
  }

  // Show loading state
  isSubmitting.value = true;

  try {
    // Update the password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (authError) {
      if (authError.message.includes('New password should be different from the old password')) {
        errorMessage.value = 'Your new password must be different from your current password.';
        return;
      }
      throw authError;
    }

    // Update the password in the `user` table based on the email
    const { error: dbError } = await supabase
      .from('user') // Replace 'user' with your actual table name
      .update({ password: password.value }) // Update the password column
      .eq('email', email.value); // Match the user by their email

    if (dbError) {
      throw dbError;
    }

    // Create a notification for the user about the password change
    try {
      // Get user email from the form
      const userEmail = email.value;
      
      console.log('Creating password change notification for:', userEmail);
      
      // Store notification in the database using the bookings table
      const { error: notificationError } = await supabase
        .from('bookings')
        .insert([{
          instructorEmail: userEmail,
          event: 'Password Change',
          person: userEmail,
          requestDate: new Date().toISOString().split('T')[0],
          status: 'approved',
          answered: true,
          notification_sent: true,
          timeRange: new Date().toLocaleTimeString(),
          selectedRoom: 'Security',
          notedBy: 'System'
        }]);
        
      if (notificationError) {
        console.error('Error creating password change notification:', notificationError.message);
      } else {
        console.log('Password change notification created successfully');
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
    }
    
    // Show success message and redirect to login
    successMessage.value = 'Your password has been updated successfully!';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
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
