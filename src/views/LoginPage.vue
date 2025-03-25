<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <router-link to="/" class="back-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
      
      <div class="login-form">
        <h1>Log In</h1>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required>
              <button type="button" class="toggle-password" @click="togglePasswordVisibility">
                <svg class="eye-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g class="eye-open" :style="{ display: showPassword ? 'none' : 'block' }">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <path class="eye-closed" :style="{ display: showPassword ? 'block' : 'none' }" d="M3 3L21 21" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="forgot-password">
              <router-link to="/forgot-password" class="forgot-password-link">Forgot Password?</router-link>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

          <div class="button-group">
            <router-link to="/booking" class="book_now-btn">Book Now!</router-link>
            <button type="submit" class="login-btn">Log In</button>
          </div>
        </form>

        <p class="signup-text">
          Don't have an account yet? <router-link to="/signup" class="signup-link">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      errorMessage: ''
    }
  },
  created() {
    // Remove auto-redirect on existing token
    const token = localStorage.getItem('labease_auth_token')
    if (token) {
      localStorage.removeItem('labease_auth_token')
      localStorage.removeItem('labease_user_data')
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    handleLogin() {
      // Clear previous error message
      this.errorMessage = ''
      
      // Dummy credentials (same as original)
      const CREDENTIALS = {
        instructor: {
          username: 'teacher',
          password: '1234',
          role: 'instructor',
          dashboard: '/instructor/dashboard'
        },
        admin: {
          username: 'admin',
          password: '1234',
          role: 'admin',
          dashboard: '/admin/dashboard'
        }
      }
      
      // Check credentials
      const user = Object.values(CREDENTIALS).find(
        user => user.username === this.username && user.password === this.password
      )

      if (user) {
        // Generate a simple token (in real app, this would be from server)
        const token = btoa(JSON.stringify({ username: user.username, role: user.role }))
        localStorage.setItem('labease_auth_token', token)
        localStorage.setItem('labease_user_data', JSON.stringify(user))
        
        // Redirect to appropriate dashboard
        this.$router.push(user.dashboard)
      } else {
        this.errorMessage = 'Invalid username or password'
      }
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
