<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Dashboard" />
    <div class="dashboard-content">
      <!-- Overview Section -->
      <div class="overview-section">
        <h2>Overview</h2>
        <div class="overview-layout">
          <!-- Left Column: Stats Cards -->
          <div class="overview-column stats-column">
            <div class="stats-cards-container">
              <div class="stats-card">
                <div class="stats-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stats-content">
                  <div class="stats-value">{{ dashboardStats.totalBookings }}</div>
                  <div class="stats-label">Total Bookings</div>
                </div>
              </div>
              <div class="stats-card">
                <div class="stats-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="stats-content">
                  <div class="stats-value">{{ dashboardStats.averageUsage }}%</div>
                  <div class="stats-label">Average Usage</div>
                </div>
              </div>
              <div class="stats-card">
                <div class="stats-icon">
                  <i class="fas fa-door-open"></i>
                </div>
                <div class="stats-content">
                  <div class="stats-value">{{ dashboardStats.mostUsedRoom }}</div>
                  <div class="stats-label">Most Used Room</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Laboratory Usage This Week -->
          <div class="overview-column usage-column">
            <div class="lab-usage">
              <div class="usage-header">
                <h3>Laboratory Usage This Week</h3>
              </div>
              <div class="lab-cards-container">
                <div class="lab-card" v-for="room in rooms" :key="room.id">
                  <div class="lab-name">{{ room.id }}</div>
                  <div class="lab-value">{{ room.usage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Availability Section -->
      <div class="room-availability-section">
        <h2>Room Availability</h2>
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

      <!-- Data Sections Container -->
      <div class="data-sections-container">
        <!-- Laboratory Sessions Today -->
        <div class="sessions-section">
          <h2>Laboratory Sessions Today</h2>
          <div class="sessions-header">
            <div class="header-item">Instructor</div>
            <div class="header-item">Time Slot</div>
            <div class="header-item">Purpose</div>
            <div class="header-item">Section</div>
            <div class="header-item">Lab. Room No.</div>
          </div>
          <div class="sessions-cards">
            <div class="session-card" v-for="session in sessions" :key="session.instructor">
              <div class="session-item">
                <div class="instructor">{{ session.instructor }}</div>
                <div class="time-slot">{{ session.timeSlot }}</div>
                <div class="purpose">{{ session.purpose }}</div>
                <div class="section">{{ session.section }}</div>
                <div class="room">{{ session.room }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings Section -->
        <div class="bookings-section">
          <h2>Bookings</h2>
          <div class="bookings-header">
            <div class="header-item">Name</div>
            <div class="header-item">Date</div>
            <div class="header-item">Time</div>
            <div class="header-item">Room</div>
            <div class="header-item">Status</div>
          </div>
          <div class="bookings-cards">
            <div class="booking-card" v-for="booking in bookings" :key="booking.id">
              <div class="booking-item">
                <div class="name">{{ booking.name }}</div>
                <div class="date">{{ booking.date }}</div>
                <div class="time">{{ booking.time }}</div>
                <div class="room">{{ booking.room }}</div>
                <div class="status">
                  <span :class="['status-badge', booking.status.toLowerCase()]">
                    {{ booking.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

export default {
  name: 'AdminDashboard',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      rooms: [
        { id: '201', usage: 4 },
        { id: '202', usage: 3 },
        { id: '203', usage: 5 },
        { id: '204', usage: 3 },
        { id: '205', usage: 2 },
        { id: 'Open Lab', usage: 6 },
        { id: 'IOT Lab', usage: 4 }
      ],
      roomAvailability: [
        { name: 'L201', status: 'In Use', instructor: 'Clyde Balaman', time: '9:00 AM - 12:00 PM', purpose: 'Web Development', nextBooking: 'March 15, 2025' },
        { name: 'L202', status: 'Available', nextBooking: 'March 16, 2025' },
        { name: 'L203', status: 'In Use', instructor: 'Rogelio Badiang', time: '1:00 PM - 4:00 PM', purpose: 'Database Systems' },
        { name: 'L204', status: 'Available', nextBooking: 'March 17, 2025' },
        { name: 'L205', status: 'In Use', instructor: 'Shena Cloribel', time: '4:00 PM - 7:00 PM', purpose: 'Network Security' },
        { name: 'Open Laboratory', status: 'Available', nextBooking: 'March 18, 2025' },
        { name: 'IOT Lab', status: 'In Use', instructor: 'Nannette Casquejo', time: '9:00 AM - 12:00 PM', purpose: 'IOT Development' }
      ],
      sessions: [
        {
          instructor: 'Clyde Balaman',
          timeSlot: '9:00 AM - 12:00 PM',
          purpose: 'Web Development',
          section: 'BSIT-3A',
          room: 'L201'
        },
        {
          instructor: 'Rogelio Badiang',
          timeSlot: '1:00 PM - 4:00 PM',
          purpose: 'Database Systems',
          section: 'BSIT-2B',
          room: 'L202'
        },
        {
          instructor: 'Shena Cloribel',
          timeSlot: '4:00 PM - 7:00 PM',
          purpose: 'Network Security',
          section: 'BSIT-4A',
          room: 'L203'
        }
      ],
      bookings: [
        {
          id: 1,
          name: 'Maria Garcia',
          date: 'March 14, 2025',
          time: '9:00 AM - 12:00 PM',
          room: 'L201',
          status: 'Approved'
        },
        {
          id: 2,
          name: 'James Wilson',
          date: 'March 14, 2025',
          time: '1:00 PM - 4:00 PM',
          room: 'L202',
          status: 'Pending'
        },
        {
          id: 3,
          name: 'Sarah Thompson',
          date: 'March 14, 2025',
          time: '4:00 PM - 7:00 PM',
          room: 'L203',
          status: 'Rejected'
        },
        {
          id: 4,
          name: 'Michael Brown',
          date: 'March 15, 2025',
          time: '9:00 AM - 12:00 PM',
          room: 'L201',
          status: 'Approved'
        },
        {
          id: 5,
          name: 'Emily Davis',
          date: 'March 15, 2025',
          time: '1:00 PM - 4:00 PM',
          room: 'L204',
          status: 'Pending'
        }
      ],
      dashboardStats: {
        totalBookings: 0,
        averageUsage: 0,
        mostUsedRoom: ''
      }
    }
  },
  methods: {
    calculateDashboardStats() {
      // Calculate total bookings from sessions
      const totalBookings = this.sessions.length;
      
      // Calculate average usage based on room data
      let totalUsage = 0;
      this.rooms.forEach(room => {
        totalUsage += room.usage; // Usage is already a number
      });
      const averageUsage = Math.round(totalUsage / this.rooms.length);
      
      // Find most frequently used room
      let roomUsage = {};
      this.rooms.forEach(room => {
        roomUsage[room.id] = room.usage; // Usage is already a number
      });
      
      // Sort rooms by usage and get the highest
      const mostUsedRoom = Object.keys(roomUsage).reduce((a, b) => roomUsage[a] > roomUsage[b] ? a : b);
      
      // Update dashboard stats
      this.dashboardStats = {
        totalBookings,
        averageUsage,
        mostUsedRoom
      };
    }
  },
  mounted() {
    this.calculateDashboardStats();
  }
}
</script>

<style scoped>
.dashboard-content {
  padding: 20px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

/* Overview Section */
.overview-section {
  margin-bottom: 30px;
  padding: 24px;
}

.overview-section h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.overview-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.overview-column {
  flex: 1;
  min-width: 300px;
}

.stats-column {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.usage-column {
  flex: 1;
  min-width: 300px;
}

.stats-cards-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
}

.stats-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-left: 4px solid #DD3859;
  flex: 1;
  min-width: 200px;
}

.stats-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  background-color: #FFF1F3;
  color: #DD3859;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
  flex-shrink: 0;
}

.stats-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.lab-usage {
  background-color: #FFF1F3;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  min-height: 200px;
}

.usage-header {
  margin-bottom: 16px;
}

.usage-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #99183A;
}

.lab-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lab-card {
  background-color: white;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lab-name {
  font-weight: 500;
  color: #333;
}

.lab-value {
  font-weight: 600;
  color: #DD3859;
}

/* Room Availability Section */
.room-availability-section {
  margin-bottom: 30px;
  padding: 24px;
  margin: 24px;
  width: 100%;
}

.room-availability-section h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: left;
}

.room-availability-container {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  margin: 0;
  width: 100%;
}

.room-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 15px;
  justify-content: flex-start;
  width: 100%;
}

