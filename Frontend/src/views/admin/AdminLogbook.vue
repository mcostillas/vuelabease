<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Log Book" />
    <div class="logbook-container">
      <!-- Hidden RFID Input Field -->
      <input 
        ref="rfidInput"
        type="text"
        v-model="rfidValue"
        @keydown.enter="processRfidScan"
        class="rfid-input"
        placeholder="Scan RFID..."
      />
      
      <div class="logbook-section">
        <!-- Action Buttons -->
        <div class="logbook-actions">
          <button class="manual-checkin-btn" @click="showManualCheckInForm()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Manual Check-in
          </button>
        </div>
        
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label for="date-filter">Date Range:</label>
            <select id="date-filter" v-model="dateFilter" @change="applyFilters">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
            <div v-if="dateFilter === 'custom'" class="date-range-picker">
              <input 
                type="date" 
                v-model="specificDate.start" 
                @change="applyFilters"
                class="date-picker"
              />
              <span>to</span>
              <input 
                type="date" 
                v-model="specificDate.end" 
                @change="applyFilters"
                class="date-picker"
              />
            </div>
          </div>
          <div class="filter-group">
            <label for="department-filter">Department:</label>
            <select id="department-filter" v-model="selectedDepartment" @change="applyFilters">
              <option value="">All Departments</option>
              <option value="College of Accounting and Business Education">College of Accounting and Business Education</option>
              <option value="College of Arts and Humanities">College of Arts and Humanities</option>
              <option value="College of Computer Studies">College of Computer Studies</option>
              <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
              <option value="College of Human Environmental Science and Food Studies">College of Human Environmental Science and Food Studies</option>
              <option value="College of Medical and Biological Sciences">College of Medical and Biological Sciences</option>
              <option value="College of Music">College of Music</option>
              <option value="College of Nursing">College of Nursing</option>
              <option value="College of Pharmacy and Chemistry">College of Pharmacy and Chemistry</option>
              <option value="College of Teacher Education">College of Teacher Education</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="status-filter">Status:</label>
            <select id="status-filter" v-model="selectedStatus" @change="applyFilters">
              <option value="">All Status</option>
              <option value="in">Checked In</option>
              <option value="out">Checked Out</option>
            </select>
          </div>
        </div>
        
        <!-- Logbook Content -->
        <div class="logbook-content">
          <div class="logbook-header">
            <div class="header-item">Instructor</div>
            <div class="header-item">Department</div>
            <div class="header-item">Date</div>
            <div class="header-item">Scheduled</div>
            <div class="header-item">Time In</div>
            <div class="header-item">Time Out</div>
            <div class="header-item">Status</div>
          </div>
          
          <div class="logbook-cards">
            <div 
              v-for="entry in paginatedLogEntries" 
              :key="entry.id" 
              class="logbook-card"
            >
              <div class="logbook-item">
                <div class="instructor">{{ entry.name }}</div>
                <div class="department">{{ entry.department }}</div>
                <div class="date">{{ entry.date }}</div>
                <div class="scheduled">
                  {{ entry.scheduledStart }} - {{ entry.scheduledEnd }}
                </div>
                <div class="time-in">
                  {{ entry.timeIn }}
                  <span v-if="calculateLateness(entry)" class="time-diff late">+{{ calculateLateness(entry) }}m</span>
                </div>
                <div class="time-out">
                  {{ entry.manualTimeOut || entry.timeOut || '—' }}
                  <span v-if="calculateOvertime(entry)" class="time-diff overtime">+{{ calculateOvertime(entry) }}m</span>
                  <span v-if="entry.autoLogout && !entry.manualTimeOut" class="auto-logout">Auto</span>
                </div>
                <div class="status">
                  <span class="status-badge" :class="entry.status">
                    {{ entry.status === 'in' ? 'Checked In' : 'Checked Out' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="filteredLogEntries.length === 0" class="empty-logbook">
              <p>No log entries found.</p>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="pagination" v-if="filteredLogEntries.length > 0">
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
    
    <!-- RFID Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Attendance Confirmation
          </h2>
          <button class="close-btn" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="instructor-details" v-if="currentInstructor">
            <div class="instructor-photo">
              <div class="initials-avatar" style="background-color: #DD3859; color: white;">
                {{ getInitials(currentInstructor.name) }}
              </div>
            </div>
            <div class="instructor-info">
              <h3>{{ currentInstructor.name }}</h3>
              <div class="instructor-metadata">
                <div class="metadata-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>ID: {{ currentInstructor.id }}</span>
                </div>
                <div class="metadata-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 9H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 21V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ currentInstructor.department }}</span>
                </div>
                <div class="metadata-item" v-if="currentInstructor.subject">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ currentInstructor.subject }} <span v-if="currentInstructor.section">({{ currentInstructor.section }})</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="attendance-status">
            <div class="status-badge-large" :class="currentInstructor && currentInstructor.status === 'out' ? 'time-in' : 'time-out'" @click="confirmAttendance">
              <div class="status-icon">
                <svg v-if="currentInstructor && currentInstructor.status === 'out'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 16L7 12M7 12L11 8M7 12L21 12M16 16V17C16 18.6569 14.6569 20 13 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H13C14.6569 4 16 5.34315 16 7V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 8L17 12M17 12L13 16M17 12H3M8 8V7C8 5.34315 9.34315 4 11 4H18C19.6569 4 21 5.34315 21 7V17C21 18.6569 19.6569 20 18 20H11C9.34315 20 8 18.6569 8 17V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="status-text">
                {{ currentInstructor && currentInstructor.status === 'out' ? 'Time In' : 'Time Out' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Manual Check-in Modal -->
    <div class="modal" v-if="showManualCheckInModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Manual Check-in
          </h2>
          <button class="close-btn" @click="closeManualCheckInModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="instructor-name">Instructor Name</label>
            <select 
              id="instructor-name" 
              v-model="manualInstructorName" 
              class="form-input"
              @change="validateInstructor"
              ref="manualNameInput"
            >
              <option value="">Select Instructor</option>
              <option value="Marc Maurice Costillas">Marc Maurice Costillas</option>
              <option value="Mark Anthony Nisnea">Mark Anthony Nisnea</option>
              <option value="Rockford Jade Dagohoy">Rockford Jade Dagohoy</option>
              <option value="Emily Davis">Emily Davis</option>
              <option value="Maria Rodriguez">Maria Rodriguez</option>
            </select>
            <div class="form-help-text" v-if="instructorValidationMessage">
              {{ instructorValidationMessage }}
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              class="submit-btn" 
              @click="submitManualCheckIn"
              :disabled="!isManualFormValid"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notification -->
    <div class="notification" :class="[notification.type, { show: notification.show }]">
      {{ notification.message }}
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://bfmvnahlknvyrajofmdw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk'
);

export default {
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      // RFID related
      rfidValue: '',
      showModal: false,
      currentInstructor: null,
      autoConfirmTimeout: null,
      scanningActive: true,
      lastScanTime: null,
      
      // Manual check-in related
      showManualCheckInModal: false,
      manualInstructorName: '',
      instructorValidationMessage: '',
      knownInstructors: [
        { name: 'Marc Maurice Costillas', rfid: '14230206', department: 'College of Computer Studies' },
        { name: 'Mark Anthony Nisnea', rfid: '14409518', department: 'College of Computer Studies' },
        { name: 'Rockford Jade Dagohoy', rfid: '16864846', department: 'College of Computer Studies' },
        { name: 'Emily Davis', rfid: '12345678', department: 'College of Computer Studies' },
        { name: 'Maria Rodriguez', rfid: '01641066', department: 'College of Computer Studies' }
      ],
      autoCheckoutInterval: null,
            // Logbook entries
      logEntries: [
        {
          id: "14230206",
          name: 'Marc Maurice Costillas',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(),
          scheduledStart: '08:00 AM',
          scheduledEnd: '12:00 PM',
          timeIn: '08:30 AM',
          timeOut: '12:30 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          subject: 'Web Development',
          section: 'BSIT-3A',
          autoLogout: false
        },
        {
          id: "14409518",
          name: 'Mark Anthony Nisnea',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(),
          scheduledStart: '09:00 AM',
          scheduledEnd: '12:00 PM',
          timeIn: '09:15 AM',
          timeOut: null,
          status: 'in',
          photoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
          subject: 'Database Management',
          section: 'BSIT-3B',
          autoLogout: false
        },
        {
          id: "16864846",
          name: 'Rockford Jade Dagohoy',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(),
          scheduledStart: '08:00 AM',
          scheduledEnd: '03:00 PM',
          timeIn: '08:00 AM',
          timeOut: '03:45 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
          subject: 'Digital Electronics',
          section: 'BSIT-3A',
          autoLogout: false
        },
        {
          id: "12345678",
          name: 'Emily Davis',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(-1), // Yesterday
          scheduledStart: '09:00 AM',
          scheduledEnd: '04:00 PM',
          timeIn: '10:00 AM',
          timeOut: '04:00 PM',
          manualTimeOut: '04:35 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
          subject: 'Data Structures',
          section: 'BSIT-3C',
          autoLogout: true
        },
        {
          id: "01641066",
          name: 'Maria Rodriguez',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(-1), // Yesterday
          scheduledStart: '08:30 AM',
          scheduledEnd: '04:00 PM',
          timeIn: '08:30 AM',
          timeOut: '04:30 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
          subject: 'Network Security',
          section: 'BSIT-4A',
          autoLogout: false
        },
        {
          id: "87654321",
          name: 'John Smith',
          department: 'College of Computer Studies',
          date: this.getCurrentDate(-2), // Two days ago
          scheduledStart: '10:00 AM',
          scheduledEnd: '01:00 PM',
          timeIn: '10:05 AM',
          timeOut: '01:00 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
          subject: 'Software Engineering',
          section: 'BSIT-4B',
          autoLogout: true
        }
      ],
      
      // Filters
      dateFilter: 'all',
      specificDate: {
        start: this.getDefaultStartDate(),
        end: this.getDefaultEndDate()
      },
      selectedDepartment: '',
      selectedStatus: '',
      selectedInstructor: '',
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // Notification
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    isManualFormValid() {
      return this.manualInstructorName.trim() !== '';
    },
    uniqueInstructors() {
      // Get unique instructor names from logbook entries
      const instructorNames = this.logEntries.map(entry => entry.name);
      return [...new Set(instructorNames)].sort();
    },
    filteredLogEntries() {
      let filtered = [...this.logEntries];
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of month
        
        filtered = filtered.filter(entry => {
          const entryDate = new Date(entry.date);
          
          if (this.dateFilter === 'custom') {
            const startDate = this.specificDate.start ? new Date(this.specificDate.start) : null;
            const endDate = this.specificDate.end ? new Date(this.specificDate.end) : null;
            
            if (startDate && endDate) {
              // Set end date to end of day
              endDate.setHours(23, 59, 59, 999);
              return entryDate >= startDate && entryDate <= endDate;
            } else if (startDate) {
              return entryDate >= startDate;
            } else if (endDate) {
              endDate.setHours(23, 59, 59, 999);
              return entryDate <= endDate;
            }
            return true;
          } else if (this.dateFilter === 'today') {
            const todayStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            return entry.date === todayStr;
          } else if (this.dateFilter === 'week') {
            return entryDate >= startOfWeek;
          } else if (this.dateFilter === 'month') {
            return entryDate >= startOfMonth;
          }
          return true;
        });
      }
      
      // Apply department filter
      if (this.selectedDepartment) {
        filtered = filtered.filter(entry => entry.department === this.selectedDepartment);
      }
      
      // Apply status filter
      if (this.selectedStatus) {
        filtered = filtered.filter(entry => entry.status === this.selectedStatus);
      }
      
      // Apply instructor filter
      if (this.selectedInstructor) {
        filtered = filtered.filter(entry => entry.name === this.selectedInstructor);
      }
      
      return filtered;
    },
    paginatedLogEntries() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredLogEntries.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredLogEntries.length / this.itemsPerPage);
    }
  },
  mounted() {
    // Focus on the hidden RFID input field
    this.$refs.rfidInput.focus();
    
    // Add event listener to keep focus on the RFID input field
    // Exclude clicks on select elements and their children
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Set up auto-checkout interval (check every minute)
    this.autoCheckoutInterval = setInterval(this.checkForAutoCheckouts, 60000);
    
    // Set default schedule end time to 2 hours from now
    const now = new Date();
    now.setHours(now.getHours() + 2);
    this.manualScheduleEnd = now.toTimeString().substring(0, 5); // Format: HH:MM
  },
  beforeUnmount() {
    // Remove event listeners
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Clear any existing timeout
    if (this.autoConfirmTimeout) {
      clearTimeout(this.autoConfirmTimeout);
    }
    
    // Clear auto-checkout interval
    if (this.autoCheckoutInterval) {
      clearInterval(this.autoCheckoutInterval);
    }
  },
  methods: {
    // RFID related methods
    focusRfidInput() {
      this.$refs.rfidInput.focus();
    },
    handleDocumentClick(event) {
      // Don't refocus if clicking on a select, input, or their children
      const isFormElement = event.target.closest('select') || 
                            event.target.closest('input') || 
                            event.target.closest('option') ||
                            event.target.tagName === 'SELECT' || 
                            event.target.tagName === 'INPUT' || 
                            event.target.tagName === 'OPTION';
      
      if (!isFormElement) {
        this.focusRfidInput();
      }
    },
    handleKeyDown(event) {
      // Only refocus for non-input related keys
      if (!event.target.closest('select') && 
          !event.target.closest('input') && 
          event.key !== 'Tab') {
        this.focusRfidInput();
      }
    },
    getCurrentDate(daysOffset = 0) {
      const date = new Date();
      if (daysOffset) {
        date.setDate(date.getDate() + daysOffset);
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    
    // Calculate lateness in minutes
    calculateLateness(entry) {
      if (!entry.timeIn || !entry.scheduledStart) return null;
      
      const scheduledTime = this.convertTimeToMinutes(entry.scheduledStart);
      const actualTime = this.convertTimeToMinutes(entry.timeIn);
      
      // If the actual time is later than scheduled time, calculate the difference
      if (actualTime > scheduledTime) {
        return actualTime - scheduledTime;
      }
      
      return null; // Not late
    },
    
    // Calculate overtime in minutes
    calculateOvertime(entry) {
      // Use manual time-out if available, otherwise use regular time-out
      const timeOut = entry.manualTimeOut || entry.timeOut;
      if (!timeOut || !entry.scheduledEnd) return null;
      
      const scheduledTime = this.convertTimeToMinutes(entry.scheduledEnd);
      const actualTime = this.convertTimeToMinutes(timeOut);
      
      // If the actual time is later than scheduled time, calculate the difference
      if (actualTime > scheduledTime) {
        return actualTime - scheduledTime;
      }
      
      return null; // No overtime
    },
    
    // Convert time string (e.g., "08:30 AM") to minutes since midnight
    convertTimeToMinutes(timeStr) {
      if (!timeStr) return 0;
      
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    },
    processRfidScan() {
  if (!this.rfidValue) return;

  // Prevent multiple scans in quick succession
  const now = new Date().getTime();
  if (this.lastScanTime && (now - this.lastScanTime) < 1000) {
    // Less than 1 second since last scan, ignore
    this.rfidValue = '';
    return;
  }
  this.lastScanTime = now;

  // Play a beep sound to indicate scan
  this.playBeepSound();

  // Find instructor by RFID ID using the findInstructorById method
  const instructor = this.findInstructorById(this.rfidValue);

  if (instructor) {
    const nowDate = new Date();
    const logData = {
      rfid_id: instructor.id,
      name: instructor.name,
      department: instructor.department || null,
      subject: instructor.subject || null,
      section: instructor.section || null,
      status: instructor.status === 'out' ? 'in' : 'out',
      time_in: instructor.status === 'out' ? nowDate.toISOString() : null,
      time_out: instructor.status === 'in' ? nowDate.toISOString() : null,
    };

    this.showModal = true;

    // Insert log into Supabase
    supabase
      .from('logs')
      .insert([logData])
      .then(({ data, error }) => {
        if (error) {
          console.error('Error inserting log:', error.message);
          this.showNotification('Failed to log attendance. Please try again.', 'error');
        } else {
          console.log('Log inserted successfully:', data);
          this.showNotification(`${instructor.name} has ${logData.status === 'in' ? 'checked in' : 'checked out'}`, 'success');
        }
      });

    // Update the instructor's status locally
    instructor.status = logData.status;

    // Clear RFID input
    this.rfidValue = '';
  } else {
    this.showNotification('Unknown RFID card', 'error');
    this.rfidValue = '';
  }
},
    findInstructorById(rfidId) {
      // For demo purposes, we'll use the logEntries as our instructor database
      // In a real application, you would query your database
      const instructor = this.logEntries.find(entry => entry.id.toString() === rfidId);
      
      if (!instructor) {
        // Create a mock instructor for testing
        if (rfidId === '12345678') {
          return {
            id: rfidId,
            name: 'Test Instructor',
            department: 'Computer Science',
            subject: 'Test Subject',
            section: 'TS-101',
            status: 'out',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
          };
        } else if (rfidId === '01641066') {
          return {
            id: rfidId,
            name: 'Maria Rodriguez',
            department: 'Information Technology',
            subject: 'Cybersecurity',
            section: 'IT-501',
            status: 'in',
            avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
          };
        } else if (rfidId === '0087654321') {
          return {
            id: rfidId,
            name: 'Alex Johnson',
            department: 'Computer Engineering',
            subject: 'Robotics',
            section: 'CE-301',
            status: 'out',
            avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
          };
        } else if (rfidId === '14230206') {
          return {
            id: rfidId,
            name: 'Marc Maurice Costillas',
            department: 'College of Computer Studies',
            subject: 'Web Development',
            section: 'BSIT-3A',
            status: 'out',
            avatar: '/images/jo.jpeg'
          };
        }else if (rfidId === '14409518') {
          return {
            id: rfidId,
            name: 'Mark Anothony Nisnea',
            department: 'College of Computer Studies',
            subject: 'Web Development',
            section: 'BSIT-3B',
            status: 'out',
            avatar: '/images/jo.jpeg'
          };
        }else if (rfidId === '16864846') {
          return {
            id: rfidId,
            name: 'Rockford Jade Dagohoy',
            department: 'College of Computer Studies',
            subject: 'Web Development',
            section: 'BSIT-3A',
            status: 'out',
            avatar: '/images/jo.jpeg'
          };
        }

      }
      
      return instructor;
    },
    confirmAttendance() {
      if (!this.currentInstructor) return;
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      
      // Check if the instructor is already in the logbook
      const existingEntryIndex = this.logEntries.findIndex(entry => 
        entry.id.toString() === this.currentInstructor.id.toString() && 
        entry.date === dateString && 
        entry.status === 'in'
      );
      
      if (this.currentInstructor.status === 'out') {
        // Checking in
        if (existingEntryIndex === -1) {
          // Add new entry
          this.logEntries.unshift({
            id: this.currentInstructor.id,
            name: this.currentInstructor.name,
            department: this.currentInstructor.department,
            date: dateString,
            timeIn: timeString,
            timeOut: null,
            status: 'in',
            photoUrl: this.currentInstructor.avatar || this.currentInstructor.photoUrl,
            subject: this.currentInstructor.subject,
            section: this.currentInstructor.section
          });
          
          this.showNotification(`${this.currentInstructor.name} has checked in`, 'success');
        } else {
          this.showNotification(`${this.currentInstructor.name} is already checked in`, 'info');
        }
      } else {
        // Checking out
        if (existingEntryIndex !== -1) {
          // Update existing entry
          this.logEntries[existingEntryIndex].timeOut = timeString;
          this.logEntries[existingEntryIndex].status = 'out';
          this.logEntries[existingEntryIndex].checkoutTime = Date.now();
          
          this.showNotification(`${this.currentInstructor.name} has checked out`, 'success');
        } else {
          this.showNotification(`No active check-in found for ${this.currentInstructor.name}`, 'error');
        }
      }
      
      // Close the modal
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.currentInstructor = null;
      this.focusRfidInput();
      
      // Clear any existing timeout
      if (this.autoConfirmTimeout) {
        clearTimeout(this.autoConfirmTimeout);
        this.autoConfirmTimeout = null;
      }
    },
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    
    // Filter and pagination methods
    applyFilters() {
      this.currentPage = 1; // Reset to first page when filters change
      
      // Show notification that filters have been applied
      this.showNotification('Filters applied successfully', 'success');
      
      // In a real application, you might fetch filtered data from an API here
      // For now, we're using the computed filteredLogEntries property
    },
    
    getDefaultStartDate() {
      const date = new Date();
      date.setDate(date.getDate() - 7); // Default to 7 days ago
      return date.toISOString().split('T')[0];
    },
    
    getDefaultEndDate() {
      return new Date().toISOString().split('T')[0]; // Today
    },
    
    // Manual check-in methods
    closeManualCheckInModal() {
      this.showManualCheckInModal = false;
      this.resetManualForm();
    },
    
    resetManualForm() {
      this.manualInstructorName = '';
      this.instructorValidationMessage = '';
    },
    
    validateInstructor() {
      if (!this.manualInstructorName) {
        this.instructorValidationMessage = '';
        return;
      }
      
      const instructor = this.knownInstructors.find(i => i.name === this.manualInstructorName);
      if (instructor) {
        this.instructorValidationMessage = 'Instructor found in system';
      } else {
        this.instructorValidationMessage = 'Instructor not found in system';
      }
    },
    
    // Focus the name input when modal opens
    showManualCheckInForm() {
      this.showManualCheckInModal = true;
      this.$nextTick(() => {
        if (this.$refs.manualNameInput) {
          this.$refs.manualNameInput.focus();
        }
      });
    },
    
    submitManualCheckIn() {
      if (!this.isManualFormValid) return;
      
      // Find the instructor in our known list
      const instructor = this.knownInstructors.find(i => i.name === this.manualInstructorName);
      if (!instructor) {
        this.showNotification('Instructor not found in system', 'error');
        return;
      }
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const dateString = this.getCurrentDate();
      
      // Generate a unique ID based on name and timestamp
      const uniqueId = 'manual-' + Date.now().toString();
      
      // Set default end time to 2 hours from now
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);
      const scheduleEnd = endTime.toTimeString().substring(0, 5); // Format: HH:MM
      
      // Check if instructor is already checked in
      const existingEntryIndex = this.logEntries.findIndex(entry => 
        entry.name === this.manualInstructorName && 
        entry.status === 'in'
      );
      
      if (existingEntryIndex !== -1) {
        // Instructor is already checked in, so check them out
        this.logEntries[existingEntryIndex].timeOut = timeString;
        this.logEntries[existingEntryIndex].status = 'out';
        this.logEntries[existingEntryIndex].checkoutTime = Date.now();
        
        this.showNotification(`${this.manualInstructorName} has checked out`, 'success');
      } else {
        // Check if instructor has recently checked out (within the last hour)
        const recentCheckout = this.logEntries.find(entry => 
          entry.name === this.manualInstructorName && 
          entry.status === 'out' &&
          entry.checkoutTime && 
          (Date.now() - entry.checkoutTime) < 3600000 // 1 hour in milliseconds
        );
        
        if (recentCheckout) {
          // Calculate time remaining in the buffer period
          const minutesElapsed = Math.floor((Date.now() - recentCheckout.checkoutTime) / 60000);
          const minutesRemaining = 60 - minutesElapsed;
          
          this.showNotification(`This instructor has logged out recently. Please wait ${minutesRemaining} minutes before logging in again.`, 'error');
          return;
        }
        
        // Add new check-in entry
        this.logEntries.unshift({
          id: uniqueId,
          name: this.manualInstructorName,
          department: instructor.department,
          date: dateString,
          timeIn: timeString,
          timeOut: null,
          status: 'in',
          subject: 'Laboratory Session', // Default subject
          section: 'N/A',
          scheduleEnd: scheduleEnd, // Store schedule end time
          checkoutTime: null
        });
        
        this.showNotification(`${this.manualInstructorName} has checked in`, 'success');
      }
      
      // Close modal and reset form
      this.closeManualCheckInModal();
      
      // Focus on RFID input after closing modal
      this.$nextTick(() => {
        this.focusRfidInput();
      });
    },
    
    checkForAutoCheckouts() {
      // Get current time
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      // Check all active check-ins
      this.logEntries.forEach((entry, index) => {
        if (entry.status === 'in' && entry.scheduleEnd) {
          // Extract schedule end time
          const [endHours, endMinutes] = entry.scheduleEnd.split(':').map(Number);
          const endTimeInMinutes = endHours * 60 + endMinutes;
          
          // If current time is past the schedule end time, auto-checkout
          if (currentTimeInMinutes >= endTimeInMinutes) {
            // Update entry
            this.logEntries[index].timeOut = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            this.logEntries[index].status = 'out';
            
            // Show notification
            this.showNotification(`${entry.name} has been automatically checked out`, 'info');
          }
        }
      });
    },
    
    getInitials(name) {
      if (!name) return '';
      
      // Split the name by spaces
      const parts = name.split(' ');
      
      // Get first letter of first name
      const firstInitial = parts[0].charAt(0);
      
      // Get first letter of last name (if it exists)
      const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
      
      // Return the combined initials
      return (firstInitial + lastInitial).toUpperCase();
    },
    
    getAvatarColor(name) {
      if (!name) return '#DD3859'; // Default color
      
      // Generate a consistent color based on the name
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Use a predefined color palette for better aesthetics
      const colors = [
        '#DD3859', // Primary brand color
        '#4CAF50', // Green
        '#2196F3', // Blue
        '#FF9800', // Orange
        '#9C27B0', // Purple
        '#00BCD4', // Cyan
        '#3F51B5', // Indigo
        '#795548', // Brown
        '#607D8B', // Blue Grey
        '#E91E63'  // Pink
      ];
      
      // Use the hash to pick a color from the palette
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    
    playBeepSound() {
      // Create an audio context
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 1000; // value in hertz
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set volume
        gainNode.gain.value = 0.1;
        
        // Start and stop the beep
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 150);
      } catch (e) {
        console.log('Audio not supported in this browser');
      }
    },
  }
};
</script>

