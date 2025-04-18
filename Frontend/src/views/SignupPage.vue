<template>
  <div class="signup-container">
    <div class="signup-form-wrapper">
      <router-link to="/" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </router-link>

      <div class="signup-form">
        <h1>Sign Up</h1>
        <p class="subtitle">Instructor</p>

        <form @submit.prevent="handleSignup">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="name" placeholder="(e.g. Juan Dela Cruz)" required />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" placeholder="(School email)" required />
          </div>

          <div class="form-group">
            <label for="department">Department</label>
            <select id="department" v-model="department" required>
              <option value="" disabled selected>Select your department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
              <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                <svg class="eye-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="eye-closed" :style="{ display: showPassword ? 'block' : 'none' }" d="M3 3L21 21" stroke="#666" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
              <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword" required />
              <button type="button" class="toggle-password" @click="toggleConfirmPasswordVisibility">
                <svg class="eye-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="eye-closed" :style="{ display: showConfirmPassword ? 'block' : 'none' }" d="M3 3L21 21" stroke="#666" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

          <button type="submit" class="signup-btn" :disabled="isLoading">
            <span v-if="isLoading">Loading...</span>
            <span v-else>Submit</span>
          </button>
        </form>

        <p class="signin-text">
          Already have an account? <router-link to="/login" class="signin-link">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import necessary modules
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../lib/supabaseClient.js';

// Reactive state
const name = ref('');
const email = ref('');
const department = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Initialize route and router
const route = useRoute();
const router = useRouter(); // Keep this if you plan to use it for navigation

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Handle signup process
const handleSignup = async () => {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';

  // Validate input fields
  if (!name.value || !email.value || !department.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    isLoading.value = true;

    // Register the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          fullname: name.value,
          department: department.value,
        },
      },
    });

    if (authError) {
      console.error('Signup Error:', authError.message);
      errorMessage.value = authError.message;
      return;
    }

    // Insert user details into the "user" table
    const { error: insertError } = await supabase
      .from('user')
      .insert([
        {
          userid: authData.user.id, // Use lowercase "userid"
          fullname: name.value, // Use lowercase "fullname"
          email: email.value, // Use lowercase "email"
          department: department.value, // Use lowercase "department"
          isverified: false, // Use lowercase "isverified"
          password: password.value, // Use lowercase "password"
        usertype: 'Instructor', // Use lowercase "usertype"
        },
      ]);

    if (insertError) {
      console.error('Insert Error:', insertError.message);
      errorMessage.value = 'Failed to save user details. Please try again.';
      return;
    }

    // Success message
    successMessage.value = 'A confirmation email has been sent. Please check your inbox.';
    console.log('Signup successful. Confirmation email sent.');
  } catch (err) {
    console.error('Unexpected Error:', err);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
// Handle email confirmation
const handleEmailConfirmation = async () => {
  const accessToken = route.query.access_token;
  const type = route.query.type;

  if (!accessToken || type !== 'signup') {
    errorMessage.value = 'Invalid confirmation link.';
    return;
  }

  try {
    const { error } = await supabase.auth.verifyOTP({
      token: accessToken,
      type: 'signup',
    });

    if (error) {
      console.error('Confirmation Error:', error.message);
      errorMessage.value = 'Error confirming your email. Please try again or contact support.';
    } else {
      successMessage.value = 'Your email has been confirmed successfully! You can now log in.';
      router.push('/login'); // Redirect to login page after confirmation
    }
  } catch (err) {
    console.error('Unexpected Error During Confirmation:', err);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  }
};

// Automatically handle email confirmation if access token is present
if (route.query.access_token) {
  handleEmailConfirmation();
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

/* Signup Container */
.signup-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #ffffff;
}

.signup-form-wrapper {
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

/* Signup Form */
.signup-form {
  margin-top: 0;
  width: 100%;
}

.signup-form h1 {
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
  font-size: 1.2rem;
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

.form-group input::placeholder {
  color: #aaa;
  font-size: 0.9rem;
}

.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  transition: border-color 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.form-group select:focus {
  outline: none;
  border-color: #dd3859;
}

/* Password Input */
.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.toggle-password:hover svg path {
  stroke: #dd3859;
}

.eye-icon {
  pointer-events: none;
}

.eye-closed {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.eye-open {
  position: relative;
  z-index: 1;
}

/* Error Message */
.error-message {
  display: block;
  color: #E9256E;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

/* Submit Button */
.signup-btn {
  width: 100%;
  background: #dd3859;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.signup-btn:hover {
  background: #c62c4c;
}

/* Sign In Link */
.signin-text {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 0.9rem;
}

.signin-link {
  color: #dd3859;
  text-decoration: none;
  font-weight: 500;
}

.signin-link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .signup-form-wrapper {
    padding: 1.5rem;
  }

  .signup-form h1 {
    font-size: 2rem;
  }
}
</style>
