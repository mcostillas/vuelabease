<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Dashboard" />
    <div class="dashboard-content">
      <div class="overview-section">
        <div class="section-header-main">
          <h2>Overview</h2>
          <div class="date-display">
            <i class="fas fa-calendar-alt"></i>
            <span>{{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2V6" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 2V6" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">8</div>
              <div class="metric-label">Pending Bookings</div>
              <div class="metric-trend positive">
                +12% from last week
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">2</div>
              <div class="metric-label">Confirmed Bookings</div>
              <div class="metric-trend negative">
                -5% from last week
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">2</div>
              <div class="metric-label">Cancelled Bookings</div>
              <div class="metric-detail">
                No change from last week
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 14L11 10L15 14L21 8" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">12</div>
              <div class="metric-label">Total Bookings</div>
              <div class="metric-trend positive">
                +8% from last week
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Availability Section -->
      <div class="room-availability-section">
        <h2 class="section-title">Room Availability</h2>
        <div class="room-availability-container">
          <div class="room-cards-container">
            <div class="room-card" v-for="room in roomAvailability" :key="room.name">
              <div class="room-info">
                <div class="room-name">{{ room.name }}</div>
                <div class="room-status" :class="room.status === 'Available' ? 'available' : 'in-use'">
                  {{ room.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Schedule Section -->
      <div class="sessions-section">
        <div class="section-title-container">
          <h2 class="section-title">Today's Schedule</h2>
        </div>
        <div class="sessions-header">
          <div class="header-item">Time Slot</div>
          <div class="header-item">Purpose</div>
          <div class="header-item">Section</div>
          <div class="header-item">Lab, Room No.</div>
        </div>
        <div class="sessions-cards">
          <div class="session-card">
            <div class="session-item">
              <div class="time-slot">9:00 am - 12:00 am</div>
              <div class="purpose">Web Applications Development</div>
              <div class="section">CCS-2A</div>
              <div class="room">L201</div>
            </div>
          </div>
          <div class="session-card">
            <div class="session-item">
              <div class="time-slot">9:00 am - 12:00 am</div>
              <div class="purpose">Data Structures and Algorithms</div>
              <div class="section">CCS-2B</div>
              <div class="room">L202</div>
            </div>
          </div>
          <div class="session-card">
            <div class="session-item">
              <div class="time-slot">1:00 pm - 4:00 pm</div>
              <div class="purpose">Database Management Systems</div>
              <div class="section">CCS-2C</div>
              <div class="room">L205</div>
            </div>
          </div>
          <div class="session-card">
            <div class="session-item">
              <div class="time-slot">3:00 pm - 6:00 pm</div>
              <div class="purpose">Mobile Application Development</div>
              <div class="section">CCS-3A</div>
              <div class="room">L203</div>
            </div>
          </div>
          <div class="session-card">
            <div class="session-item">
              <div class="time-slot">6:00 pm - 9:00 pm</div>
              <div class="purpose">Computer Networks</div>
              <div class="section">CCS-3B</div>
              <div class="room">L204</div>
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
      roomAvailability: [
        { name: 'L201', status: 'Available' },
        { name: 'L202', status: 'In Use' },
        { name: 'L203', status: 'Available' },
        { name: 'L204', status: 'In Use' },
        { name: 'L205', status: 'Available' },
        { name: 'Open Laboratory', status: 'In Use' },
        { name: 'IOT Lab', status: 'Available' }
      ],
      todaySchedule: [
        { timeSlot: '9:00 am - 12:00 am', purpose: 'Web Applications Development', section: 'CCS-2A', room: 'L201' },
        { timeSlot: '9:00 am - 12:00 am', purpose: 'Data Structures and Algorithms', section: 'CCS-2B', room: 'L202' },
        { timeSlot: '1:00 pm - 4:00 pm', purpose: 'Database Management Systems', section: 'CCS-2C', room: 'L205' },
        { timeSlot: '3:00 pm - 6:00 pm', purpose: 'Mobile Application Development', section: 'CCS-3A', room: 'L203' },
        { timeSlot: '6:00 pm - 9:00 pm', purpose: 'Computer Networks', section: 'CCS-3B', room: 'L204' }
      ],
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

/* Overview Section */
.overview-section {
  margin-bottom: 30px;
  width: 100%;
  padding: 0;
  background-color: transparent;
}

.section-header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 24px;
}

.overview-section h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  background-color: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 30px;
  width: 100%;
  padding: 0 24px;
}

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #DD3859;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #FFF1F3;
  color: #DD3859;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.metric-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
}

.metric-trend {
  font-size: 13px;
  font-weight: 500;
  color: #22c55e;
}

.metric-trend.positive {
  color: #22c55e;
}

.metric-trend.negative {
  color: #ef4444;
}

.metric-detail {
  font-size: 13px;
  color: #666;
  font-weight: 400;
}

/* Room Availability Section */
.room-availability-section {
    margin-bottom: 30px;
    padding: 0;
    margin: 24px;
  }
  
  .section-title-container {
    background-color: white;
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
    margin: -24px -24px 20px -24px;
  }
  
  .section-title {
    color: #99183A;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    text-align: left;
  }
  
  .room-availability-container {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin: 0;
  }
  
  .room-cards-container {
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    margin-top: 15px;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
    justify-content: space-between;
  }
  
  .room-card {
    background-color: white;
    border: 1px solid #e0e0e0;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    flex: 1 1 0;
    min-width: 150px;
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .room-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    text-align: left;
    width: 100%;
  }
  
  .room-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  
  .room-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
    text-align: left;
    margin-top: 8px;
  }
  
  .room-status.available {
    background-color: #e6f7e6;
    color: #22c55e;
  }
  
  .room-status.in-use {
    background-color: #f1f1f1;
    color: #6b7280;
  }
  

/* Sessions Section */
.sessions-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin: 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.section-title-container {
  margin-bottom: 20px;
}

.sessions-header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #DD3859;
  border-radius: 8px;
  margin-bottom: 16px;
}

.sessions-header .header-item {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.sessions-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #DD3859 #f5f5f5;
  max-height: calc(4 * 60px); /* Height for 4 cards */
}

.sessions-cards::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sessions-cards::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.sessions-cards::-webkit-scrollbar-thumb {
  background-color: #DD3859;
  border-radius: 10px;
}

.session-card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
  height: 56px; /* Fixed height for consistent card shape */
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.session-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.session-item {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.session-item div {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
