<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Dashboard" />
    <div class="dashboard-content">
      <!-- Overview Section -->
      <div class="overview-section">
        <div class="section-header-main">
          <h2>Overview</h2>
          <div class="date-display">
            <i class="fas fa-calendar-alt"></i>
            <span>
              {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <!-- Pending Bookings -->
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 2V6" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 2V6" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3 10H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ totalPending }}</div>
              <div class="metric-label">Pending Bookings</div>
            </div>
          </div>

          <!-- Confirmed Bookings -->
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L22 4" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ totalConfirmed }}</div>
              <div class="metric-label">Confirmed Bookings</div>
            </div>
          </div>

          <!-- Canceled Bookings -->
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 6L18 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ totalCanceled }}</div>
              <div class="metric-label">Canceled Bookings</div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 6L18 18" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ totalBookings }}</div>
              <div class="metric-label">Total Bookings</div>
            </div>
          </div>
        </div>
      </div>


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
    <div class="session-card" v-for="session in todaysSchedule" :key="session.id">
      <div class="session-item">
        <div class="time-slot">{{ session.startTime }} - {{ session.endTime }}</div>
        <div class="purpose">{{ session.courseName }}</div>
        <div class="section">{{ session.section }}</div>
        <div class="room">{{ session.labRoom }}</div>
      </div>
    </div>
  </div>
</div>

    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import InstructorHeader from '@/components/instructor/InstructorHeader.vue';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseBookings = createClient(
  'https://bfmvnahlknvyrajofmdw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk'
);
const supabaseSchedules = createClient(
  'https://yfiyhsazgjsxjmybsyar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXloc2F6Z2pzeGpteWJzeWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE5MzEsImV4cCI6MjA1ODQ1NzkzMX0.j7oFwaqYvJq45jhPuQBPEtNU-itU-CRleOJcqm1fOOo'
);

