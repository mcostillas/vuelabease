<template>
    <DashboardLayout :userRole="Admin">
      <AdminHeader pageTitle="Dashboard" />
      <div class="dashboard-content">
        <!-- Overview Section -->
        <div class="overview-section">
          <div class="section-header-main">
            <h2>Overview</h2>
            <div class="date-display">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ currentDate }}</span>
            </div>
          </div>
          
          <!-- Key Metrics Cards -->
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
                <div class="metric-value">{{ dashboardStats.totalBookings }}</div>
                <div class="metric-label">Total Bookings</div>
                <div class="metric-trend positive">
                  +12% from last month
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
                <div class="metric-value">{{ dashboardStats.totalUsage }} hours</div>
                <div class="metric-label">Total Usage Hours</div>
                <div class="metric-trend positive">
                  +{{ dashboardStats.usageGrowth }} hours from last week
                </div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 7H7" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 14H7" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 4H10C9.44772 4 9 4.44772 9 5V21H18V5C18 4.44772 17.5523 4 17 4Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 21V17" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 13H14.01" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14 9H14.01" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ dashboardStats.mostUsedRoom }}</div>
                <div class="metric-label">Most Used Room</div>
                <div class="metric-detail">
                  5 days this week
                </div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="metric-content">
                <div class="metric-value">{{ scheduleCount.filtered }}</div>
                <div class="metric-label">Active Sessions</div>
                <div class="metric-detail">
                  Today
                </div>
              </div>
            </div>
          </div>
          
          <!-- Laboratory Usage Section -->
          <div class="usage-section">
            <div class="section-header">
              <h3>Laboratory Usage</h3>
              <div class="section-actions">
                <div class="filter-container">
                  <select v-model="timePeriodFilter" class="filter-select">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="semester">This Semester</option>
                  </select>
                  <select v-model="usageFilter" class="filter-select">
                    <option value="all">All Labs</option>
                    <option value="high">High Usage (4+)</option>
                    <option value="medium">Medium Usage (2-3)</option>
                    <option value="low">Low Usage (0-1)</option>
                  </select>
                  <button class="action-button">
                    <i class="fas fa-download"></i> Export
                  </button>
                </div>
              </div>
            </div>
            <div class="usage-bars">
              <div class="usage-bar-item" v-for="room in filteredRooms" :key="room.id">
                <div class="usage-bar-header">
                  <div class="usage-name">Lab {{ room.id }}</div>
                  <div class="usage-value">{{ room.usage }} times</div>
                </div>
                <div class="usage-bar-container">
                  <div class="usage-bar" 
                       :style="{ width: (room.usage / getMaxRoomUsage() * 100) + '%' }"></div>
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
        <div class="day-selector">
  <button 
    v-for="day in ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" 
    :key="day" 
    @click="selectedDay = day"
    :class="{ active: selectedDay === day }"
    class="day-button"
  >
    {{ day }}
  </button>
</div>
        <!-- Data Sections Container -->
        <div class="data-sections-container">
          <!-- Laboratory Sessions Today -->
          <div class="sessions-section">
            <div class="section-title-container">
              <h2 class="section-title">Laboratory Sessions Today</h2>
            </div>
            <div class="sessions-header">
              <div class="header-item">Instructor</div>
              <div class="header-item">Time Slot</div>
              <div class="header-item">Purpose</div>
              <div class="header-item">Section</div>
              <div class="header-item">Lab. Room No.</div>
            </div>
            <div class="sessions-cards">
  <div class="session-card" v-for="schedule in filteredScheduleData" :key="schedule.id">
    <div class="session-item">
      <div class="instructor">{{ schedule.instructorName }}</div>
      <div class="time-slot">{{ schedule.startTime }} - {{ schedule.endTime }}</div>
      <div class="purpose">{{ schedule.courseName }}</div>
      <div class="section">{{ schedule.section }}</div>
      <div class="room">{{ schedule.labRoom }}</div>
    </div>
  </div>

  <div v-if="scheduleData.length === 0" class="empty-sessions">
    <p>No schedules available.</p>
  </div>