.room-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 0 0 auto;
  width: 180px;
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

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 10px;
}

/* Data Sections Container */
.data-sections-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0 24px;
}

.data-sections-container > div {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
}

.sessions-section, .bookings-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #DD3859;
}

.sessions-section:hover, .bookings-section:hover {
  transform: none;
  box-shadow: none;
}

.sessions-section h2, .bookings-section h2 {
  color: #99183A;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.sessions-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 2fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #FFF1F3;
  border: 1px solid #99183A;
  border-radius: 8px;
  margin-bottom: 16px;
}

.sessions-header .header-item {
  color: #DD3859;
  font-size: 14px;
  font-weight: 500;
}

.sessions-cards, .bookings-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #DD3859 #f5f5f5;
  max-height: calc(3 * 54px); /* Height for 3 cards (16px padding top/bottom + 14px font + margin) */
}

.sessions-cards::-webkit-scrollbar, .bookings-cards::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sessions-cards::-webkit-scrollbar-track, .bookings-cards::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.sessions-cards::-webkit-scrollbar-thumb, .bookings-cards::-webkit-scrollbar-thumb {
  background-color: #DD3859;
  border-radius: 10px;
}

.session-card, .booking-card {
  background: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 5px;
  height: 56px; /* Fixed height for consistent card shape */
  display: flex;
  align-items: center;
}

.session-item, .booking-item {
  display: grid;
  align-items: center;
  width: 100%;
}

.session-item {
  grid-template-columns: 1fr 1.5fr 2fr 1fr 1fr;
  gap: 16px;
}

.booking-item {
  grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr;
  gap: 16px;
}

.session-item div, .booking-item div {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Bookings Section */
.bookings-section {
  border-radius: 16px;
  padding: 24px;
  margin: 0;
}

.bookings-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #FFF1F3;
  border: 1px solid #99183A;
  border-radius: 8px;
  margin-bottom: 16px;
}

.bookings-header .header-item {
  color: #DD3859;
  font-size: 14px;
  font-weight: 500;
}

.booking-card {
  background: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  margin-bottom: 5px;
}

.booking-item {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.booking-item div {
  font-size: 14px;
  color: #333;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  display: inline-block;
}

.status-badge.pending {
  background-color: #FFF8E1;
  color: #F59E0B;
}

.status-badge.approved {
  background-color: #ECFDF3;
  color: #039855;
}

.status-badge.rejected {
  background-color: #FEF3F2;
  color: #D92D20;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-container {
    flex-direction: column;
  }
  
  .lab-cards-container {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .data-sections-container {
    flex-direction: column;
  }
  
  .data-sections-container > div {
    margin-bottom: 20px;
  }
}
</style>
