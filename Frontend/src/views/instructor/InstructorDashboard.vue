<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Dashboard" />
    <div class="dashboard-content">
      <div class="booking-overview">
        <h2>Booking Overview</h2>
        <div class="booking-cards">
          <div class="booking-card">
            <div class="booking-info">
              <div class="booking-text">
                <h3>Pending Bookings</h3>
                <p>8</p>
              </div>
              <div class="booking-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 14H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 14H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 14H16.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 18H8.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 18H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 18H16.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="booking-card">
            <div class="booking-info">
              <div class="booking-text">
                <h3>Confirmed Bookings</h3>
                <p>2</p>
              </div>
              <div class="booking-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="booking-card">
            <div class="booking-info">
              <div class="booking-text">
                <h3>Cancelled Bookings</h3>
                <p>2</p>
              </div>
              <div class="booking-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="room-availability">
        <h2>Room Availability</h2>
        <div class="room-grid">
          <div class="room-card available">
            <div class="room-info">
              <div class="room-text">
                <h3>L201</h3>
              </div>
              <span class="status-badge">Available</span>
            </div>
          </div>
          <div class="room-card in-use">
            <div class="room-info">
              <div class="room-text">
                <h3>L202</h3>
              </div>
              <span class="status-badge">In Use</span>
            </div>
          </div>
          <div class="room-card available">
            <div class="room-info">
              <div class="room-text">
                <h3>L203</h3>
              </div>
              <span class="status-badge">Available</span>
            </div>
          </div>
          <div class="room-card maintenance">
            <div class="room-info">
              <div class="room-text">
                <h3>L204</h3>
              </div>
              <span class="status-badge">Maintenance</span>
            </div>
          </div>
          <div class="room-card available">
            <div class="room-info">
              <div class="room-text">
                <h3>L205</h3>
              </div>
              <span class="status-badge">Available</span>
            </div>
          </div>
          <div class="room-card in-use">
            <div class="room-info">
              <div class="room-text">
                <h3>Open Laboratory</h3>
              </div>
              <span class="status-badge">In Use</span>
            </div>
          </div>
          <div class="room-card available">
            <div class="room-info">
              <div class="room-text">
                <h3>IOT Lab</h3>
              </div>
              <span class="status-badge">Available</span>
            </div>
          </div>
        </div>
      </div>

      <div class="schedule-section">
        <h2>Today's Schedule</h2>
        <div class="schedule-header">
          <div class="header-item">Time Slot</div>
          <div class="header-item">Purpose</div>
          <div class="header-item">Section</div>
          <div class="header-item">Lab, Room No.</div>
        </div>
        <div class="schedule-cards">
          <div class="schedule-card">
            <div class="schedule-item">
              <div class="time-slot">9:00 am - 12:00 am</div>
              <div class="purpose">Web Applications Development</div>
              <div class="section">CCS-2A</div>
              <div class="room">L201</div>
            </div>
          </div>
          <div class="schedule-card">
            <div class="schedule-item">
              <div class="time-slot">9:00 am - 12:00 am</div>
              <div class="purpose">Data Structures and Algorithms</div>
              <div class="section">CCS-2B</div>
              <div class="room">L202</div>
            </div>
          </div>
          <div class="schedule-card">
            <div class="schedule-item">
              <div class="time-slot">1:00 pm - 4:00 pm</div>
              <div class="purpose">Database Management Systems</div>
              <div class="section">CCS-2C</div>
              <div class="room">L205</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import InstructorHeader from '@/components/instructor/InstructorHeader.vue'

export default {
  name: 'InstructorDashboard',
  components: {
    DashboardLayout,
    InstructorHeader
  },
  data() {
    return {
      isDropdownOpen: false
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    handleLogout() {
      localStorage.removeItem('labease_auth_token')
      localStorage.removeItem('labease_user_data')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Dashboard Header */
.dashboard-header {
  background-color: #FFFFFF;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  margin: 24px;
  padding: 24px;
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.welcome-section h1 {
  color: #99183A;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  font-size: 14px;
}

.date-separator {
  color: #DD3859;
  font-weight: 600;
}

.user-section {
  position: relative;
}

.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(221, 56, 89, 0.05);
}

.dropdown-icon {
  margin-left: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  margin-top: 4px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #1E293B;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #F8F9FA;
}

.logout-text {
  color: #DD3859;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #1E293B;
}

/* Booking Overview */
.booking-overview {
  background-color: #FFF1F3;
  border: 0.5px solid #DD3859;
  border-radius: 16px;
  padding: 24px;
  margin: 24px;
}

.booking-overview h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.booking-cards {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.booking-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #DD3859;
  padding: 16px;
  flex: 1;
  min-width: 200px;
}

.booking-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-text h3 {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  margin-bottom: 4px;
}

.booking-text p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.booking-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #DD3859;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.booking-card:hover .booking-icon {
  transform: scale(1.05);
}

/* Room Availability Section */
.room-availability {
  border-radius: 16px;
  padding: 24px;
  margin: 24px;
  box-shadow: none;
}

.room-availability h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: left;
}

.room-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.room-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.2s ease;
  flex: 0 0 auto;
  width: 180px;
  text-align: left;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.room-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.room-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.room-text h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
}

.room-card.available .status-badge {
  background-color: #ECFDF3;
  color: #039855;
}

.room-card.in-use .status-badge {
  background-color: #FEF3F2;
  color: #D92D20;
}

.room-card.maintenance .status-badge {
  background-color: #FFF8E1;
  color: #F59E0B;
}

/* Schedule Section */
.schedule-section {
  border-radius: 16px;
  padding: 24px;
  margin: 24px;
}

.schedule-section h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.schedule-header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #FFF1F3;
  border: 1px solid #99183A;
  border-radius: 8px;
  margin-bottom: 16px;
}

.header-item {
  color: #DD3859;
  font-size: 14px;
  font-weight: 500;
}

.schedule-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.schedule-card {
  background: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.schedule-item {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.time-slot {
  color: #DD3859;
  font-weight: 500;
  font-size: 14px;
}

.purpose {
  color: #1E293B;
  font-weight: 500;
  font-size: 14px;
}

.section {
  color: #64748B;
  font-size: 14px;
}

.room {
  color: #64748B;
  font-size: 14px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 0;
  }
  
  .booking-cards {
    flex-direction: column;
  }
  
  .room-grid {
    flex-direction: column;
  }
  
  .schedule-header, .schedule-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px;
  }
  
  .header-item {
    display: none;
  }
  
  .schedule-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
