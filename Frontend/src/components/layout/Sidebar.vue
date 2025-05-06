<template>
  <nav class="sidenav" :class="{ 'expanded': isExpanded }" @click="handleSidebarClick">
    <confirmation-dialog
      :show="showLogoutConfirmation"
      title="Confirm Logout"
      message="Are you sure you want to log out?"
      confirm-text="Logout"
      cancel-text="Cancel"
      @confirm="confirmLogout"
      @cancel="cancelLogout"
    />
    <div class="nav-top">
      <div class="logo">
        <img src="@/assets/images/ClassTrackLOGO-Logo Only-Pink BG 1.png" alt="LabEase Logo">
        <span class="logo-text">LabEase</span>
      </div>
      <div class="nav-links">
        <router-link to="/instructor/dashboard" class="nav-item" :class="{ 'active': isActive('dashboard') }" title="Dashboard" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons squares-2x2 -->
            <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/instructor/notifications" class="nav-item" :class="{ 'active': isActive('notifications') }" title="Notifications" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons bell -->
            <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Notifications</span>
        </router-link>
        <router-link to="/instructor/schedule" class="nav-item" :class="{ 'active': isActive('schedule') }" title="Schedule" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons calendar-days -->
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Schedule</span>
        </router-link>
        <router-link to="/instructor/booking" class="nav-item" :class="{ 'active': isActive('booking') }" title="Book Lab" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons clipboard-document-check -->
            <path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Book Lab</span>
        </router-link>
        <router-link to="/instructor/history" class="nav-item" :class="{ 'active': isActive('history') }" title="History" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons clock -->
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>History</span>
        </router-link>
      </div>
    </div>
    <div class="nav-bottom">
      <a href="#" class="nav-item logout" title="Logout" @click.stop.prevent="showLogoutDialog">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Heroicons arrow-right-on-rectangle -->
          <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Logout</span>
      </a>
    </div>
  </nav>
</template>

<script>
import ConfirmationDialog from '@/components/common/ConfirmationDialog.vue';

export default {
  name: 'InstructorSidebar',
  components: {
    ConfirmationDialog
  },
  data() {
    return {
      isExpanded: false,
      userRole: 'Instructor', // Default role
      showLogoutConfirmation: false,
    };
  },
  computed: {
    // Dynamically generate sidebar links based on userRole
    sidebarLinks() {
      if (this.userRole === 'Admin') {
        return [
          { path: '/admin/dashboard', title: 'Dashboard', icon: 'dashboard' },
          { path: '/admin/notifications', title: 'Notifications', icon: 'notifications' },
          { path: '/admin/history', title: 'History', icon: 'history' },
        ];
      } else if (this.userRole === 'Instructor') {
        return [
          { path: '/instructor/dashboard', title: 'Dashboard', icon: 'dashboard' },
          { path: '/instructor/notifications', title: 'Notifications', icon: 'notifications' },
          { path: '/instructor/schedule', title: 'Schedule', icon: 'schedule' },
          { path: '/instructor/booking', title: 'Book Lab', icon: 'booking' },
          { path: '/instructor/history', title: 'History', icon: 'history' },
        ];
      }
      return [];
    },
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
      this.$emit('sidebar-toggle', this.isExpanded);
    },
    handleSidebarClick(event) {
      if (
        event.target === event.currentTarget ||
        event.target.classList.contains('sidenav') ||
        event.target.classList.contains('logo') ||
        event.target.classList.contains('logo-text') ||
        event.target.tagName === 'IMG'
      ) {
        this.toggleSidebar();
      }
    },
    isActive(route) {
      return this.$route.path.includes(route);
    },
    showLogoutDialog() {
      this.showLogoutConfirmation = true;
    },
    
    confirmLogout() {
      // Clear authentication data
      localStorage.removeItem('labease_auth_token');
      localStorage.removeItem('usertype');

      // Ensure $router is available before calling push
      if (this.$router) {
        this.$router.push('/').catch(err => {
          console.error('Router push error:', err);
        });
      } else {
        console.error('Router instance is not available');
      }
      
      // Hide the confirmation dialog
      this.showLogoutConfirmation = false;
    },
    
    cancelLogout() {
      this.showLogoutConfirmation = false;
    },
  },
  created() {
    const storedUserRole = localStorage.getItem('usertype');
    console.log('Retrieved usertype from localStorage:', storedUserRole); // Debugging log
    if (storedUserRole) {
      this.userRole = storedUserRole;
      console.log('Assigned userRole:', this.userRole); // Debugging log
    } else {
      console.error('Usertype not found in localStorage');
      if (this.$router) {
        this.$router.push('/'); // Redirect to login if usertype is missing
      }
    }
  },
};
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