<style scoped>
.logbook-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

/* RFID Input Styling */
.rfid-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Logbook Content Styling */
.logbook-content {
  margin-top: 8px;
}

.logbook-header {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1.2fr 1fr 1fr 0.8fr;
  gap: 16px;
  padding: 16px;
  background-color: #DD3859;
  border-radius: 12px;
  margin-bottom: 16px;
}

.header-item {
  color: white;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

.logbook-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logbook-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  background-color: white;
}

.logbook-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.logbook-item {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1.2fr 1fr 1fr 0.8fr;
  gap: 16px;
  align-items: center;
  padding: 16px;
}

.instructor, .department, .date, .scheduled, .time-in, .time-out {
  font-size: 14px;
  color: #64748B;
  font-family: 'Poppins', sans-serif;
}

.scheduled {
  font-weight: 500;
  color: #4B5563;
}

.time-in, .time-out {
  position: relative;
}

.instructor {
  font-weight: 600;
  color: #1E293B;
}

.status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  text-align: center;
}

.status-badge.in {
  background-color: #e6f7e6;
  color: #22c55e;
}

.status-badge.out {
  background-color: #f1f1f1;
  color: #6b7280;
}

.time-diff {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 4px;
  margin-left: 5px;
  font-weight: bold;
  vertical-align: middle;
  white-space: nowrap;
}

