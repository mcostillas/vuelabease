<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="Semester Schedule" />
    <div class="schedule-container">
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
      
      <div class="schedule-section">
        <div class="schedule-header">
          <div class="header-item">Day</div>
          <div class="header-item">Time Slot</div>
          <div class="header-item">Subject</div>
          <div class="header-item">Section</div>
          <div class="header-item">Room</div>
        </div>
        
        <div class="schedule-cards">
          <div 
            v-for="event in paginatedEvents" 
            :key="event.id" 
            class="schedule-card"
          >
            <div class="schedule-item">
              <div class="day">{{ getDayAbbreviation(event.date) }}</div>
              <div class="time-slot">{{ formatEventTime(event.startTime, event.endTime) }}</div>
              <div class="purpose">{{ event.title }}</div>
              <div class="section">{{ event.section || 'N/A' }}</div>
              <div class="room">{{ event.location }}</div>
            </div>
          </div>
          
          <div v-if="filteredEvents.length === 0" class="empty-schedule">
            <p>No scheduled events.</p>
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
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import InstructorHeader from '@/components/instructor/InstructorHeader.vue'

export default {
  name: 'InstructorSchedule',
  components: {
    DashboardLayout,
    InstructorHeader
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
      scheduleEvents: [
        {
          id: 1,
          title: 'Web Applications Development',
          section: 'CCS-2A',
          location: 'L201',
          date: '2025-03-15',
          startTime: '07:30',
          endTime: '10:30',
          type: 'lab'
        },
        {
          id: 2,
          title: 'Data Structures and Algorithms',
          section: 'CCS-2B',
          location: 'L202',
          date: '2025-03-16',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lab'
        },
        {
          id: 3,
          title: 'Computer Programming',
          section: 'CCS-1A',
          location: 'L203',
          date: '2025-03-17',
          startTime: '07:30',
          endTime: '10:30',
          type: 'lecture'
        },
        {
          id: 4,
          title: 'Computer Networks',
          section: 'CCS-3A',
          location: 'L204',
          date: '2025-03-18',
          startTime: '10:30',
          endTime: '12:00',
          type: 'lab'
        },
        {
          id: 5,
          title: 'Database Management Systems',
          section: 'CCS-2C',
          location: 'L205',
          date: '2025-03-19',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lab'
        },
        {
          id: 6,
          title: 'Software Engineering',
          section: 'CCS-3A',
          location: 'Open Laboratory',
          date: '2025-03-15',
          startTime: '11:30',
          endTime: '12:30',
          type: 'lecture'
        },
        {
          id: 7,
          title: 'Mobile Application Development',
          section: 'CCS-3B',
          location: 'IOT Lab',
          date: '2025-03-16',
          startTime: '13:30',
          endTime: '15:00',
          type: 'lab'
        },
        {
          id: 8,
          title: 'Artificial Intelligence',
          section: 'CCS-3C',
          location: 'L201',
          date: '2025-03-17',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lecture'
        },
        {
          id: 9,
          title: 'Cybersecurity',
          section: 'CCS-4A',
          location: 'L202',
          date: '2025-03-18',
          startTime: '14:30',
          endTime: '16:00',
          type: 'lab'
        },
        {
          id: 10,
          title: 'Calculus for Engineers',
          section: 'CEA-1A',
          location: 'L203',
          date: '2025-03-19',
          startTime: '07:30',
          endTime: '09:00',
          type: 'lecture'
        },
        {
          id: 11,
          title: 'Accounting Principles',
          section: 'CABE-1A',
          location: 'L204',
          date: '2025-03-20',
          startTime: '10:30',
          endTime: '12:00',
          type: 'lecture'
        },
        {
          id: 12,
          title: 'Organic Chemistry',
          section: 'CPC-2A',
          location: 'L205',
          date: '2025-03-21',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lab'
        }
      ]
    }
  },
  computed: {
    availableSections() {
      // Get unique sections based on the selected program and year
      return this.scheduleEvents
        .filter(event => {
          // Filter by program if selected
          if (this.selectedProgram && !event.section.startsWith(this.selectedProgram)) {
            return false;
          }
          
          // Filter by year if selected
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
      let filtered = [...this.scheduleEvents]
      
      // Apply program and year filters through section filter
      if (this.selectedSection) {
        filtered = filtered.filter(event => event.section === this.selectedSection)
      } else {
        // If no section is selected, apply program and year filters separately
        if (this.selectedProgram) {
          filtered = filtered.filter(event => {
            if (!event.section) return false
            const parts = event.section.split('-')
            return parts.length >= 2 && parts[0] === this.selectedProgram
          })
        }
        
        if (this.selectedYear) {
          filtered = filtered.filter(event => {
            if (!event.section) return false
            const parts = event.section.split('-')
            return parts.length >= 2 && parts[1].charAt(0) === this.selectedYear
          })
        }
      }
      
      // Apply day filter
      if (this.selectedDay) {
        filtered = filtered.filter(event => {
          const day = this.getDayAbbreviation(event.date)
          return day === this.selectedDay
        })
      }
      
      // Apply time of day filter
      if (this.selectedTimeOfDay) {
        filtered = filtered.filter(event => {
          const startHour = parseInt(event.startTime.split(':')[0])
          
          if (this.selectedTimeOfDay === 'morning') {
            return startHour >= 7 && startHour < 12
          } else if (this.selectedTimeOfDay === 'afternoon') {
            return startHour >= 12 && startHour < 16
          }
          
          return true
        })
      }
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date()
        const eventDate = new Date()
        
        // Declare variables outside of case blocks to avoid ESLint errors
        let startOfWeek, startOfMonth, startOfSemester, endOfSemester
        
        switch(this.dateFilter) {
          case 'week':
            // Get start of current week (Sunday)
            startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            
            filtered = filtered.filter(event => {
              eventDate.setTime(Date.parse(event.date))
              return eventDate >= startOfWeek
            })
            break
            
          case 'month':
            // Get start of current month
            startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            
            filtered = filtered.filter(event => {
              eventDate.setTime(Date.parse(event.date))
              return eventDate >= startOfMonth
            })
            break
            
          case 'semester':
            // Handle different semester selections
            if (this.selectedSemester === 'current') {
              // Current semester (last 4 months)
              startOfSemester = new Date(today)
              startOfSemester.setMonth(today.getMonth() - 4)
            } else {
              // Parse the selected semester (format: YYYY-N where N is 1 or 2)
              const [year, semNum] = this.selectedSemester.split('-')
              startOfSemester = new Date()
              
              if (semNum === '1') {
                // First semester typically starts in August
                startOfSemester.setFullYear(parseInt(year), 7, 1) // August 1st
                endOfSemester = new Date()
                endOfSemester.setFullYear(parseInt(year), 11, 31) // December 31st
              } else {
                // Second semester typically starts in January of the next year
                startOfSemester.setFullYear(parseInt(year) + 1, 0, 1) // January 1st
                endOfSemester = new Date()
                endOfSemester.setFullYear(parseInt(year) + 1, 4, 31) // May 31st
              }
            }
            
            filtered = filtered.filter(event => {
              eventDate.setTime(Date.parse(event.date))
              if (this.selectedSemester === 'current') {
                return eventDate >= startOfSemester
              } else {
                return eventDate >= startOfSemester && eventDate <= endOfSemester
              }
            })
            break
        }
      }
      
      return filtered
    },
    paginatedEvents() {
      // Apply pagination to filtered events
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredEvents.slice(startIndex, endIndex)
    },
    totalPages() {
      // Calculate total pages based on filtered events
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage) || 1
    }
  },
  methods: {
    getDayAbbreviation(dateString) {
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    },
    formatEventTime(start, end) {
      const formatTime = (time) => {
        const [hours, minutes] = time.split(':')
        const hour = parseInt(hours)
        return `${hour % 12 || 12}:${minutes} ${hour < 12 ? 'am' : 'pm'}`
      }
      
      return `${formatTime(start)} - ${formatTime(end)}`
    },
    applyFilters() {
      // Reset to first page when filters change
      this.currentPage = 1
    },
    viewEventDetails(event) {
      // Future implementation for viewing event details
      console.log('View details for event:', event)
    }
  },
  watch: {
    selectedProgram() {
      // Reset section when program changes
      this.selectedSection = ''
      this.applyFilters()
    },
    selectedYear() {
      // Reset section when year changes
      this.selectedSection = ''
      this.applyFilters()
    },
    selectedDay() {
      this.applyFilters()
    },
    selectedTimeOfDay() {
      this.applyFilters()
    },
    dateFilter() {
      this.applyFilters()
    },
    selectedSemester() {
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.schedule-container {
  padding: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
}

.filter-group select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background-color: white;
  font-size: 14px;
  color: #1E293B;
  min-width: 200px;
  outline: none;
  transition: all 0.2s ease;
}

.filter-group select:focus {
  border-color: #DD3859;
  box-shadow: 0 0 0 2px rgba(221, 56, 89, 0.1);
}

/* Schedule Section Styling - Matching Dashboard */
.schedule-section {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.schedule-header {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 2fr 1fr 1fr;
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
  grid-template-columns: 0.7fr 1.3fr 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.day, .time-slot, .purpose, .section, .room {
  font-size: 14px;
  color: #1E293B;
}

.day {
  font-weight: 600;
  color: #DD3859;
}

.time-slot {
  font-weight: 500;
}

.purpose {
  font-weight: 600;
}

.empty-schedule {
  text-align: center;
  padding: 32px 0;
  color: #64748B;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

/* Pagination Styling */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #F1F5F9;
  color: #1E293B;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #64748B;
  font-family: 'Poppins', sans-serif;
}

/* Font styling to match LabEase design system */
* {
  font-family: 'Poppins', sans-serif;
}
</style>
