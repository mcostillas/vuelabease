<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Semester Schedule" />
    <div class="schedule-container">
      <div class="schedule-section">
        <div class="filters">
            <div class="filter-group">
              <label for="program-filter">Program:</label>
              <select id="program-filter" v-model="selectedProgram" @change="applyFilters">
            <option value="">All Programs</option>
            <option value="CABE">College of Accounting and Business Education</option>
            <option value="CAH">College of Arts and Humanities</option>
            <option value="CCS">College of Computer Studies</option>
            <option value="CEA">College of Engineering and Architecture</option>
            <option value="CHESFS">College of Human Environmental Science and Food Studies</option>
            <option value="CMBS">College of Medical and Biological Sciences</option>
            <option value="CM">College of Music</option>
            <option value="CN">College of Nursing</option>
            <option value="CPC">College of Pharmacy and Chemistry</option>
            <option value="CTE">College of Teacher Education</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="year-filter">Year Level:</label>
          <select id="year-filter" v-model="selectedYear" @change="applyFilters">
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="section-filter">Section:</label>
          <select id="section-filter" v-model="selectedSection" @change="applyFilters">
            <option value="">All Sections</option>
            <option v-for="section in availableSections" :key="section" :value="section">
              {{ section }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label for="day-filter">Day:</label>
          <select id="day-filter" v-model="selectedDay">
            <option value="">All Days</option>
            <option value="Mon">Monday</option>
            <option value="Tue">Tuesday</option>
            <option value="Wed">Wednesday</option>
            <option value="Thu">Thursday</option>
            <option value="Fri">Friday</option>
            <option value="Sat">Saturday</option>
            <option value="Sun">Sunday</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="time-filter">Time:</label>
          <select id="time-filter" v-model="selectedTimeOfDay">
            <option value="">All Times</option>
            <option value="morning">Morning (7:30 AM - 12:00 PM)</option>
            <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="date-filter">Date Range:</label>
          <select id="date-filter" v-model="dateFilter" @change="applyFilters">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
          </select>
        </div>
        <div class="filter-group" v-if="dateFilter === 'semester'">
          <label for="semester-filter">Select Semester:</label>
          <select id="semester-filter" v-model="selectedSemester" @change="applyFilters">
            <option value="current">Current Semester</option>
            <option value="2024-2">2nd Semester 2024-2025</option>
            <option value="2024-1">1st Semester 2024-2025</option>
            <option value="2023-2">2nd Semester 2023-2024</option>
            <option value="2023-1">1st Semester 2023-2024</option>
          </select>
        </div>
        </div>
        
        <div class="schedule-content">
        <div class="schedule-header">
          <div class="header-item">Day</div>
          <div class="header-item">Time Slot</div>
          <div class="header-item">Subject</div>
          <div class="header-item">Section</div>
          <div class="header-item">Room</div>
          <div class="header-item">Instructor</div>
        </div>
        
        <div class="schedule-cards">
  <!-- Loading Indicator -->
  <div v-if="isLoading" class="loading-indicator">
    <p>Loading schedules...</p>
  </div>

  <!-- Schedule Cards -->
  <div 
    v-for="event in paginatedEvents" 
    :key="event.id" 
    class="schedule-card"
  >
    <div class="schedule-item">
      
      <div class="day">{{ event.date }}</div>
      <div class="time-slot">{{ formatEventTime(event.startTime, event.endTime) }}</div>
      <div class="purpose">{{ event.title }}</div>
      <div class="section">{{ event.section || 'N/A' }}</div>
      <div class="room">{{ event.location }}</div>
      <div class="instructor">{{ event.instructorName }}</div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-if="!isLoading && filteredEvents.length === 0" class="empty-schedule">
    <p>No scheduled events.</p>
  </div>
</div>
        </div>
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination" v-if="filteredEvents.length > 0">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        
        <button 
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { createClient } from '@supabase/supabase-js';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import InstructorHeader from '@/components/instructor/InstructorHeader.vue';

// Initialize Supabase client
const supabaseSchedules = createClient(
  'https://yfiyhsazgjsxjmybsyar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXloc2F6Z2pzeGpteWJzeWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE5MzEsImV4cCI6MjA1ODQ1NzkzMX0.j7oFwaqYvJq45jhPuQBPEtNU-itU-CRleOJcqm1fOOo'
);

export default {
  name: 'InstructorSchedule',
  components: {
    DashboardLayout,
    InstructorHeader,
  },
  data() {
    return {
      selectedProgram: '',
      selectedYear: '',
      selectedSection: '',
      selectedDay: '',
      selectedTimeOfDay: '',
      dateFilter: 'all',
      selectedSemester: 'current',
      currentPage: 1,
      itemsPerPage: 10,
      scheduleEvents: [], // Array to store fetched schedule events
      isLoading: false, // Loading state
      instructorEmail: '', // Store the instructor's email
    };
  },
  computed: {
    availableSections() {
      return this.scheduleEvents
        .filter(event => {
          if (this.selectedProgram && !event.section.startsWith(this.selectedProgram)) {
            return false;
          }
          if (this.selectedYear) {
            const yearPattern = new RegExp(`${this.selectedProgram}-${this.selectedYear}[A-Z]`);
            if (!yearPattern.test(event.section)) {
              return false;
            }
          }
          return true;
        })
        .map(event => event.section)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort();
    },
    filteredEvents() {
  let filtered = [...this.scheduleEvents];

  // Filter by section
  if (this.selectedSection) {
    filtered = filtered.filter(event => event.section === this.selectedSection);
  } else {
    // Filter by program
    if (this.selectedProgram) {
      filtered = filtered.filter(event => {
        if (!event.section) return false;
        const parts = event.section.split('-');
        return parts.length >= 2 && parts[0] === this.selectedProgram;
      });
    }

    // Filter by year level
    if (this.selectedYear) {
      filtered = filtered.filter(event => {
        if (!event.section) return false;
        const parts = event.section.split('-');
        return parts.length >= 2 && parts[1].startsWith(this.selectedYear); // Match the year level
      });
    }
  }

  // Filter by day
  if (this.selectedDay) {
    filtered = filtered.filter(event => {
      const day = this.getDayAbbreviation(event.date);
      return day === this.selectedDay;
    });
  }

  // Filter by time of day
  if (this.selectedTimeOfDay) {
    filtered = filtered.filter(event => {
      const startHour = parseInt(event.startTime.split(':')[0]);
      if (this.selectedTimeOfDay === 'morning') {
        return startHour >= 7 && startHour < 12;
      } else if (this.selectedTimeOfDay === 'afternoon') {
        return startHour >= 12 && startHour < 16;
      }
      return true;
    });
  }

  // Filter by date range
  if (this.dateFilter !== 'all') {
    const today = new Date();
    const eventDate = new Date();
    let startOfWeek, startOfMonth, startOfSemester, endOfSemester;

    switch (this.dateFilter) {
      case 'week':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        filtered = filtered.filter(event => {
          eventDate.setTime(Date.parse(event.date));
          return eventDate >= startOfWeek;
        });
        break;

      case 'month':
        startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        filtered = filtered.filter(event => {
          eventDate.setTime(Date.parse(event.date));
          return eventDate >= startOfMonth;
        });
        break;

      case 'semester':
        if (this.selectedSemester === 'current') {
          startOfSemester = new Date(today);
          startOfSemester.setMonth(today.getMonth() - 4);
        } else {
          const [year, semNum] = this.selectedSemester.split('-');
          startOfSemester = new Date();
          if (semNum === '1') {
            startOfSemester.setFullYear(parseInt(year), 7, 1);
            endOfSemester = new Date();
            endOfSemester.setFullYear(parseInt(year), 11, 31);
          } else {
            startOfSemester.setFullYear(parseInt(year) + 1, 0, 1);
            endOfSemester = new Date();
            endOfSemester.setFullYear(parseInt(year) + 1, 4, 31);
          }
        }
        filtered = filtered.filter(event => {
          eventDate.setTime(Date.parse(event.date));
          if (this.selectedSemester === 'current') {
            return eventDate >= startOfSemester;
          } else {
            return eventDate >= startOfSemester && eventDate <= endOfSemester;
          }
        });
        break;
    }
  }

  return filtered;
},
    paginatedEvents() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredEvents.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage) || 1;
    },
  },
  methods: {
    async fetchScheduleEvents() {
  this.isLoading = true;
  try {
    // Get instructor information from localStorage
    let instructorEmail = localStorage.getItem('email');
    const instructorName = localStorage.getItem('firstName') || 'Marc';
    const instructorLastName = localStorage.getItem('lastName') || 'Costillas';
    const fullName = `${instructorName} ${instructorLastName}`;
    
    // Use hardcoded email as fallback if not found in localStorage
    if (!instructorEmail) {
      instructorEmail = 'mcostillas_220000000711@uic.edu.ph';
      console.log('Using fallback email for schedule fetch:', instructorEmail);
    }
    
    console.log('Fetching schedules for instructor:', instructorEmail, fullName);
    
    // For testing purposes, use a test instructor name that exists in the database
    const testInstructorName = 'Michel Bolo';
    console.log('Using test instructor name for development:', testInstructorName);
    
    // First approach: Try to find schedules by instructor email
    const { data: emailData, error: emailError } = await supabaseSchedules
      .from('schedules')
      .select('*')
      .eq('instructor_email', instructorEmail);
    
    if (emailError) {
      console.error('Error fetching schedules by email:', emailError);
      return;
    }
    
    console.log(`Found ${emailData.length} schedule events for instructor email ${instructorEmail}`);
    
    // Second approach: If no schedules found by email, try by instructor name
    let instructorData = emailData;
    
    if (emailData.length === 0) {
      // For development, use the test instructor name to ensure we see data
      const { data: nameData, error: nameError } = await supabaseSchedules
        .from('schedules')
        .select('*')
        .eq('instructor_name', testInstructorName);
      
      if (nameError) {
        console.error('Error fetching schedules by name:', nameError);
      } else {
        console.log(`Found ${nameData.length} schedule events for test instructor ${testInstructorName}`);
        instructorData = nameData;
      }
    }
    
    // Third approach: If still no data, fetch a sample of schedules for demonstration
    if (instructorData.length === 0) {
      const { data: sampleData, error: sampleError } = await supabaseSchedules
        .from('schedules')
        .select('*')
        .limit(10);
      
      if (sampleError) {
        console.error('Error fetching sample schedules:', sampleError);
      } else {
        console.log(`Found ${sampleData.length} sample schedule events for demonstration`);
        instructorData = sampleData;
      }
    }

    // Map the data to our schedule events format
    this.scheduleEvents = instructorData.map(event => ({
      id: event.id,
      title: event.course_name,
      courseCode: event.course_code,
      section: event.section,
      location: event.lab_room,
      date: event.day,
      secondDay: event.second_day || null,
      startTime: event.start_time,
      endTime: event.end_time,
      instructorName: event.instructor_name,
      instructorEmail: event.instructor_email || instructorEmail,
      semester: event.semester,
      scheduleType: event.schedule_types,
      status: event.status,
    }));
    
    console.log('Processed schedule events:', this.scheduleEvents);
  } catch (error) {
    console.error('Error fetching schedule events:', error.message);
    this.scheduleEvents = [];
  } finally {
    this.isLoading = false;
  }
},
    getDayAbbreviation(dateString) {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    },
    formatEventTime(start, end) {
      const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        return `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'am' : 'pm'}`;
      };
      return `${formatTime(start)} - ${formatTime(end)}`;
    },
    applyFilters() {
      this.currentPage = 1;
    },
    viewEventDetails(event) {
      console.log('View details for event:', event);
    },
  },
  watch: {
    selectedProgram() {
      this.selectedSection = '';
      this.applyFilters();
    },
    selectedYear() {
      this.selectedSection = '';
      this.applyFilters();
    },
    selectedDay() {
      this.applyFilters();
    },
    selectedTimeOfDay() {
      this.applyFilters();
    },
    dateFilter() {
      this.applyFilters();
    },
    selectedSemester() {
      this.applyFilters();
    },
  },
  mounted() {
    // Get instructor email from localStorage and store it in data
    this.instructorEmail = localStorage.getItem('email') || '';
    if (!this.instructorEmail) {
      console.warn('No instructor email found in localStorage');
    }
    this.fetchScheduleEvents();
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}



.schedule-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px;
  height: 100%;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}
.section{
  font-weight: 500;
  color: #1E293B;
}

.filter-group select:focus {
  outline: none;
  border-color: #DD3859;
}



.schedule-header {
  display: grid;
  grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 16px;
  background-color:#DD3859;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  color: white;
}

.header-item {
  font-size: 14px;
}

.schedule-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.schedule-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.schedule-item {
  display: grid;
  grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.day {
  font-weight: 600;
  color: #DD3859;
}

.time-slot {
  color: #1E293B;
  font-size: 14px;
}

.purpose {
  font-weight: 500;
  color: #1E293B;
}

.section, .room, .instructor {
  color: #64748B;
  font-size: 14px;
}

.empty-schedule {
  padding: 48px 0;
  text-align: center;
  color: #64748B;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #F8FAFC;
  border-color: #DD3859;
  color: #DD3859;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #64748B;
}

@media (max-width: 1024px) {
  .schedule-header, .schedule-item {
    grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 1.5fr;
  }
}

@media (max-width: 768px) {
  .schedule-container {
    padding: 16px;
  }
  
  .schedule-section {
    padding: 16px;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .schedule-header {
    display: none;
  }
  
  .schedule-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
