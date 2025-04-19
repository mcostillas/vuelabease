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
          <div class="tag-line">COMPUTER LABORATORY BOOKING SYSTEM</div>
          <h1>Book a<br>Computer Laboratory now.</h1>
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
                  <EnvelopeIcon class="icon-primary" />
                </span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required>
                <span class="input-icon toggle-password" @click="togglePasswordVisibility">
                  <EyeSlashIcon v-if="!showPassword" class="icon-primary" />
                  <EyeIcon v-else class="icon-primary" />
                </span>
              </div>
            </div>

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            
            <div class="forgot-password">
              <router-link to="/forgot-password" class="forgot-password-link">Forgot your Password?</router-link>
            </div>

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

<script setup>
import { EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase.js';

// Reactive variables
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

// Initialize router
const router = useRouter();

// Handle login
const handleLogin = async () => {
  // Clear previous error messages
  console.log('Login button clicked'); // Debugging log
  errorMessage.value = '';
  loading.value = true;

  try {
    // Authenticate the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    console.log('Supabase Auth Response:', { data, error });
    if (error) {
      console.error('Login error:', error.message);
      errorMessage.value = 'Invalid email or password. Please try again.';
      return;
    }

    // Check if the user is authenticated
    if (!data.user) {
      errorMessage.value = 'Authentication failed. Please try again.';
      return;
    }

    // Fetch the user's role from the 'user' table
    const { data: userRoleData, error: roleError } = await supabase
      .from('user')
      .select('usertype')
      .eq('userid', data.user.id)
      .single();
    console.log('Supabase Query Response:', { userRoleData, roleError });
    if (roleError) {
      console.error('Error fetching user role:', roleError.message);
      
      // Try alternative query with email as fallback
      const { data: userDataByEmail, error: emailError } = await supabase
        .from('user')
        .select('usertype')
        .eq('email', email.value)
        .single();
        
      if (emailError) {
        console.error('Email fallback error:', emailError.message);
        errorMessage.value = 'An error occurred while determining your role.';
        return;
      }
      
      // Store the usertype in localStorage
      localStorage.setItem('usertype', userDataByEmail.usertype);
      console.log('Usertype stored in localStorage (from email):', userDataByEmail.usertype);
      
      // Redirect based on usertype
      if (userDataByEmail.usertype === 'Admin') {
        console.log('Redirecting to /admin/dashboard');
        router.push('/admin/dashboard'); // Redirect to Admin Dashboard
      } else if (userDataByEmail.usertype === 'Instructor') {
        console.log('Redirecting to /instructor/dashboard');
        router.push('/instructor/dashboard'); // Redirect to Instructor Dashboard
      } else {
        console.log('Invalid role:', userDataByEmail.usertype);
        errorMessage.value = 'Invalid role. Please contact support.';
      }
      return;
    }

    // Store the usertype in localStorage
    localStorage.setItem('usertype', userRoleData.usertype);
    console.log('Usertype stored in localStorage:', userRoleData.usertype);

    // Redirect based on usertype
    if (userRoleData.usertype === 'Admin') {
      console.log('Redirecting to /admin/dashboard');
      router.push('/admin/dashboard'); // Redirect to Admin Dashboard
    } else if (userRoleData.usertype === 'Instructor') {
      console.log('Redirecting to /instructor/dashboard');
      router.push('/instructor/dashboard'); // Redirect to Instructor Dashboard
    } else {
      console.log('Invalid role:', userRoleData.usertype);
      errorMessage.value = 'Invalid role. Please contact support.';
    }
  } catch (err) {
    console.error('Unexpected login error:', err);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Load remembered email if it exists
if (localStorage.getItem('email')) {
  email.value = localStorage.getItem('email');
  rememberMe.value = true;
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
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
    width: 100%;
    background-color: #dd3859;
    overflow-x: hidden;
  }

  /* Main Content */
  .main-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
  }

  /* Left Content (Landing Page) */
  .content-left {
    width: 100%;
    background: linear-gradient(135deg, #dd3859 0%, #c62c4c 100%);
    display: flex;
    flex-direction: column;
    padding: 3rem 5rem;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
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
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: white;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  }

  .content-left p.main-description {
    font-size: 1.2rem;
    line-height: 1.7;
    max-width: 550px;
    margin-bottom: 2rem;
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
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3rem 4rem;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1);
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    margin-top: -30px;
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
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
  
  .icon-primary {
    width: 20px;
    height: 20px;
    color: #CCCCCC;
  }

  .toggle-password {
    pointer-events: auto;
    cursor: pointer;
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
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .forgot-password {
    text-align: right;
    margin-bottom: 1.5rem;
  }
  
  .forgot-password-link {
    color: #dd3859;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .forgot-password-link:hover {
    color: #b02e47;
    text-decoration: underline;
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
