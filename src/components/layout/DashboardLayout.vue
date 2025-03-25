<template>
  <div class="dashboard-container">
    <AdminSidebar v-if="userRole === 'admin'" @sidebar-toggle="handleSidebarToggle" />
    <InstructorSidebar v-else @sidebar-toggle="handleSidebarToggle" />
    <main class="main-content" :class="{ 'sidebar-expanded': sidebarExpanded }">

      <div class="content-wrapper">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import InstructorSidebar from './Sidebar.vue'


export default {
  name: 'DashboardLayout',
  components: {
    AdminSidebar,
    InstructorSidebar,

  },
  data() {
    return {
      sidebarExpanded: false,
      userRole: null
    }
  },
  methods: {
    handleSidebarToggle(expanded) {
      this.sidebarExpanded = expanded
    },
    getUserRole() {
      const token = localStorage.getItem('labease_auth_token')
      if (token) {
        try {
          const userData = JSON.parse(atob(token))
          this.userRole = userData.role
        } catch (e) {
          console.error('Error parsing token:', e)
          this.userRole = null
        }
      }
    }
  },
  created() {
    this.getUserRole()
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 72px;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-expanded {
  margin-left: 240px;
}

.content-wrapper {
  padding: 0 24px 24px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-expanded {
    margin-left: 240px;
  }
}
</style>
