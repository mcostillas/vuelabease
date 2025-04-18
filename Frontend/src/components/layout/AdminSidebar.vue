<template>
  <nav class="sidenav" :class="{ 'expanded': isExpanded }" @click="handleSidebarClick">
    <div class="nav-top">
      <div class="logo">
        <img src="@/assets/images/ClassTrackLOGO-Logo Only-Pink BG 1.png" alt="LabEase Logo">
        <span class="logo-text">LabEase</span>
      </div>
      <div class="nav-links">
        <router-link to="/admin/dashboard" class="nav-item" :class="{ 'active': isActive('dashboard') }" title="Dashboard" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="2" y="13" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="2" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="13" width="9" height="9" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/notifications" class="nav-item" :class="{ 'active': isActive('notifications') }" title="Notifications" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3016 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3016 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Notifications</span>
        </router-link>
        <router-link to="/admin/bookings" class="nav-item" :class="{ 'active': isActive('bookings') }" title="Booking Management" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Bookings</span>
        </router-link>
        <router-link to="/admin/history" class="nav-item" :class="{ 'active': isActive('history') }" title="Booking History" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3.05078 11.0002C3.27441 7.80643 5.04297 4.92768 7.74023 3.15237C10.4375 1.37706 13.7832 0.909961 16.8145 1.88674C19.8457 2.86362 22.2949 5.18362 23.4355 8.13284C24.5762 11.0821 24.2793 14.3633 22.6309 17.0587C20.9824 19.754 18.1758 21.6118 14.9707 22.0978C11.7656 22.5837 8.51953 21.6509 6.05859 19.5431C3.59766 17.4353 2.19922 14.3555 2.19922 11.0978" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>History</span>
        </router-link>
        <router-link to="/admin/schedule" class="nav-item" :class="{ 'active': isActive('schedule') }" title="Schedule" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 14H8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 14H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 14H16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 18H8.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 18H16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Schedule</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" :class="{ 'active': isActive('users') }" title="User Management" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>User Management</span>
        </router-link>
        <router-link to="/admin/reports" class="nav-item" :class="{ 'active': isActive('reports') }" title="Reports" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Reports</span>
        </router-link>
        <router-link to="/admin/logbook" class="nav-item" :class="{ 'active': isActive('logbook') }" title="Log Book" @click.stop>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19.5C4 20.3284 4.67157 21 5.5 21H18.5C19.3284 21 20 20.3284 20 19.5V8H4V19.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 8V4.5C8 3.67157 8.67157 3 9.5 3H14.5C15.3284 3 16 3.67157 16 4.5V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Log Book</span>
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
  name: 'AdminSidebar',
  props: {
    userRole: {
      type: String,
      required: true, // Pass the userRole dynamically from the parent component
    },
  },
  data() {
    return {
      isExpanded: false,
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
    logout() {
      // Clear authentication data
      localStorage.removeItem('labease_auth_token');
      localStorage.removeItem('labease_user_data');

      // Redirect to login page
      this.$router.push('/login');
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
