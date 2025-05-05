<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Notifications" />
    <div class="notifications-container">
      <div class="notifications-section">
        <!-- Notification Filters -->
        <div class="notification-filters">
          <div class="filter-buttons">
            <button 
              class="filter-button" 
              :class="{ active: activeFilter === 'all' }"
              @click="setFilter('all')"
            >
              All
            </button>
            <button 
              class="filter-button" 
              :class="{ active: activeFilter === 'unread' }"
              @click="setFilter('unread')"
            >
              Unread
            </button>
            <button 
              class="filter-button" 
              :class="{ active: activeFilter === 'booking' }"
              @click="setFilter('booking')"
            >
              Bookings
            </button>
            <button 
              class="filter-button" 
              :class="{ active: activeFilter === 'alert' }"
              @click="setFilter('alert')"
            >
              Alerts
            </button>
          </div>
          
          <button 
            v-if="filteredNotifications.length > 0" 
            class="clear-all-button"
            @click="clearAllNotifications"
          >
            Clear All
          </button>
        </div>
        
        <div v-if="filteredNotifications.length === 0" class="no-notifications">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>You have no notifications at this time</p>
        </div>
        
        <div class="notification-cards">
          <div 
  v-for="(notification, index) in filteredNotifications" 
  :key="index" 
  class="notification-card" 
  :class="[
    { 'unread': !notification.read },
    notification.type === 'booking' && notification.title.includes('Accepted') ? 'accepted' : '',
    notification.type === 'booking' && notification.title.includes('Declined') ? 'rejected' : ''
  ]"
>
  <div class="notification-item" @click="openNotificationModal(notification, getOriginalIndex(notification))">
    <div class="notification-type">
      <div class="notification-icon" :class="notification.type">
        <svg v-if="notification.type === 'booking'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="notification.type === 'alert'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <div class="notification-details">
      <h3 class="notification-title">{{ notification.title }}</h3>
      <p class="notification-message" :class="notification.statusClass">{{ notification.message }}</p>
      <span class="notification-time">{{ notification.time }}</span>
    </div>
  </div>
  
  <button class="delete-notification-button" @click.stop="deleteNotification(getOriginalIndex(notification))">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 6L18 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
        </div>
      </div>
    </div>

    <Modal 
  :show="showModal" 
  :title="''" 
  @close="closeModal"
  :showFooter="false"
