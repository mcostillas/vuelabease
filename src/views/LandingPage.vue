<template>
  <div class="landing-container">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Landing Page Content (Left Side) -->
      <div class="content-left">
        <!-- Background Elements -->
        <div class="bg-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-4"></div>
          <div class="circle circle-5"></div>
        </div>
        
        <div class="logo">
          <img src="@/assets/images/ClassTrackLOGO-Logo Only-Pink BG 1.png" alt="LabEase Logo">
          <span class="logo-text">LabEase</span>
        </div>
        
        <div class="left-content-text">
          <div class="tag-line">LABORATORY BOOKING SYSTEM</div>
          <h1>Book a<br>Laboratory now.</h1>
          <p class="main-description">Effortless Lab Booking at Your Fingertips—<br>Access, Reserve, and Manage Your Lab<br>Sessions Anytime, Anywhere.</p>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="feature-text">Easy Scheduling</div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="feature-text">Real-time Availability</div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="feature-text">Equipment Management</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Login Form (Right Side) -->
      <div class="content-right">
        <div class="login-form-wrapper">
          <h2>Log In</h2>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <input type="text" id="email" v-model="email" required>
                <span class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="#CCCCCC"/>
                  </svg>
                </span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required>
                <span class="input-icon toggle-password" @click="togglePasswordVisibility">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM7.94 9.5L9.08 10.64C9.03 10.92 9 11.2 9 11.5C9 13.26 10.49 14.75 12.25 14.75C12.55 14.75 12.83 14.72 13.11 14.67L14.25 15.81C13.58 16.09 12.83 16.25 12.05 16.25C9.24 16.25 7 14.01 7 11.2C7 10.42 7.16 9.67 7.44 9L7.94 9.5Z" fill="#CCCCCC"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C20.23 13.42 19.29 14.67 18.12 15.62L19.77 17.27C21.44 15.93 22.74 14.22 23.43 12.25C23.66 11.66 23.66 11.01 23.43 10.42C21.56 5.99 16.99 3 12 3C10.73 3 9.51 3.2 8.36 3.57L10.1 5.31C10.71 5.19 11.34 5.13 12 5.13V6.5ZM2.71 3.16C2.32 3.55 2.32 4.18 2.71 4.57L4.68 6.54C2.93 7.89 1.59 9.67 0.87 11.75C0.64 12.34 0.64 12.99 0.87 13.58C2.74 18.01 7.31 21 12.3 21C13.96 21 15.54 20.67 16.97 20.06L19.09 22.18C19.48 22.57 20.11 22.57 20.5 22.18C20.89 21.79 20.89 21.16 20.5 20.77L3.13 3.5C2.94 3.31 2.69 3.22 2.43 3.22C2.18 3.22 1.92 3.31 1.73 3.5L2.71 3.16ZM12 17.5C10.97 17.5 10.03 17.2 9.22 16.72L10.51 15.43C10.97 15.64 11.47 15.75 12 15.75C13.81 15.75 15.25 14.31 15.25 12.5C15.25 11.97 15.14 11.47 14.93 11.01L16.22 9.72C16.7 10.53 17 11.47 17 12.5C17 15.26 14.76 17.5 12 17.5ZM7.94 9.5L9.08 10.64C9.03 10.92 9 11.2 9 11.5C9 13.26 10.49 14.75 12.25 14.75C12.55 14.75 12.83 14.72 13.11 14.67L14.25 15.81C13.58 16.09 12.83 16.25 12.05 16.25C9.24 16.25 7 14.01 7 11.2C7 10.42 7.16 9.67 7.44 9L7.94 9.5Z" fill="#CCCCCC"/>
                  </svg>
                </span>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <div class="button-group">
              <router-link to="/booking" class="book-now-btn">Book Now!</router-link>
              <button type="submit" class="login-btn">Log In</button>
            </div>
            
            <div class="signup-text">
              Don't have an account yet? <router-link to="/signup" class="signup-link">Sign Up</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      email: '',
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
      
      // Check credentials - now using email instead of username
      const user = Object.values(CREDENTIALS).find(
        user => (user.username === this.email || user.username + '@labease.com' === this.email) && user.password === this.password
      )

      if (user) {
        // Generate a simple token (in real app, this would be from server)
        const token = btoa(JSON.stringify({ username: user.username, role: user.role }))
        localStorage.setItem('labease_auth_token', token)
        localStorage.setItem('labease_user_data', JSON.stringify(user))
        
        // Redirect to appropriate dashboard
        this.$router.push(user.dashboard)
      } else {
        this.errorMessage = 'Invalid email or password'
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

  .landing-container {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Main Content */
  .main-content {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  /* Left Content (Landing Page) */
  .content-left {
    flex: 1;
    background: linear-gradient(135deg, #dd3859 0%, #c62c4c 100%);
    display: flex;
    flex-direction: column;
    padding: 4rem 5rem;
    color: white;
    position: relative;
    overflow: hidden;
  }

  /* Background Circles */
  .bg-circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .circle-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    left: -100px;
  }

  .circle-2 {
    width: 200px;
    height: 200px;
    bottom: 50px;
    right: -50px;
  }

  .circle-3 {
    width: 150px;
    height: 150px;
    top: 40%;
    left: 30%;
    background: rgba(255, 255, 255, 0.05);
  }

  .circle-4 {
    width: 100px;
    height: 100px;
    top: 20%;
    right: 20%;
    background: rgba(255, 255, 255, 0.05);
  }

  .circle-5 {
    width: 50px;
    height: 50px;
    bottom: 20%;
    left: 20%;
    background: rgba(255, 255, 255, 0.05);
  }

  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    z-index: 2;
  }

  .logo img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  .logo-text {
    font-size: 1.8rem;
    font-weight: 600;
    margin-left: 1rem;
    letter-spacing: 0.5px;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .left-content-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 2;
    max-width: 600px;
    margin: 0 auto;
  }

  .tag-line {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
    opacity: 0.85;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .content-left h1 {
    font-size: 4rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  }

  .content-left p.main-description {
    font-size: 1.2rem;
    line-height: 1.7;
    max-width: 550px;
    margin-bottom: 3rem;
    opacity: 0.9;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
  }

  /* Features */
  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .feature:hover .feature-icon {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }

  .feature-text {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* Right Content (Login Form) */
  .content-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 4rem;
    position: relative;
    background-color: #ffffff;
    box-shadow: -5px 0px 15px rgba(0, 0, 0, 0.05);
  }

  .login-form-wrapper {
    width: 100%;
    max-width: 400px;
  }

  .login-form-wrapper h2 {
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

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #CCCCCC;
  }

  .toggle-password {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .toggle-password:hover {
    color: #dd3859;
    transform: translateY(-50%) scale(1.1);
  }
  
  .toggle-password:hover svg path {
    fill: #dd3859;
  }

  .form-group input {
    width: 100%;
    padding: 0.8rem 2.5rem 0.8rem 1rem;
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

  /* Buttons */
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }

  .book-now-btn, .login-btn {
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

  .book-now-btn {
    background: none;
    border: 1px solid #dd3859;
    color: #dd3859;
  }

  .book-now-btn:hover {
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

  /* Responsive Design */
  @media (max-width: 1200px) {
    .content-left h1 {
      font-size: 3.5rem;
    }
    
    .content-left, .content-right {
      padding: 3rem;
    }
    
    .features {
      gap: 1.5rem;
    }
  }

  @media (max-width: 992px) {
    .main-content {
      flex-direction: column;
      height: auto;
    }
    
    .content-left, .content-right {
      width: 100%;
      min-height: 50vh;
    }
    
    .content-left {
      align-items: center;
      text-align: center;
      padding: 3rem 2rem;
    }
    
    .left-content-text {
      align-items: center;
    }
    
    .content-left p.main-description {
      margin: 0 auto 2.5rem;
    }
    
    .features {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .content-left h1 {
      font-size: 2.2rem;
    }
    
    .login-form-wrapper h2 {
      font-size: 2rem;
    }
    
    .content-left, .content-right {
      padding: 2rem 1rem;
    }
  }

  @media (max-width: 576px) {
    .button-group {
      flex-direction: column;
    }
    
    .content-left h1 {
      font-size: 2rem;
    }
    
    .login-form-wrapper h2 {
      font-size: 1.8rem;
    }
  }
</style>