export default {
  name: 'InstructorDashboard',
  components: {
    DashboardLayout,
    InstructorHeader,
  },
  data() {
    return {
      totalPending: 0, // Total pending bookings
      totalConfirmed: 0, // Total confirmed bookings
      totalCanceled: 0, // Total canceled bookings
      totalBookings: 0,
      scheduleCount: {
        total: 0, // Total number of schedules
      },
      rooms: [
          { id: '201', usage: 4 },
          { id: '202', usage: 3 },
          { id: '203', usage: 5 },
          { id: '204', usage: 3 },
          { id: '205', usage: 2 },
          { id: 'Open Lab', usage: 6 },
          { id: 'IOT Lab', usage: 4 }
        ],
        roomAvailability: [], // Array to hold room availability data
        scheduleData: [], // Array to hold schedule data
        testDay: null, // New property to hold test day
    };
  },
  computed: {
  todaysSchedule() {
    // Use testDay if available (for testing purposes), otherwise use current day
    const currentDay = this.testDay || new Date().toLocaleDateString('en-US', { weekday: 'long' });

    console.log('Using day for schedule filtering:', currentDay);

    // Filter schedules for the current day or test day
    const filteredSchedules = this.scheduleData.filter(schedule => schedule.day === currentDay);

    console.log('Filtered schedules for today/test day:', filteredSchedules); // Debugging log

    // Sort schedules by startTime in ascending order
    return filteredSchedules.sort((a, b) => {
      // Handle different time formats (with or without AM/PM)
      const formatTimeToMinutes = (timeStr) => {
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          const [timePart, period] = timeStr.split(' ');
          let [hours, minutes] = timePart.split(':').map(Number);
          if (period === 'PM' && hours < 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          return hours * 60 + minutes;
        } else {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        }
      };

      const aTotalMinutes = formatTimeToMinutes(a.startTime);
      const bTotalMinutes = formatTimeToMinutes(b.startTime);

      return aTotalMinutes - bTotalMinutes;
    });
  },

},
  methods: {
    checkRoomAvailability() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Get only the rooms that are used by this instructor in their schedule
  const instructorRoomIds = [...new Set(this.scheduleData.map(schedule => schedule.labRoom))];
  console.log('Instructor room IDs:', instructorRoomIds);
  
  // Filter the rooms to only include those that are in the instructor's schedule
  const instructorRooms = this.rooms.filter(room => instructorRoomIds.includes(room.id));
  
  // If no instructor rooms found, show all rooms as a fallback
  const roomsToDisplay = instructorRooms.length > 0 ? instructorRooms : this.rooms;
  
  // Iterate through each room and check if it is in use
  this.roomAvailability = roomsToDisplay.map(room => {
    const schedules = this.scheduleData.filter(schedule =>
      schedule.labRoom === room.id && schedule.day === currentDay
    );

    // Check if the current time falls within any schedule for this room
    const isInUse = schedules.some(schedule => {
      const [startHour, startMinutes] = schedule.startTime.split(':').map(Number);
      const [endHour, endMinutes] = schedule.endTime.split(':').map(Number);

      const startTime = startHour * 60 + startMinutes;
      const endTime = endHour * 60 + endMinutes;
      const currentTimeInMinutes = currentHour * 60 + currentMinutes;

      return currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime;
    });

    // Update the room status
    return {
      name: room.id,
      status: isInUse ? 'In Use' : 'Available',
    };
  });

  console.log('Updated room availability for instructor:', this.roomAvailability);
},
  async fetchTotalBookings() {
  try {
    const { data, count, error } = await supabaseBookings
      .from('bookings')
      .select('*', { count: 'exact' });

    console.log('Supabase response:', { data, count, error });

    if (error) throw error;

    // Update the total bookings count
    this.totalBookings = count || 0;

    console.log('Total bookings fetched:', this.totalBookings);
  } catch (error) {
    console.error('Error fetching total bookings:', error.message);
  }
},
async fetchSchedules() {
  try {
    // Get instructor information from localStorage
    let instructorEmail = localStorage.getItem('email');
    const instructorName = localStorage.getItem('firstName') || 'Marc';
    const instructorLastName = localStorage.getItem('lastName') || 'Costillas';
    const fullName = `${instructorName} ${instructorLastName}`;
    
    // For testing purposes, we'll use a hardcoded instructor name that matches the database
    // This is temporary to ensure we can see data
    const testInstructorName = 'Michel Bolo';
    
    // Use hardcoded email as fallback if not found in localStorage
    if (!instructorEmail) {
      instructorEmail = 'mcostillas_220000000711@uic.edu.ph';
      console.log('Using fallback email for schedule fetch:', instructorEmail);
    }
    
    console.log('Fetching schedules for instructor:', fullName);
    console.log('Using test instructor name for development:', testInstructorName);
    
    // Log the current day for debugging
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    console.log('Current day:', currentDay);
    
    // Fetch all schedules from the database
    const { data, error } = await supabaseSchedules
      .from('schedules')
      .select('*');

    if (error) throw error;
    
    console.log('Total schedules in database:', data.length);
    
    // First approach: Try to find schedules by instructor email (for production)
    let instructorSchedules = [];
    
    // For development/testing, use the test instructor name
    // In production, this should be replaced with the actual instructor name from localStorage
    instructorSchedules = data.filter(schedule => {
      return schedule.instructor_name && 
             schedule.instructor_name.toLowerCase() === testInstructorName.toLowerCase();
    });
    
    console.log(`Found ${instructorSchedules.length} schedules for test instructor ${testInstructorName}`);
    
    // If no schedules found, get some sample data to display
    if (instructorSchedules.length === 0) {
      console.log('No schedules found for test instructor, using sample data');
      instructorSchedules = data.slice(0, 5); // Get first 5 schedules as samples
    }
    
    // Log days from the database for debugging
    const daysInDatabase = [...new Set(data.map(schedule => schedule.day))];
    console.log('Days in database:', daysInDatabase);

    // Map the filtered data to the scheduleData array
    this.scheduleData = instructorSchedules.map(schedule => ({
      id: schedule.id,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      instructorName: schedule.instructor_name,
      courseName: schedule.course_name,
      section: schedule.section,
      labRoom: schedule.lab_room,
      day: schedule.day,
    }));

    console.log('Filtered scheduleData for instructor:', this.scheduleData);
    
    // Log schedules for today
    const todaySchedules = this.scheduleData.filter(schedule => schedule.day === currentDay);
    console.log(`Found ${todaySchedules.length} schedules for today (${currentDay}):`, todaySchedules);
    
    // If no schedules for today, modify the current day for testing purposes
    if (todaySchedules.length === 0 && this.scheduleData.length > 0) {
      console.log('No schedules found for today, using a sample day for testing');
      // Get a day that has schedules
      const sampleDay = this.scheduleData[0].day;
      console.log(`Using sample day: ${sampleDay} for testing`);
      // Override the current day in the computed property (for testing only)
      this.testDay = sampleDay;
    }
  } catch (error) {
    console.error('Error fetching schedules:', error.message);
  }
},
    async fetchBookingStats() {
  try {
    // Get instructor information from localStorage
    let instructorEmail = localStorage.getItem('email');
    const instructorName = localStorage.getItem('firstName') || 'Marc';
    
    // Use hardcoded email as fallback if not found in localStorage
    if (!instructorEmail) {
      instructorEmail = 'mcostillas_220000000711@uic.edu.ph';
      console.log('Using fallback email for dashboard stats:', instructorEmail);
    }
    
    console.log('Fetching booking stats for instructor:', instructorEmail, instructorName);
    
    // First, try to get bookings where person field matches the email
    const { data: emailBookings, error: emailError } = await supabaseBookings
      .from('bookings')
      .select('*')
      .eq('person', instructorEmail);
      
    if (emailError) {
      console.error('Error fetching instructor bookings by email:', emailError);
      return;
    }
    
    console.log(`Found ${emailBookings.length} bookings for instructor email ${instructorEmail}`);
    
    // Now try to get bookings where person field contains the instructor's name
    const { data: nameBookings, error: nameError } = await supabaseBookings
      .from('bookings')
      .select('*')
      .ilike('person', `%${instructorName}%`);
      
    if (nameError) {
      console.error('Error fetching instructor bookings by name:', nameError);
      return;
    }
    
    console.log(`Found ${nameBookings.length} bookings for instructor name ${instructorName}`);
    
    // Combine both results and remove duplicates
    const allBookings = [...emailBookings];
    
    // Add name bookings that aren't already in the email bookings
    nameBookings.forEach(booking => {
      if (!allBookings.some(b => b.id === booking.id)) {
        allBookings.push(booking);
      }
    });
    
    console.log(`Total combined bookings for dashboard: ${allBookings.length}`);
    
    // Use the combined bookings for stats
    let instructorBookings = allBookings;
    
    // Calculate totals based on booking status for this instructor only
    this.totalPending = instructorBookings.filter(booking => booking.status === 'pending').length;
    this.totalConfirmed = instructorBookings.filter(booking => booking.status === 'approved').length;
    this.totalCanceled = instructorBookings.filter(booking => booking.status === 'rejected').length;
    this.totalBookings = instructorBookings.length; // Total bookings for this instructor

    console.log('Instructor booking stats:', {
      totalPending: this.totalPending,
      totalConfirmed: this.totalConfirmed,
      totalCanceled: this.totalCanceled,
      totalBookings: this.totalBookings,
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error.message);
  }
},
  },
  mounted() {
    this.fetchBookingStats(); // Fetch booking stats when the component is mounted
    this.fetchSchedules();
    this.checkRoomAvailability(); // Check room availability
  },
};
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
