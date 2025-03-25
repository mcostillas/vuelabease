<template>
  <div class="landing-container">
    <!-- Side Navigation -->
    <nav class="sidenav">
      <div class="logo">
        <img src="@/assets/images/ClassTrackLOGO-Logo Only-Pink BG 1.png" alt="LabEase Logo">
      </div>
      <div class="nav-icons">
        <div class="nav-icon info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="nav-icon exit-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-left">
        <h1>Book a<br>Laboratory now.</h1>
        <p>Effortless Lab Booking at Your Fingertips—Access, Reserve,<br>and Manage Your Lab Sessions Anytime, Anywhere.</p>
        <button class="get-started-btn" @click="clearAuthAndRedirect">Get Started</button>
      </div>
      <div class="content-right">
        <div class="calendar-illustration">
          <img src="@/assets/images/image 12.png" alt="Calendar Illustration">
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    clearAuthAndRedirect() {
      // Clear any existing authentication
      localStorage.removeItem('labease_auth_token');
      localStorage.removeItem('labease_user_data');
      // Navigate to login page
      this.$router.push('/login');
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
  background-color: #ffffff;
  display: flex;
  min-height: 100vh;
}

/* Side Navigation */
.sidenav {
  width: 100px;
  background-color: #dd3859;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 3rem;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav-icons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
  margin-bottom: 2rem;
}

.nav-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.nav-icon:hover {
  background-color: white;
}

.nav-icon:hover svg path {
  stroke: #dd3859;
}

/* Main Content */
.main-content {
  margin-left: 100px;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 5%;
  gap: 4rem;
}

.content-left {
  flex: 1;
  max-width: 600px;
  padding-left: 4rem;
}

.content-left h1 {
  font-size: 4rem;
  font-weight: 700;
  color: #dd3859;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.content-left p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2.5rem;
  max-width: 500px;
  line-height: 1.4;
}

.get-started-btn {
  background-color: #dd3859;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 500px;
}

.get-started-btn:hover {
  background-color: #c62c4c;
}

.content-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-illustration {
  width: 100%;
  max-width: 500px;
}

.calendar-illustration img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    padding-top: 3rem;
    text-align: center;
  }

  .content-left {
    padding: 2rem;
  }

  .content-left p {
    margin: 0 auto 2.5rem auto;
  }

  .calendar-illustration {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .content-left h1 {
    font-size: 3rem;
  }

  .calendar-illustration {
    max-width: 300px;
  }
}
</style>