</div>
          </div>
  
          <!-- Bookings Section -->
          <div class="bookings-section">
            <div class="section-title-container">
              <h2 class="section-title">Bookings</h2>
            </div>
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
      <div class="name">{{ booking.event }}</div>
      <div class="date">{{ booking.requestDate }}</div>
      <div class="time">{{ booking.startTime }} - {{ booking.endTime }}</div>
      <div class="room">{{ booking.selectedRoom }}</div>
      <div class="status">
        <span :class="['status-badge', booking.status.toLowerCase()]">
          {{ booking.status }}
        </span>
      </div>
    </div>
  </div>

  <div v-if="bookings.length === 0" class="empty-bookings">
    <p>No bookings available.</p>
  </div>
</div>
            </div>
          </div>
        </div>
      
    </DashboardLayout>
  </template>
  
  <script>
  /* eslint-disable */
  import DashboardLayout from '@/components/layout/DashboardLayout.vue'
  import AdminHeader from '@/components/admin/AdminHeader.vue'
  import { createClient } from "@supabase/supabase-js";

  const supabaseBookings = createClient(
  'https://bfmvnahlknvyrajofmdw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk'
);

const supabaseSchedules = createClient(
  'https://yfiyhsazgjsxjmybsyar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXloc2F6Z2pzeGpteWJzeWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE5MzEsImV4cCI6MjA1ODQ1NzkzMX0.j7oFwaqYvJq45jhPuQBPEtNU-itU-CRleOJcqm1fOOo'
);

  export default {
    name: 'AdminDashboard',
    components: {
      DashboardLayout,
      AdminHeader
    },
    data() {
      return {
        selectedDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }), // Default to today's day
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
          { name: 'L201', status: 'Available' },
          { name: 'L202', status: 'In Use' },
          { name: 'L203', status: 'Available' },
          { name: 'L204', status: 'In Use' },
          { name: 'L205', status: 'Available' },
          { name: 'Open Lab', status: 'In Use' },
          { name: 'IOT Lab', status: 'Available' }
        ],
        sessions: [],
        scheduleCount: {
      total: 0, // Total count of schedules
      filtered: 0, // Count of schedules for the selected day
    },
    
        scheduleData: [], // To store the fetched schedules
        dashboardStats: {
          totalBookings: 0,
          averageUsage: 0,
          totalUsage: 120,
          usageGrowth: 15,
          mostUsedRoom: '',
          bookingTrend: 5,
          activeInstructors: 4,
          totalInstructors: 6
        },
        bookings: [],
        usageFilter: 'all',
        timePeriodFilter: 'week',
        currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      }
    },
    methods: {
      checkRoomAvailability() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Group schedules by room for the current day
  const schedulesByRoom = this.scheduleData
    .filter(schedule => schedule.day === currentDay || schedule.second_day === currentDay) // Check both `day` and `second_day`
    .reduce((acc, schedule) => {
      acc[schedule.lab_room] = acc[schedule.lab_room] || [];
      acc[schedule.lab_room].push(schedule);
      return acc;
    }, {});

  // Iterate through each room and check if it is in use
  this.roomAvailability = this.roomAvailability.map(room => {
    const schedules = schedulesByRoom[room.name] || [];

    // Check if the current time falls within any schedule for this room
    const isInUse = schedules.some(schedule => {
      const [startHour, startMinutes] = schedule.start_time.split(':').map(Number);
      const [endHour, endMinutes] = schedule.end_time.split(':').map(Number);

      const startTime = startHour * 60 + startMinutes;
      const endTime = endHour * 60 + endMinutes;
      const currentTimeInMinutes = currentHour * 60 + currentMinutes;

      return currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime;
    });

    // Update the room status
    return {
      ...room,
      status: isInUse ? 'In Use' : 'Available',
    };
  });
},
      async fetchBookings() {
  try {
    const { data, error } = await supabaseBookings
      .from('bookings')
      .select('*'); // Fetch all columns from the bookings table

    if (error) throw error;

    // Map the fetched data to the bookings array
    this.bookings = data
      .map(booking => ({
        id: booking.id,
        createdat: booking.created_at, // Ensure this matches the column name in your database
        event: booking.event, // Ensure this matches the column name in your database
        requestDate: booking.requestDate, // Ensure this matches the column name in your database
        startTime: booking.startTime, // Ensure this matches the column name in your database
        endTime: booking.endTime, // Ensure this matches the column name in your database
        selectedRoom: booking.selectedRoom, // Ensure this matches the column name in your database
        status: booking.status, // Ensure this matches the column name in your database
      }))
      .sort((a, b) => new Date(b.createdat) - new Date(a.createdat)); // Sort by createdat (latest to oldest)

    console.log('Fetched and sorted bookings:', this.bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
  }
},
async fetchSchedules() {
  try {
    const { data, error } = await supabaseSchedules
      .from('schedules')
      .select('*'); // Fetch all columns from the schedules table

    if (error) throw error;

    // Map the fetched data to the scheduleData array
    this.scheduleData = data.map(schedule => ({
      id: schedule.id,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      instructorName: schedule.instructor_name,
      courseName: schedule.course_name,
      section: schedule.section,
      labRoom: schedule.lab_room,
      day: schedule.day, // Ensure this matches the column name in your database
    }));

    // Update the total count of schedules
    this.scheduleCount.total = this.scheduleData.length;

    console.log('Fetched scheduleData:', this.scheduleData);
    console.log('Total schedules:', this.scheduleCount.total);
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
  }
},
      async fetchTotalBookings() {
    try {
      // eslint-disable-next-line no-unused-vars
      const { data, error, count } = await supabaseBookings
        .from('bookings')
        .select('*', { count: 'exact' }); // Fetch all rows and get the total count

      if (error) throw error;

      // Update the total bookings in dashboardStats
      this.dashboardStats.totalBookings = count || 0;

      console.log('Total bookings fetched:', count);
    } catch (error) {
      console.error('Error fetching total bookings:', error.message);
    }
  },
  calculateDashboardStats() {
  // Ensure sessions and bookings are defined
  const totalBookings = (this.sessions?.length || 0) + (this.bookings?.length || 0);

  // Calculate total and average usage based on room data
  let totalUsage = 0;
  this.rooms.forEach((room) => {
    totalUsage += room.usage; // Usage is already a number
  });
  const averageUsage = Math.round(totalUsage / this.rooms.length);

  // Find most frequently used room
  let roomUsage = {};
  this.rooms.forEach((room) => {
    roomUsage[room.id] = room.usage; // Usage is already a number
  });

  // Sort rooms by usage and get the highest
  const mostUsedRoom = Object.keys(roomUsage).reduce((a, b) =>
    roomUsage[a] > roomUsage[b] ? a : b
  );

  // Count active instructors (from current sessions)
  const activeInstructors = new Set(this.sessions.map((session) => session.instructor)).size;

  // Update dashboard stats
  this.dashboardStats = {
    totalBookings,
    averageUsage,
    totalUsage,
    mostUsedRoom,
    bookingTrend: 5, // Placeholder for booking trend percentage
    activeInstructors,
    totalInstructors: 6, // Placeholder for total instructors
  };
},
      getMostUsedRoomUsage() {
        // Find the usage value for the most used room
        const room = this.rooms.find(room => room.id === this.dashboardStats.mostUsedRoom);
        return room ? room.usage : 0;
      },
      getMaxRoomUsage() {
        // Find the maximum usage value among all rooms
        return Math.max(...this.rooms.map(room => room.usage));
      },
      
    },
    computed: {
      // Filter rooms based on usage level
      filteredScheduleData() {
  // Filter schedules based on the selected day
  const filtered = this.scheduleData.filter(schedule => schedule.day === this.selectedDay);

  // Sort the filtered schedules by date (newest first)
  filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

  // Update the filtered count
  this.scheduleCount.filtered = filtered.length;

  return filtered;
},
      filteredRooms() {
        switch(this.usageFilter) {
          case 'high':
            return this.rooms.filter(room => room.usage >= 4);
          case 'medium':
            return this.rooms.filter(room => room.usage >= 2 && room.usage <= 3);
          case 'low':
            return this.rooms.filter(room => room.usage <= 1);
          default:
            return this.rooms;
        }
      }
    },
    mounted() {
  this.fetchSchedules(); // Fetch schedules on page load
  this.calculateDashboardStats();
  this.fetchBookings(); // Fetch bookings on page load
  this.fetchTotalBookings(); // Fetch total bookings from the database
  this.checkRoomAvailability();

  // Set up an interval to check room availability every 60 seconds
  this.roomAvailabilityInterval = setInterval(() => {
    this.checkRoomAvailability();
  }, 60000); // Check every 60 seconds
},
beforeUnmount() {
  // Clear the interval when the component is destroyed
  clearInterval(this.roomAvailabilityInterval);
},
  }
  </script>
  
  <style scoped>
  .dashboard-content {
    padding: 24px;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
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
  
  /* Usage Section */
  .usage-section {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    width: 100%;
    margin-bottom: 30px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .section-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #99183A;
    margin: 0;
  }
  
  .section-actions {
    display: flex;
    gap: 12px;
  }
  
  .filter-container {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .filter-select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: white;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    outline: none;
  }
  
  .filter-select:focus {
    border-color: #DD3859;
  }
  
  .action-button {
    padding: 8px 16px;
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .action-button:hover {
    background-color: #e9ecef;
  }
  
  .usage-bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .usage-bar-item {
    width: 100%;
  }
  
  .usage-bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .usage-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
  
  .usage-value {
    font-size: 14px;
    font-weight: 600;
    color: #DD3859;
  }
  
  .usage-bar-container {
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
  }
  
  .usage-bar {
    height: 100%;
    border-radius: 5px;
    transition: width 0.5s ease;
    background-color: #DD3859;
  }
  
  /* Room Availability Section */
  .room-availability-section {
    margin-bottom: 30px;
    padding: 0;
    width: 100%;
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
    width: 100%;
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
  .day-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.day-button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.day-button.active {
  background-color: #dd3859;
  color: white;
  border-color: #dd3859;
}

.day-button:hover {
  background-color: #e9ecef;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%;
    margin: 0;
  }
  
  @media (max-width: 992px) {
    .data-sections-container {
      grid-template-columns: 1fr;
    }
  }
  
  .data-sections-container > div {
    display: flex;
    flex-direction: column;
  }
  
  .sessions-section, .bookings-section {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #f0f0f0;
    overflow: hidden;
  }
  
  .sessions-header {
    display: grid;
    grid-template-columns: 1fr 1.5fr 2fr 1fr 1fr;
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
  
  .sessions-cards, .bookings-cards {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #DD3859 #f5f5f5;
    max-height: calc(4 * 60px); /* Height for 4 cards */
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
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 8px;
    height: 56px; /* Fixed height for consistent card shape */
    display: flex;
    align-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .session-card:hover, .booking-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
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
    background-color: #DD3859;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .bookings-header .header-item {
    color: white;
    font-size: 14px;
    font-weight: 600;
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
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
    text-align: center;
  }
  
  .status-badge.pending {
    background-color: #FFF1F3;
    color: #DD3859;
  }
  
  .status-badge.confirmed {
    background-color: #e6f7e6;
    color: #22c55e;
  }
  
  .status-badge.cancelled {
    background-color: #f1f1f1;
    color: #6b7280;
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