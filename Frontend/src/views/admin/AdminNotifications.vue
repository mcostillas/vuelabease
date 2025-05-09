    <template>
  <DashboardLayout>
    <AdminHeader pageTitle="Notifications" />
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
            <button 
              class="filter-button" 
              :class="{ active: activeFilter === 'password_reset' }"
              @click="setFilter('password_reset')"
            >
              Password Resets
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
  :class="{ 'unread': !notification.read, 'highlighted': selectedNotification && selectedNotification === notification }"
>
  <div 
    class="notification-item" 
    @click="openNotificationModal(notification, getOriginalIndex(notification))"
  >
    <div class="notification-type">
      <div class="notification-icon" :class="notification.type">
        <svg v-if="notification.type === 'booking'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- Other icons for different notification types -->
      </div>
    </div>
    <div class="notification-details">
      <h3 class="notification-title">{{ notification.title }}</h3>
      <p class="notification-message">{{ notification.message }}</p>
      <span class="notification-time">{{ notification.time }}</span>
    </div>
  </div>
  <button 
    class="delete-notification-button" 
    @click.stop="deleteNotification(getOriginalIndex(notification))"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 6L18 18" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
        </div>
      </div>
    </div>
    
    <!-- Notification Modal -->
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
              <svg v-if="selectedNotification && selectedNotification.type === 'booking'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="selectedNotification && selectedNotification.type === 'alert'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="selectedNotification && selectedNotification.type === 'password_reset'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5V21H19V11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 7V11H7V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    <div class="detail-label">Laboratory</div>
    <div class="detail-value">{{ selectedNotification.selectedRoom }}</div>
  </div>
  <div class="detail-item">
    <div class="detail-label">Date</div>
    <div class="detail-value">{{ notificationDetails.requestDate }}</div>
  </div>
  <div class="detail-item">
    <div class="detail-label">Time</div>
    <div class="detail-value">
      {{ formatTime(notificationDetails.startTime) }} - {{ formatTime(notificationDetails.endTime) }}
    </div>
  </div>
  <div class="detail-item">
    <div class="detail-label">Requester</div>
    <div class="detail-value">{{ notificationDetails.requesterName }}</div>
  </div>
