<template>
  <nav class="sidenav" :class="{ 'expanded': isExpanded }" @click="handleSidebarClick">
    <div class="nav-top">
      <div class="logo">
        <img src="@/assets/images/ClassTrackLOGO-Logo Only-Pink BG 1.png" alt="LabEase Logo">
        <span class="logo-text">LabEase</span>
      </div>
      <div class="nav-links">
        <router-link :to="dashboardPath" class="nav-item" :class="{ 'active': isActive('dashboard') }" title="Dashboard" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="13" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link :to="notificationsPath" class="nav-item" :class="{ 'active': isActive('notifications') }" title="Notifications" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3016 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3016 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Notifications</span>
        </router-link>
        <router-link :to="schedulePath" class="nav-item" :class="{ 'active': isActive('schedule') }" title="Schedule" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Schedule</span>
        </router-link>
        <router-link :to="historyPath" class="nav-item" :class="{ 'active': isActive('history') }" title="History" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>History</span>
        </router-link>
      </div>
    </div>
    <div class="nav-bottom">
      <a href="#" class="nav-item logout" title="Logout" @click.stop.prevent="logout">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Logout</span>
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'InstructorSidebar',
  data() {
    return {
      isExpanded: false,
      userRole: 'instructor'
    }
  },
  computed: {
    dashboardPath() {
      return '/instructor/dashboard'
    },
    notificationsPath() {
      return '/instructor/notifications'
    },
    schedulePath() {
      return '/instructor/schedule'
    },
    historyPath() {
      return '/instructor/history'
    }
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded
      this.$emit('sidebar-toggle', this.isExpanded)
    },
    handleSidebarClick(event) {
      // Only toggle if clicking on the sidebar itself, not on a link or button
      if (event.target === event.currentTarget || 
          event.target.classList.contains('sidenav') ||
          event.target.classList.contains('logo') ||
          event.target.classList.contains('logo-text') ||
          event.target.tagName === 'IMG') {
        this.toggleSidebar()
      }
    },
    isActive(route) {
      return this.$route.path.includes(route)
    },
    logout() {
      // Clear authentication data
      localStorage.removeItem('labease_auth_token')
      localStorage.removeItem('labease_user_data')
      
      // Redirect to login page
      this.$router.push('/login')
    }
  },
  created() {
    // No need to get user role as it's fixed to instructor
  }
}
</script>

<style scoped>
/* Sidebar Navigation */
.sidenav {
  background-color: #DD3859;
  width: 72px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow-x: hidden;
  z-index: 1000;
}

.sidenav.expanded {
  width: 240px;
}

.nav-top {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 0 4px;
}

.logo img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.logo-text {
  color: white;
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.sidenav.expanded .logo-text {
  opacity: 1;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: white;
  color: #DD3859;
}

.nav-item svg {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.nav-item span {
  font-size: 16px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidenav.expanded .nav-item span {
  opacity: 1;
}

.nav-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
}

.nav-item.logout {
  background-color: #DD3859;
  color: white;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.nav-item.logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
