<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Reports" />
    <div class="reports-container">
      <div class="reports-section">
        <!-- Simplified Report Content will go here based on your instructions -->
      </div>
    </div>
    
    <!-- Notification -->
    <div class="notification" :class="[notification.type, { show: notification.show }]">
      {{ notification.message }}
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';

export default {
  name: 'AdminReports',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  methods: {
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.reports-container {
  padding: 20px;
  height: 100%;
}

.reports-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Notification Styling */
.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: white;
  color: #1e293b;
  border: 2px solid #DD3859;
  font-size: 14px;
  font-weight: 500;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1001;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.notification.show {
  transform: translateY(0);
  opacity: 1;
}
</style>
