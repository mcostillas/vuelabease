<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <router-link to="/" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </router-link>

      <div class="login-form">
        <h1>Log In</h1>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
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
            <label>
              <input type="checkbox" v-model="rememberMe" /> Remember Me
            </label>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading">Logging in...</span>
            <span v-else>Log In</span>
          </button>
        </form>

        <div class="social-login">
          <button @click="loginWithGoogle" class="google-login-btn">Log in with Google</button>
          <button @click="loginWithFacebook" class="facebook-login-btn">Log in with Facebook</button>
        </div>

        <p class="signup-text">
          Don't have an account yet? <router-link to="/signup" class="signup-link">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { supabase } from '../lib/supabaseClient.js';

const router = useRouter();
const store = useStore();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const error = ref(null);

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Handle login with email and password
const handleLogin = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Sign in with Supabase Auth
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (loginError) {
      error.value = 'Invalid email or password.';
      toast.error('Login failed. Please check your credentials.');
      return;
    }

    if (data.user && data.session) {
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.session.access_token);

      // Fetch the user's role from the 'users' table
      const { data: userRoleData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (roleError) {
        error.value = 'Error fetching user role.';
        toast.error('An error occurred while determining your role.');
        return;
      }

      // Update Vuex store
      store.commit('setUser', data.user);
      store.commit('setLoggedIn', true);

      // Store email if "Remember Me" is checked
      if (rememberMe.value) {
        localStorage.setItem('email', email.value);
      } else {
        localStorage.removeItem('email');
      }

      // Redirect based on role
      if (userRoleData.role === 'Teacher') {
        router.push('/courses'); // Redirect to CourseList.vue
      } else if (userRoleData.role === 'Student') {
        router.push('/student-dashboard'); // Redirect to StudentDashboard.vue
      } else {
        toast.error('Invalid role. Please contact support.');
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred.';
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    loading.value = false;
  }
};

// Load remembered email if it exists
if (localStorage.getItem('email')) {
  email.value = localStorage.getItem('email');
  rememberMe.value = true;
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
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-color: #ffffff;
}

.login-form-wrapper {
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

/* Login Form */
.login-form {
    margin-top: 0rem;
    width: 100%;
}

.login-form h1 {
    color: #dd3859;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    text-align: center;
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

/* Buttons */
.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.book_now-btn, .login-btn {
    flex: 1;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;
    display: inline-block;
}

.book_now-btn {
    background: none;
    border: 1px solid #dd3859;
    color: #dd3859;
}

.book_now-btn:hover {
    background: rgba(221, 56, 89, 0.1);
}

.login-btn {
    background: #dd3859;
    border: none;
    color: white;
}

.login-btn:hover {
    background: #c62c4c;
}

/* Sign Up Link */
.signup-text {
    text-align: center;
    margin-top: 2rem;
    color: #666;
    font-size: 0.9rem;
}

.signup-link {
    color: #dd3859;
    text-decoration: none;
    font-weight: 500;
}

.signup-link:hover {
    text-decoration: underline;
}

/* Error Message */
.error-message {
    display: block;
    color: #E9256E;
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

/* Forgot Password Link */
.forgot-password {
  text-align: right;
  margin-top: 0.5rem;
}

.forgot-password-link {
  color: #dd3859;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #b82e48;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
    .login-container {
        padding: 1.5rem;
    }

    .login-form h1 {
        font-size: 2rem;
    }

    .button-group {
        flex-direction: column;
    }
}
</style>
