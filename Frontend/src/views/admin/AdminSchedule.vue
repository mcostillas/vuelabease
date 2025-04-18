<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Semester Schedule" />
    <div class="schedule-container">
      <div class="schedule-section">
        <div class="filters">
          <div class="filter-group">
            <label for="program-filter">Program:</label>
            <select id="program-filter" v-model="selectedProgram" @change="applyFilters">
              <option value="">All Programs</option>
              <option value="BSIT">BS Information Technology</option>
              <option value="BSCS">BS Computer Science</option>
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
        
        <!-- Schedule Content -->
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
                <div class="instructor">{{ event.instructor }}</div>
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
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

export default {
  name: 'AdminSchedule',
  components: {
    DashboardLayout,
    AdminHeader
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
          title: 'Introduction to Programming',
          section: 'BSIT-1A',
          location: 'L202',
          date: '2025-03-15',
          startTime: '07:30',
          endTime: '10:30',
          type: 'lecture',
          instructor: 'Dr. Jane Smith'
        },
        {
          id: 2,
          title: 'Computer Organization',
          section: 'BSIT-1B',
          location: 'L203',
          date: '2025-03-16',
          startTime: '08:00',
          endTime: '11:00',
          type: 'lecture',
          instructor: 'Prof. John Davis'
        },
        {
          id: 3,
          title: 'Data Structures and Algorithms',
          section: 'BSIT-2A',
          location: 'L204',
          date: '2025-03-17',
          startTime: '09:00',
          endTime: '12:00',
          type: 'lecture',
          instructor: 'Dr. Maria Garcia'
        },
        {
          id: 4,
          title: 'Web Applications Development',
          section: 'BSIT-2B',
          location: 'L205',
          date: '2025-03-18',
          startTime: '10:30',
          endTime: '12:00',
          type: 'lab',
          instructor: 'Prof. Robert Johnson'
        },
        {
          id: 5,
          title: 'Database Management Systems',
          section: 'BSIT-2C',
          location: 'L206',
          date: '2025-03-19',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lab',
          instructor: 'Dr. Emily Chen'
        },
        {
          id: 6,
          title: 'Operating Systems',
          section: 'BSCS-3A',
          location: 'L201',
          date: '2025-03-20',
          startTime: '07:30',
          endTime: '10:30',
          type: 'lecture',
          instructor: 'Prof. Michael Wilson'
        },
        {
          id: 7,
          title: 'Software Engineering',
          section: 'BSCS-3B',
          location: 'L202',
          date: '2025-03-21',
          startTime: '10:30',
          endTime: '13:30',
          type: 'lecture',
          instructor: 'Dr. Sarah Lee'
        },
        {
          id: 8,
          title: 'Computer Networks',
          section: 'BSCS-4A',
          location: 'L203',
          date: '2025-03-22',
          startTime: '13:00',
          endTime: '16:00',
          type: 'lab',
          instructor: 'Prof. David Brown'
        },
        {
          id: 9,
          title: 'Artificial Intelligence',
          section: 'BSCS-4B',
          location: 'L204',
          date: '2025-03-23',
          startTime: '08:30',
          endTime: '11:30',
          type: 'lecture',
          instructor: 'Dr. Thomas Martinez'
        },
        {
          id: 10,
          title: 'Mobile Application Development',
          section: 'BSIT-3A',
          location: 'L205',
          date: '2025-03-24',
          startTime: '14:00',
          endTime: '17:00',
          type: 'lab',
          instructor: 'Prof. Lisa Anderson'
        },
        {
          id: 11,
          title: 'Information Security',
          section: 'BSIT-4A',
          location: 'L206',
          date: '2025-03-25',
          startTime: '09:30',
          endTime: '12:30',
          type: 'lecture',
          instructor: 'Dr. Kevin Taylor'
        },
        {
          id: 12,
          title: 'Cloud Computing',
          section: 'BSIT-4B',
          location: 'L201',
          date: '2025-03-26',
          startTime: '13:30',
          endTime: '16:30',
          type: 'lab',
          instructor: 'Prof. Amanda White'
        }
      ]
    }
  },
  computed: {
    availableSections() {
      const sections = new Set()
      
      // Filter sections based on program and year if selected
      this.scheduleEvents.forEach(event => {
        if (event.section) {
          const sectionParts = event.section.split('-')
          const program = sectionParts[0]
          const yearSection = sectionParts[1]
          const year = yearSection ? yearSection.charAt(0) : null
          
          // Apply program filter
          if (this.selectedProgram && program !== this.selectedProgram) {
            return
          }
          
          // Apply year filter
          if (this.selectedYear && year !== this.selectedYear) {
            return
          }
          
          sections.add(event.section)
        }
      })
      
      return Array.from(sections).sort()
    },
    filteredEvents() {
      let filtered = [...this.scheduleEvents]
      
      // Filter by program
      if (this.selectedProgram) {
        filtered = filtered.filter(event => {
          if (!event.section) return false
          return event.section.startsWith(this.selectedProgram)
        })
      }
      
      // Filter by year
      if (this.selectedYear) {
        filtered = filtered.filter(event => {
          if (!event.section) return false
          const sectionParts = event.section.split('-')
          const yearSection = sectionParts[1]
          return yearSection && yearSection.charAt(0) === this.selectedYear
        })
      }
      
      // Filter by section
      if (this.selectedSection) {
        filtered = filtered.filter(event => event.section === this.selectedSection)
      }
      
      // Filter by day
      if (this.selectedDay) {
        filtered = filtered.filter(event => {
          const date = new Date(event.date)
          const day = date.toLocaleDateString('en-US', { weekday: 'short' })
          return day.startsWith(this.selectedDay)
        })
      }
      
      // Filter by time of day
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
      
      // Filter by date range
      if (this.dateFilter !== 'all') {
        const today = new Date()
        const currentYear = today.getFullYear()
        const currentMonth = today.getMonth()
        const currentDate = today.getDate()
        const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
        
        // Calculate start of week (Sunday)
        const startOfWeek = new Date(currentYear, currentMonth, currentDate - currentDay)
        
        // Calculate start of month
        const startOfMonth = new Date(currentYear, currentMonth, 1)
        
        // Filter based on selected date range
        if (this.dateFilter === 'week') {
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate >= startOfWeek
          })
        } else if (this.dateFilter === 'month') {
          filtered = filtered.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate >= startOfMonth
          })
        } else if (this.dateFilter === 'semester') {
          // Implement semester filtering based on academic calendar
          // This is a simplified version
          if (this.selectedSemester === 'current') {
            // Assume current semester is from January to May 2025
            const semesterStart = new Date('2025-01-01')
            const semesterEnd = new Date('2025-05-31')
            
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= semesterStart && eventDate <= semesterEnd
            })
          } else if (this.selectedSemester === '2024-2') {
            // 2nd Semester 2024-2025 (Jan-May 2025)
            const semesterStart = new Date('2025-01-01')
            const semesterEnd = new Date('2025-05-31')
            
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= semesterStart && eventDate <= semesterEnd
            })
          } else if (this.selectedSemester === '2024-1') {
            // 1st Semester 2024-2025 (Aug-Dec 2024)
            const semesterStart = new Date('2024-08-01')
            const semesterEnd = new Date('2024-12-31')
            
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= semesterStart && eventDate <= semesterEnd
            })
          } else if (this.selectedSemester === '2023-2') {
            // 2nd Semester 2023-2024 (Jan-May 2024)
            const semesterStart = new Date('2024-01-01')
            const semesterEnd = new Date('2024-05-31')
            
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= semesterStart && eventDate <= semesterEnd
            })
          } else if (this.selectedSemester === '2023-1') {
            // 1st Semester 2023-2024 (Aug-Dec 2023)
            const semesterStart = new Date('2023-08-01')
            const semesterEnd = new Date('2023-12-31')
            
            filtered = filtered.filter(event => {
              const eventDate = new Date(event.date)
              return eventDate >= semesterStart && eventDate <= semesterEnd
            })
          }
        }
      }
      
      // Sort by date and time
      filtered.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.startTime)
        const dateB = new Date(b.date + 'T' + b.startTime)
        return dateA - dateB
      })
      
      return filtered
    },
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredEvents.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage)
    }
  },
  methods: {
    getDayAbbreviation(dateString) {
      const date = new Date(dateString)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' })
      return day
    },
    formatEventTime(start, end) {
      // Format time from 24-hour to 12-hour format
      const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':')
        const hour = parseInt(hours)
        return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
      }
      
      return `${formatTime(start)} - ${formatTime(end)}`
    },
    applyFilters() {
      this.currentPage = 1
    },
    viewEventDetails(event) {
      // Implement view details functionality
      console.log('View details for event:', event)
    }
  },
  watch: {
    selectedProgram() {
      this.selectedSection = ''
      this.applyFilters()
    },
    selectedYear() {
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

.filter-group select:focus {
  outline: none;
  border-color: #DD3859;
}

.schedule-content {
  margin-top: 24px;
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