</div>
          
          <div v-if="selectedNotification && selectedNotification.type === 'password_reset'" class="modal-notification-details">
            <div class="detail-item">
              <div class="detail-label">Email</div>
              <div class="detail-value">{{ selectedNotification.email || 'Not provided' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Requested</div>
              <div class="detail-value">{{ selectedNotification.requestTime || selectedNotification.time }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value">{{ selectedNotification.status || 'Pending' }}</div>
            </div>
          </div>
        </div>
        
        <div class="modal-notification-actions">
          <button 
            v-if="selectedNotification && selectedNotification.type === 'password_reset'" 
            class="modal-action-button primary"
            @click="handlePasswordReset()"
          >
            Reset Password
          </button>
          
          <button 
    v-if="selectedNotification && selectedNotification.type === 'booking'" 
    class="modal-action-button primary"
    @click="viewBookingDetails()"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="white"/>
    </svg>
    View Booking
  </button>
        </div>
      </div>
    </Modal>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import Modal from '@/components/ui/Modal.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { useRouter } from 'vue-router'
import { createClient } from "@supabase/supabase-js";

const supabaseBookings = createClient(
  'https://bfmvnahlknvyrajofmdw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk'
);

export default {
  name: 'AdminNotifications',
  components: {
    DashboardLayout,
    Modal,
    AdminHeader
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      showModal: false,
      selectedNotification: null,
      notificationDetails: {}, // New variable for notification details
      selectedNotificationIndex: -1,
      activeFilter: 'all',
      notifications: [],
    }
  },
  computed: {
    hasUnreadNotifications() {
    return this.notifications.some(notification => !notification.read);
  },
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
        case 'password_reset':
          return this.notifications.filter(notification => notification.type === 'password_reset');
        default:
          return this.notifications;
      }
    }
  },
  mounted() {
    // Check for password reset requests in localStorage
    this.fetchNotifications(); // Fetch notifications on page load
    this.checkForPasswordResetRequests();
    this.notificationInterval = setInterval(() => {
    this.fetchNotifications();
  }, 5000); // Check every 60 seconds
  const savedNotifications = JSON.parse(localStorage.getItem('admin_notifications')) || [];
  this.notifications = savedNotifications.map(notification => ({
  ...notification,
  selectedRoom: notification.selectedRoom || 'N/A',
  requestDate: notification.requestDate || 'N/A',
  startTime: notification.startTime || 'N/A',
  endTime: notification.endTime || 'N/A',
  requesterName: notification.requesterName || 'Unknown',
}));
},
beforeUnmount() {
  // Clear the interval when the component is destroyed
  clearInterval(this.notificationInterval);
  },
  methods: {
    formatTime(time) {
    if (!time || typeof time !== "string") {
      return "Invalid Time"; // Handle undefined or invalid time
    }
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  },
    viewBookingDetails() {
    if (!this.selectedNotification || this.selectedNotification.type !== 'booking') return;

    // Log the selected notification for debugging
    console.log('Viewing booking details:', this.selectedNotification);

    // Redirect to Booking Management with the booking ID
    if (this.selectedNotification.bookingId) {
      this.$router.push({
        name: 'AdminBookings', // Replace with the actual route name for Booking Management
        query: { bookingId: this.selectedNotification.bookingId },
      });
    } else {
      console.error('Booking ID is missing in the selected notification.');
    }

    // Close the modal
    this.closeModal();
  },
  
  
  
    async fetchNotifications() {
  try {
    const { data, error } = await supabaseBookings
      .from('bookings')
      .select('*')
      .eq('notification_sent', false); // Fetch bookings where notification_sent is false

    if (error) throw error;

    console.log('Fetched bookings:', data); // Debug log

    const newNotifications = data.map(booking => ({
  type: 'booking',
  title: 'New Booking Request',
  message: `${booking.person} has requested to book ${booking.selectedRoom} on ${booking.requestDate} from ${this.formatTime(booking.startTime)} to ${this.formatTime(booking.endTime)}.`,
  selectedRoom: booking.selectedRoom || 'N/A', // Laboratory
  requestDate: booking.requestDate || 'N/A', // Date
  startTime: booking.startTime || 'N/A', // Start time
  endTime: booking.endTime || 'N/A', // End time
  requesterName: booking.person || 'Unknown', // Requester name
  time: new Date(booking.created_at).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }),
  read: false,
  bookingId: booking.id, // Booking ID
}));

    console.log('Mapped notifications:', newNotifications); // Debug log

    // Add the new notifications to the existing notifications array
    this.notifications = [...newNotifications, ...this.notifications];
    console.log('Notifications array:', this.notifications);

    // Save notifications to localStorage
    localStorage.setItem('admin_notifications', JSON.stringify(this.notifications));

    // Mark the bookings as "notification_sent" in the database
    const bookingIds = data.map(booking => booking.id);
    if (bookingIds.length > 0) {
      await supabaseBookings
        .from('bookings')
        .update({ notification_sent: true })
        .in('id', bookingIds);
    }

    console.log('Fetched notifications:', newNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
  }
},

openNotificationModal(notification, index) {
  console.log('Notification clicked:', JSON.stringify(notification, null, 2)); // Debug log

  // Assign the notification to selectedNotification
  this.selectedNotification = JSON.parse(JSON.stringify(notification));
  console.log('Selected notification:', JSON.stringify(this.selectedNotification, null, 2)); // Debug log

  // Populate notificationDetails with additional fields
  this.notificationDetails = {
    selectedRoom: notification.selectedRoom || 'N/A',
    requestDate: notification.requestDate || 'N/A',
    startTime: notification.startTime || 'N/A',
    endTime: notification.endTime || 'N/A',
    requesterName: notification.requesterName || 'Unknown',
  };

  this.selectedNotificationIndex = index;
  this.showModal = true;

  // Mark as read when opened
  if (!this.notifications[index].read) {
    this.notifications[index].read = true;
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
          alert('Booking approved!');
          this.notifications[this.selectedNotificationIndex].title = 'Booking Approved';
          this.notifications[this.selectedNotificationIndex].message = 
            this.notifications[this.selectedNotificationIndex].message.replace('requested to book', 'has been approved for');
          break;
        case 'reject':
          // In a real app, this would call an API to reject the booking
          alert('Booking rejected!');
          this.notifications[this.selectedNotificationIndex].title = 'Booking Rejected';
          this.notifications[this.selectedNotificationIndex].message = 
            this.notifications[this.selectedNotificationIndex].message.replace('requested to book', 'has been rejected for');
          break;
      }
      
      this.closeModal();
    },
    
    handlePasswordReset() {
      if (!this.selectedNotification || this.selectedNotification.type !== 'password_reset') return;
      
      // Mark notification as handled
      this.notifications[this.selectedNotificationIndex].status = 'processing';
      
      // Store the user ID to highlight in the User Management page
      if (this.selectedNotification.userid) {
        localStorage.setItem('highlight_user_id', this.selectedNotification.userid);
      }
      
      // Close the modal
      this.closeModal();
      
      // Navigate to the User Management page
      this.$router.push('/admin/users');
    },
    setFilter(filter) {
      this.activeFilter = filter;
    },
    clearAllNotifications() {
      this.notifications = [];
    },
    deleteNotification(index) {
      this.notifications.splice(index, 1);
    },
    getOriginalIndex(notification) {
      return this.notifications.findIndex(n => n === notification);
    },
    checkForPasswordResetRequests() {
      try {
        // Get password reset requests from localStorage
        const resetRequests = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        
        if (resetRequests.length > 0) {
          // Process each request and add to notifications if not already added
          resetRequests.forEach(request => {
            if (request.type === 'password_reset') {
              // Check if this notification already exists
              const exists = this.notifications.some(
                n => n.type === 'password_reset' && n.email === request.email && 
                     n.requestTime === new Date(request.timestamp).toLocaleString()
              );
              
              if (!exists) {
                // Format the timestamp
                const requestDate = new Date(request.timestamp);
                const formattedDate = requestDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = requestDate.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                });
                
                // Calculate relative time for display
                const now = new Date();
                const diffMs = now - requestDate;
                const diffMins = Math.round(diffMs / 60000);
                const diffHours = Math.round(diffMs / 3600000);
                const diffDays = Math.round(diffMs / 86400000);
                
                let relativeTime;
                if (diffMins < 60) {
                  relativeTime = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                } else if (diffHours < 24) {
                  relativeTime = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else {
                  relativeTime = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                }
                
                // Add to notifications
                this.notifications.unshift({
                  type: 'password_reset',
                  title: 'Password Reset Request',
                  message: `A user has requested to reset their password. Please review and contact them to provide a new password.`,
                  email: request.email,
                  requestTime: `${formattedDate} at ${formattedTime}`,
                  time: relativeTime,
                  status: request.status || 'Pending',
                  read: false
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error processing password reset requests:', error);
      }
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
.notification-card.highlighted {
  border: 2px solid #DD3859; /* Highlight border color */
  background-color: #FEF2F2; /* Light background color for emphasis */
  box-shadow: 0 4px 8px rgba(221, 56, 89, 0.2); /* Subtle shadow for focus */
  transform: scale(1.02); /* Slightly enlarge the card */
  transition: all 0.2s ease; /* Smooth transition for the effect */
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

.notification-icon.password_reset {
  background-color: #3498db;
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

.modal-notification-icon.password_reset {
  background-color: #3498db;
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
