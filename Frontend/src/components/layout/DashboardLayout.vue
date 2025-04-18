<template>
  <div class="dashboard-container">
    <!-- Render the appropriate sidebar based on the usertype from localStorage -->
    <AdminSidebar v-if="userRole === 'Admin'" @sidebar-toggle="handleSidebarToggle" />
    <InstructorSidebar v-else-if="userRole === 'Instructor'" @sidebar-toggle="handleSidebarToggle" />
    <main class="main-content" :class="{ 'sidebar-expanded': sidebarExpanded }">
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';
import InstructorSidebar from './Sidebar.vue';

export default {
  name: 'DashboardLayout',
  components: {
    AdminSidebar,
    InstructorSidebar,
  },
  data() {
    return {
      userRole: '', // Dynamically set based on localStorage
      sidebarExpanded: false,
    };
  },
  created() {
    // Fetch the usertype from localStorage when the component is created
    const storedUserRole = localStorage.getItem('usertype');
    if (storedUserRole) {
      this.userRole = storedUserRole;
    } else {
      console.error('Usertype not found in localStorage');
    }
  },
  methods: {
    handleSidebarToggle(expanded) {
      this.sidebarExpanded = expanded;
    },
  },
};
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