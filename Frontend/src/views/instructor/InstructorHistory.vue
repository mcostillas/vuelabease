<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="History of Bookings" />
    <div class="history-container">
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
          <label for="status-filter">Status:</label>
          <select id="status-filter" v-model="statusFilter" @change="applyFilters">
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
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
      
      <!-- Schedule Cards Layout (matching original design) -->
      <div class="schedule-section">
        <div class="schedule-header">
          <div class="header-item">Time Slot</div>
          <div class="header-item">Purpose</div>
          <div class="header-item">Section</div>
          <div class="header-item">Lab, Room No.</div>
          <div class="header-item">Status</div>
        </div>
        
        <div class="schedule-cards">
          <div 
            v-for="booking in filteredBookings" 
            :key="booking.id" 
            class="schedule-card"
            :class="booking.status"
          >
            <div class="schedule-item">
              <div class="time-slot">{{ formatTime(booking.startTime, booking.endTime) }}</div>
              <div class="purpose">{{ booking.purpose }}</div>
              <div class="section">{{ booking.section || 'N/A' }}</div>
              <div class="room">{{ booking.room }}</div>
              <div class="status">{{ booking.status }}</div>
            </div>
          </div>
          
          <div v-if="filteredBookings.length === 0" class="empty-schedule">
            <p>No booking history found.</p>
          </div>
        </div>
      </div>
      
      <div class="pagination">
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
  name: 'InstructorHistory',
  components: {
    DashboardLayout,
    InstructorHeader
  },
  data() {
    return {
      selectedProgram: '',
      selectedYear: '',
      selectedSection: '',
      statusFilter: '',
      dateFilter: 'all',
      selectedSemester: 'current',
      currentPage: 1,
      itemsPerPage: 10,
      bookings: [
        {
          id: 1,
          room: 'L201',
          date: '2025-03-10',
          startTime: '09:00',
          endTime: '12:00',
          purpose: 'Web Applications Development',
          section: 'CCS-2A',
          status: 'approved',
          program: 'CCS',
          year: '2'
        },
        {
          id: 2,
          room: 'L202',
          date: '2025-03-08',
          startTime: '13:00',
          endTime: '16:00',
          purpose: 'Data Structures and Algorithms',
          section: 'CCS-2B',
          status: 'rejected',
          program: 'CCS',
          year: '2'
        },
        {
          id: 3,
          room: 'L203',
          date: '2025-03-15',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Computer Programming',
          section: 'CCS-1A',
          status: 'pending',
          program: 'CCS',
          year: '1'
        },
        {
          id: 4,
          room: 'L204',
          date: '2025-02-28',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Calculus for Engineers',
          section: 'CEA-1A',
          status: 'cancelled',
          program: 'CEA',
          year: '1'
        },
        {
          id: 5,
          room: 'L205',
          date: '2025-03-05',
          startTime: '08:00',
          endTime: '10:00',
          purpose: 'Database Management Systems',
          section: 'CCS-2C',
          status: 'approved',
          program: 'CCS',
          year: '2'
        },
        {
          id: 6,
          room: 'Open Laboratory',
          date: '2025-03-12',
          startTime: '13:00',
          endTime: '15:00',
          purpose: 'Software Engineering',
          section: 'CCS-3A',
          status: 'approved',
          program: 'CCS',
          year: '3'
        },
        {
          id: 7,
          room: 'IOT Lab',
          date: '2025-03-18',
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Mobile Application Development',
          section: 'CCS-3B',
          status: 'pending',
          program: 'CCS',
          year: '3'
        },
        {
          id: 8,
          room: 'L201',
          date: '2025-03-20',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Organic Chemistry',
          section: 'CPC-2A',
          status: 'pending',
          program: 'CPC',
          year: '2'
        }
      ]
    }
  },
  computed: {
    availableSections() {
      // Filter sections based on selected program and year
      const sections = []
      
      this.bookings.forEach(booking => {
        // Check if booking matches the selected program and year
        const programMatch = !this.selectedProgram || booking.program === this.selectedProgram
        const yearMatch = !this.selectedYear || booking.year === this.selectedYear
        
        // If both match and the section isn't already in our list, add it
        if (programMatch && yearMatch && booking.section && !sections.includes(booking.section)) {
          sections.push(booking.section)
        }
      })
      
      // Sort sections alphabetically
      return sections.sort()
    },
    filteredBookings() {
      let filtered = [...this.bookings]
      
      // Apply program filter
      if (this.selectedProgram) {
        filtered = filtered.filter(booking => booking.program === this.selectedProgram)
      }
      
      // Apply year filter
      if (this.selectedYear) {
        filtered = filtered.filter(booking => booking.year === this.selectedYear)
      }
      
      // Apply section filter
      if (this.selectedSection) {
        filtered = filtered.filter(booking => booking.section === this.selectedSection)
      }
      
      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter)
      }
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date()
        const bookingDate = new Date()
        
        // Declare all variables outside of case blocks to fix ESLint errors
        let startOfWeek, startOfMonth, startOfSemester
        
        switch(this.dateFilter) {
          case 'week':
            // Get start of current week (Sunday)
            startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfWeek
            })
            break
            
          case 'month':
            // Get start of current month
            startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfMonth
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
              } else {
                // Second semester typically starts in January of the next year
                startOfSemester.setFullYear(parseInt(year) + 1, 0, 1) // January 1st
              }
            }
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfSemester
            })
            break
        }
      }
      
      // Apply pagination
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      
      return filtered.slice(startIndex, endIndex)
    },
    totalPages() {
      // Calculate total pages based on filtered bookings before pagination
      let filtered = [...this.bookings]
      
      // Apply program filter
      if (this.selectedProgram) {
        filtered = filtered.filter(booking => booking.program === this.selectedProgram)
      }
      
      // Apply year filter
      if (this.selectedYear) {
        filtered = filtered.filter(booking => booking.year === this.selectedYear)
      }
      
      // Apply section filter
      if (this.selectedSection) {
        filtered = filtered.filter(booking => booking.section === this.selectedSection)
      }
      
      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(booking => booking.status === this.statusFilter)
      }
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date()
        const bookingDate = new Date()
        
        // Declare all variables outside of case blocks to fix ESLint errors
        let startOfWeek, startOfMonth, startOfSemester
        
        switch(this.dateFilter) {
          case 'week':
            // Get start of current week (Sunday)
            startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            startOfWeek.setHours(0, 0, 0, 0)
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfWeek
            })
            break
            
          case 'month':
            // Get start of current month
            startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfMonth
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
              } else {
                // Second semester typically starts in January of the next year
                startOfSemester.setFullYear(parseInt(year) + 1, 0, 1) // January 1st
              }
            }
            
            filtered = filtered.filter(booking => {
              bookingDate.setTime(Date.parse(booking.date))
              return bookingDate >= startOfSemester
            })
            break
        }
      }
      
      return Math.ceil(filtered.length / this.itemsPerPage) || 1
    }
  },
  created() {
  // Retrieve the userType from localStorage
  const storedUserRole = localStorage.getItem('usertype');
  console.log('Retrieved usertype from localStorage:', storedUserRole); // Debugging log

  if (!storedUserRole) {
    console.error('Usertype not found in localStorage. Redirecting to login.');
    this.$router.push('/login');
    return;
  }

  // Check if the userType matches 'instructor'
  if (storedUserRole.toLowerCase() !== 'instructor') {
    console.error('Usertype is not instructor. Redirecting to login.');
    this.$router.push('/login');
    return;
  }

  // If userType is valid, proceed
  console.log('Usertype is valid:', storedUserRole);

  // Proceed with data initialization or other logic
  console.log('Proceeding with data initialization.');
},
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    formatTime(start, end) {
      const formatTimeStr = (timeStr) => {
        const [hours, minutes] = timeStr.split(':')
        const hour = parseInt(hours)
        return `${hour % 12 || 12}${minutes !== '00' ? ':' + minutes : ''} ${hour < 12 ? 'am' : 'pm'}`
      }
      
      return `${formatTimeStr(start)} - ${formatTimeStr(end)}`
    },
    viewBookingDetails(booking) {
      // In a real application, this would show a modal with booking details
      alert(`Booking Details:\nRoom: ${booking.room}\nDate: ${this.formatDate(booking.date)}\nTime: ${this.formatTime(booking.startTime, booking.endTime)}\nPurpose: ${booking.purpose}\nStatus: ${booking.status}`)
    },
    applyFilters() {
      // Reset to first page when filters change
      this.currentPage = 1
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
    statusFilter() {
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
.history-container {
  padding: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  font-size: 12px;
  color: #64748B;
  font-family: 'Poppins', sans-serif;
}

.filter-group select {
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
  min-width: 150px;
  font-family: 'Poppins', sans-serif;
}

.filter-group select:focus {
  outline: none;
  border-color: #DD3859;
}

/* Schedule Section Styling - Matching Original Design */
.schedule-section {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.schedule-header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr;
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
  font-family: 'Poppins', sans-serif;
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
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.time-slot {
  color: #DD3859;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

.purpose {
  color: #1E293B;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

.section, .room {
  color: #64748B;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
}

.status {
  font-weight: 500;
  font-size: 14px;
  text-transform: capitalize;
  font-family: 'Poppins', sans-serif;
}

/* Status Colors and Left Borders */
.schedule-card.pending {
  border-left: 4px solid #F59E0B;
}

.schedule-card.pending .status {
  color: #F59E0B;
}

.schedule-card.approved {
  border-left: 4px solid #10B981;
}

.schedule-card.approved .status {
  color: #10B981;
}

.schedule-card.rejected {
  border-left: 4px solid #EF4444;
}

.schedule-card.rejected .status {
  color: #EF4444;
}

.schedule-card.cancelled {
  border-left: 4px solid #64748B;
}

.schedule-card.cancelled .status {
  color: #64748B;
}

.empty-schedule {
  text-align: center;
  padding: 32px 0;
  color: #64748B;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
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

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .schedule-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .schedule-header {
    display: none;
  }
  
  .schedule-card {
    padding: 16px;
  }
  
  .time-slot, .purpose, .section, .room, .status {
    padding: 4px 0;
  }
  
  .time-slot::before {
    content: "Time: ";
    font-weight: normal;
  }
  
  .purpose::before {
    content: "Purpose: ";
    font-weight: normal;
  }
  
  .section::before {
    content: "Section: ";
    font-weight: normal;
  }
  
  .room::before {
    content: "Room: ";
    font-weight: normal;
  }
  
  .status::before {
    content: "Status: ";
    font-weight: normal;
  }
}
</style>