>
  <div class="notification-modal-content">
    <div class="modal-notification-header">
      <div class="modal-notification-left">
        <div class="modal-notification-icon" v-if="selectedNotification" :class="selectedNotification.type">
          <!-- Booking Icon -->
          <svg v-if="selectedNotification && selectedNotification.type === 'booking'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Alert Icon -->
          <svg v-else-if="selectedNotification && selectedNotification.type === 'alert'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 v-if="selectedNotification" class="modal-notification-title">{{ selectedNotification.title }}</h3>
      </div>
      <div class="modal-notification-time" v-if="selectedNotification">
        {{ selectedNotification.time }}
      </div>
    </div>

    <div class="modal-notification-body">
      <p class="modal-notification-message" v-if="selectedNotification">
        {{ selectedNotification.message }}
      </p>

      <div v-if="selectedNotification && selectedNotification.type === 'booking'" class="modal-notification-details">
        <div class="detail-item">
          <div class="detail-label">Room</div>
          <div class="detail-value">{{ selectedNotification.selectedRoom || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Date</div>
          <div class="detail-value">{{ selectedNotification.requestDate || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Time</div>
          <div class="detail-value">{{ selectedNotification.timeRange || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Requested by</div>
          <div class="detail-value">{{ selectedNotification.person || 'N/A' }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Noted by</div>
          <div class="detail-value">{{ selectedNotification.notedBy || 'N/A' }}</div>
        </div>
      </div>
    </div>
  </div>
</Modal>

  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import InstructorHeader from '@/components/instructor/InstructorHeader.vue'
import Modal from '@/components/ui/Modal.vue'

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

export default {
  name: 'InstructorNotifications',
  components: {
    DashboardLayout,
    InstructorHeader,
    Modal
  },
  data() {
  return {
    showModal: false,
    selectedNotification: null,
    selectedNotificationIndex: -1,
    activeFilter: 'all',
    notifications: [], // Initialize with empty array instead of sample data
    isLoading: false
  }
},
  computed: {
    filteredNotifications() {
      switch (this.activeFilter) {
        case 'all':
          return this.notifications;
        case 'unread':
          return this.notifications.filter(notification => !notification.read);
        case 'booking':
          return this.notifications.filter(notification => notification.type === 'booking');
        case 'alert':
          return this.notifications.filter(notification => notification.type === 'alert');
        default:
          return this.notifications;
      }
    }
  },
  created() {
  // Clear any existing notifications from localStorage to prevent showing old data
  localStorage.removeItem('notifications');
  
  // Check user role first
  const storedUserRole = localStorage.getItem('usertype');
  console.log('Retrieved usertype from localStorage:', storedUserRole);
  
  if (!storedUserRole) {
    console.error('Usertype not found in localStorage. Redirecting to login.');
    this.$router.push('/');
    return;
  }
  
  // Check if the userType matches 'instructor'
  if (storedUserRole.toLowerCase() !== 'instructor') {
    console.error('Usertype is not instructor. Redirecting to login.');
    this.$router.push('/');
    return;
  }
  
  // If userType is valid, proceed to fetch notifications
  console.log('Usertype is valid:', storedUserRole);
  this.isLoading = true;
  this.fetchNotifications();
},
  methods: {
    formatDate(dateString) {
  if (!dateString) return 'N/A'; // Handle invalid or missing dates

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
},
formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return 'N/A'; // Handle invalid or missing times

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
},
    
async fetchNotifications() {
  try {
    // Get the current instructor's email from localStorage
    const instructorEmail = localStorage.getItem('email');
    
    if (!instructorEmail) {
      console.error('Instructor email not found in localStorage');
      return;
    }
    
    console.log('Fetching notifications for instructor:', instructorEmail);
    
    // Get ALL answered bookings
    const { data: allBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('answered', true); // Retrieve bookings where answered = true

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }
    
    console.log('All answered bookings:', allBookings);
    
    // Filter bookings where the person field contains the instructor email
    const data = allBookings.filter(booking => {
      if (!booking.person) return false;
      
      // Check if the person field contains the instructor email or 'mcostillas'
      const personField = booking.person.toLowerCase();
      const currentEmail = instructorEmail.toLowerCase();
      
      return personField.includes(currentEmail) || personField.includes('mcostillas');
    });
    
    console.log(`Found ${data.length} notifications for instructor after filtering`);
    
    if (data.length === 0) {
      console.log('No notifications found for this instructor');
      // Clear any existing notifications
      this.notifications = [];
      localStorage.setItem('notifications', JSON.stringify([]));
      return;
    }

    // Map the booking data to notification format
    const bookingNotifications = data.map(booking => {
      // Calculate timeRange from startTime and endTime
      const timeRange = booking.startTime && booking.endTime ? 
        `${this.formatTime(booking.startTime)} - ${this.formatTime(booking.endTime)}` : 'Not specified';
      
      return {
        type: 'booking',
        title: `Your booking request for ${booking.selectedRoom} has been ${booking.status}`,
        message: `Your booking request for ${booking.selectedRoom} on ${booking.requestDate} from ${timeRange} has been ${booking.status}.`,
        time: this.getTimeAgo(booking.updated_at),
        selectedRoom: booking.selectedRoom,
        requestDate: booking.requestDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        person: booking.person || 'N/A',
        notedBy: booking.notedBy || 'N/A',
        read: false,
        statusClass: booking.status === 'approved' ? 'text-green' : 'text-red', // Add status class
        bookingId: booking.id, // Store the booking ID for reference
      };
    });

    // Save notifications to localStorage
    localStorage.setItem('notifications', JSON.stringify(bookingNotifications));

    // Load notifications into the component's state
    this.notifications = bookingNotifications;
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
  }
},
openNotificationModal(notification, index) {
  this.selectedNotification = {
    ...notification,
    selectedRoom: notification.selectedRoom || 'N/A',
    requestDate: notification.requestDate || 'N/A',
    timeRange: notification.timeRange || 'N/A',
    person: notification.person || 'N/A',
  };
  this.selectedNotificationIndex = index;
  this.showModal = true;

  // Mark as read when opened
  if (!this.notifications[index].read) {
    this.notifications[index].read = true;
  }

  // Add booking-modal class for booking notifications
  if (notification.type === 'booking') {
    setTimeout(() => {
      const modalContainer = document.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.classList.add('booking-modal');
      }
    }, 0);
  }
},
    closeModal() {
      this.showModal = false;
      this.selectedNotification = null;
      this.selectedNotificationIndex = -1;
      
      // Remove booking-modal class
      const modalContainer = document.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.classList.remove('booking-modal');
      }
    },
    handleAction(action) {
      if (!this.selectedNotification || this.selectedNotification.type !== 'booking') return;
      
      switch(action) {
        case 'confirm':
          // In a real app, this would call an API to confirm the booking
          console.log('Booking confirmed');
          if (this.selectedNotificationIndex !== -1) {
            this.notifications[this.selectedNotificationIndex].title = 'Booking Confirmed';
            this.notifications[this.selectedNotificationIndex].message = 
              this.notifications[this.selectedNotificationIndex].message.replace('has been requested', 'has been confirmed');
          }
          this.closeModal();
          break;
        case 'cancel':
          if (confirm('Are you sure you want to cancel this booking?')) {
            // In a real app, this would call an API
            console.log('Booking cancelled');
            if (this.selectedNotificationIndex !== -1) {
              this.notifications.splice(this.selectedNotificationIndex, 1);
            }
            this.closeModal();
          }
          break;
      }
    },
    setFilter(filter) {
      this.activeFilter = filter;
    },
    clearAllNotifications() {
  this.notifications = [];
  localStorage.removeItem('notifications'); // Clear notifications from localStorage
},
    deleteNotification(index) {
  // Remove the notification from the local state
  this.notifications.splice(index, 1);

  // Update localStorage
  localStorage.setItem('notifications', JSON.stringify(this.notifications));
},
    getOriginalIndex(notification) {
      return this.notifications.findIndex(n => n === notification);
    }
  }
}
</script>

<style scoped>
/* Notifications Container */
.notifications-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.notifications-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px;
  height: 100%;
}

/* Notification Filters */
.notification-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-button {
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background-color: #F8FAFC;
}

.filter-button.active {
  background-color: #DD3859;
  color: white;
  border-color: #DD3859;
}
.text-green {
  color: #22C55E; /* Green color for accepted bookings */
}

.text-red {
  color: #EF4444; /* Red color for declined bookings */
}

.clear-all-button {
  background: none;
  border: none;
  color: #DD3859;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.clear-all-button:hover {
  background-color: #FEF2F2;
}

/* No Notifications */
.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #64748B;
}

.empty-icon {
  margin-bottom: 16px;
}

/* Notification Cards */
.notification-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-card {
  background-color: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s ease;
}

.notification-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.notification-card.unread {
  border-left: 4px solid #DD3859;
}

.notification-item {
  display: flex;
  gap: 16px;
  width: calc(100% - 40px);
  cursor: pointer;
}

.notification-type {
  flex-shrink: 0;
}
/* Accepted Notification */
.notification-card.accepted {
  border-left: 4px solid #22C55E; /* Green border */
  background-color: #D1FAE5; /* Light green background */
}

/* Rejected Notification */
.notification-card.rejected {
  border-left: 4px solid #EF4444; /* Red border */
  background-color: #FEE2E2; /* Light red background */
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #64748B;
}

.notification-icon.booking {
  background-color: #DD3859;
}

.notification-icon.alert {
  background-color: #F59E0B;
}

.notification-details {
  flex-grow: 1;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 4px 0;
}

.notification-message {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.notification-time {
  font-size: 12px;
  color: #94A3B8;
}

.delete-notification-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-notification-button:hover {
  background-color: #F1F5F9;
}

/* Modal Styles */
.notification-modal-content {
  padding: 16px;
}

.modal-notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-notification-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #64748B;
}

.modal-notification-icon.booking {
  background-color: #DD3859;
}

.modal-notification-icon.alert {
  background-color: #F59E0B;
}

.modal-notification-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
}

.modal-notification-time {
  font-size: 14px;
  color: #94A3B8;
}

.modal-notification-body {
  margin-bottom: 24px;
}

.modal-notification-message {
  font-size: 16px;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 24px;
}

.modal-notification-details {
  background-color: #F8FAFC;
  border-radius: 8px;
  padding: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #E2E8F0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.modal-notification-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-action-button {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.modal-action-button.primary {
  background-color: #DD3859;
  color: white;
  border: none;
}

.modal-action-button.primary:hover {
  background-color: #C81E3C;
}

.modal-action-button.secondary {
  background-color: white;
  color: #DD3859;
  border: 1px solid #DD3859;
}

.modal-action-button.secondary:hover {
  background-color: #FEF2F2;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .notification-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .notification-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .notification-icon {
    margin-bottom: 8px;
  }
}
</style>