.time-diff.late {
  background-color: #FEE2E2;
  color: #DC2626;
  border: 1px solid #FECACA;
}

.time-diff.overtime {
  background-color: #DBEAFE;
  color: #2563EB;
  border: 1px solid #BFDBFE;
}

.auto-logout {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 4px;
  margin-left: 5px;
  font-weight: bold;
  background-color: #E5E7EB;
  color: #4B5563;
  border: 1px solid #D1D5DB;
  vertical-align: middle;
}

.manual-logout {
  display: block;
  font-size: 0.7rem;
  padding: 2px 5px;
  margin-top: 4px;
  font-weight: bold;
  color: #4B5563;
  background-color: #F3F4F6;
  border-radius: 4px;
  border: 1px solid #E5E7EB;
}

.empty-logbook {
  padding: 48px 0;
  text-align: center;
  color: #64748B;
  font-size: 16px;
}

/* Pagination Styling */
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
  border: 1px solid #E2E8F0;
  background-color: white;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #F8FAFC;
  color: #DD3859;
  border-color: #DD3859;
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

/* RFID Modal Styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E2E8F0;
  background-color: #F8FAFC;
}

.modal-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 18px;
  color: #1E293B;
  font-family: 'Poppins', sans-serif;
}

.modal-header h2 svg {
  color: #DD3859;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #F1F5F9;
  color: #DD3859;
  border-color: #DD3859;
}

.modal-body {
  padding: 24px;
}

.instructor-details {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.instructor-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #DD3859;
}

.instructor-photo .initials-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}

.instructor-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.instructor-info {
  flex: 1;
}

.instructor-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1E293B;
  font-family: 'Poppins', sans-serif;
}

.instructor-metadata {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748B;
}

.metadata-item svg {
  color: #94A3B8;
}

.attendance-status {
  margin: 32px 0;
  text-align: center;
}

.status-badge-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 12px;
  gap: 16px;
  min-width: 200px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.status-badge-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.status-badge-large.time-in {
  color: #10B981;
  border-color: #10B981;
  background-color: transparent;
}

.status-badge-large.time-out {
  color: #DD3859;
  border-color: #DD3859;
  background-color: transparent;
}

.status-icon {
  margin-bottom: 8px;
}

.status-icon svg {
  stroke: currentColor;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}

/* Notification Styling */
.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: white;
  color: #1e293b;
  border: 2px solid #DD3859;
  font-size: 14px;
  font-weight: 500;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1001;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.notification.show {
  transform: translateY(0);
  opacity: 1;
}

.notification.success,
.notification.error,
.notification.info {
  background-color: white;
  color: #1e293b;
  border: 2px solid #DD3859;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .logbook-header, .logbook-item {
    grid-template-columns: 1fr 1fr;
  }
  
  .header-item:nth-child(n+3), .logbook-item > div:nth-child(n+3) {
    display: none;
  }
  
  .instructor-details {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
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
  font-family: 'Poppins', sans-serif;
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

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.date-picker {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
  font-family: 'Poppins', sans-serif;
}

.date-picker:focus {
  outline: none;
  border-color: #DD3859;
}

.date-range-picker span {
  color: #64748B;
  font-size: 14px;
}

.manual-checkin {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.logbook-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.manual-checkin-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.manual-checkin-btn:hover {
  background-color: #c9314f;
}



.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #DD3859;
}

.form-help-text {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
  font-style: italic;
}

.check-type-options {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.check-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.submit-btn {
  padding: 10px 24px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #c62c4c;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.submit-btn:disabled {
  background-color: #E2E8F0;
  color: #94A3B8;
  cursor: not-allowed;
}

.logbook-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.logbook-content {
  margin-top: 8px;
}
</style>
