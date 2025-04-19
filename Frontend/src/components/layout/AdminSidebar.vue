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
        <router-link to="/admin/dashboard" class="nav-item" :class="{ 'active': isActive('dashboard') }" title="Dashboard" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons squares-2x2 -->
            <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/notifications" class="nav-item" :class="{ 'active': isActive('notifications') }" title="Notifications" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons bell -->
            <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Notifications</span>
        </router-link>
        <router-link to="/admin/bookings" class="nav-item" :class="{ 'active': isActive('bookings') }" title="Booking Management" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons calendar -->
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Bookings</span>
        </router-link>
        <router-link to="/admin/history" class="nav-item" :class="{ 'active': isActive('history') }" title="Booking History" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons clock -->
            <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>History</span>
        </router-link>
        <router-link to="/admin/schedule" class="nav-item" :class="{ 'active': isActive('schedule') }" title="Schedule" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons calendar-days -->
            <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15zm0 2.25h.008v.008h-.008v-.008z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Schedule</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" :class="{ 'active': isActive('users') }" title="User Management" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons user-group -->
            <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>User Management</span>
        </router-link>
        <router-link to="/admin/reports" class="nav-item" :class="{ 'active': isActive('reports') }" title="Reports" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons document-chart-bar -->
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9m3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zm1.5 0a1.125 1.125 0 01-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125V7.5h6.75v9.375z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Reports</span>
        </router-link>
        <router-link to="/admin/logbook" class="nav-item" :class="{ 'active': isActive('logbook') }" title="Log Book" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Heroicons book-open icon -->
            <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Log Book</span>
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
  name: 'AdminSidebar',
  components: {
    ConfirmationDialog
  },
  props: {
    userRole: {
      type: String,
      required: true, // Pass the userRole dynamically from the parent component
    },
  },
  data() {
    return {
      isExpanded: false,
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
          { path: '/admin/bookings', title: 'Bookings', icon: 'bookings' },
          { path: '/admin/history', title: 'History', icon: 'history' },
          { path: '/admin/schedule', title: 'Schedule', icon: 'schedule' },
          { path: '/admin/users', title: 'User Management', icon: 'users' },
          { path: '/admin/reports', title: 'Reports', icon: 'reports' },
          { path: '/admin/logbook', title: 'Log Book', icon: 'logbook' },
        ];
      } else if (this.userRole === 'Instructor') {
        return [
          { path: '/instructor/dashboard', title: 'Dashboard', icon: 'dashboard' },
          { path: '/instructor/notifications', title: 'Notifications', icon: 'notifications' },
          { path: '/instructor/schedule', title: 'Schedule', icon: 'schedule' },
          { path: '/instructor/history', title: 'History', icon: 'history' },
          { path: '/instructor/account', title: 'Account', icon: 'account' },
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
      localStorage.removeItem('labease_user_data');

      // Redirect to login page
      this.$router.push('/');
      
      // Hide the confirmation dialog
      this.showLogoutConfirmation = false;
    },
    
    cancelLogout() {
      this.showLogoutConfirmation = false;
    },
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
  padding-top: 16px;
}

.logout {
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .sidenav {
    width: 64px;
  }
  
  .sidenav.expanded {
    width: 200px;
  }
  
  .logo img {
    width: 40px;
    height: 40px;
  }
}
</style>
