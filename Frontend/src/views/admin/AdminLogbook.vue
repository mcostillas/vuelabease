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
                <div class="time-in">{{ entry.timeIn }}</div>
                <div class="time-out">{{ entry.timeOut || '—' }}</div>
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
              <img :src="currentInstructor.photoUrl || currentInstructor.avatar" alt="Instructor Photo">
            </div>
            <div class="instructor-info">
              <h3>{{ currentInstructor.name }}</h3>
              <div class="instructor-metadata">
                <div class="metadata-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    
    <!-- Notification -->
    <div class="notification" :class="[notification.type, { show: notification.show }]">
      {{ notification.message }}
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';

export default {
  name: 'AdminLogbook',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      // RFID related data
      rfidValue: '',
      showModal: false,
      currentInstructor: null,
      autoConfirmTimeout: null,
      
      // Logbook entries
      logEntries: [
        {
          id: 1,
          name: 'John Doe',
          department: 'Computer Science',
          date: '2023-11-15',
          timeIn: '08:30 AM',
          timeOut: '04:30 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
          subject: 'Web Development',
          section: 'CS-201'
        },
        {
          id: 2,
          name: 'Jane Smith',
          department: 'Information Technology',
          date: '2023-11-15',
          timeIn: '09:15 AM',
          timeOut: null,
          status: 'in',
          photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
          subject: 'Database Management',
          section: 'IT-301'
        },
        {
          id: 3,
          name: 'Robert Johnson',
          department: 'Computer Engineering',
          date: '2023-11-15',
          timeIn: '08:00 AM',
          timeOut: '03:45 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
          subject: 'Digital Electronics',
          section: 'CE-401'
        },
        {
          id: 4,
          name: 'Emily Davis',
          department: 'Computer Science',
          date: '2023-11-15',
          timeIn: '10:00 AM',
          timeOut: null,
          status: 'in',
          photoUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
          subject: 'Data Structures',
          section: 'CS-202'
        },
        {
          id: 5,
          name: 'Michael Wilson',
          department: 'Information Technology',
          date: '2023-11-14',
          timeIn: '08:30 AM',
          timeOut: '04:30 PM',
          status: 'out',
          photoUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
          subject: 'Network Security',
          section: 'IT-401'
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
    filteredLogEntries() {
      let filtered = [...this.logEntries];
      
      // Apply date filter
      if (this.dateFilter !== 'all') {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (this.dateFilter === 'custom') {
          const startDate = new Date(this.specificDate.start);
          const endDate = new Date(this.specificDate.end);
          // Set end date to end of day
          endDate.setHours(23, 59, 59, 999);
          
          filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
          });
        } else {
          filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            if (this.dateFilter === 'today') {
              return entryDate >= startOfDay;
            } else if (this.dateFilter === 'week') {
              return entryDate >= startOfWeek;
            } else if (this.dateFilter === 'month') {
              return entryDate >= startOfMonth;
            }
            return true;
          });
        }
      }
      
      // Apply department filter
      if (this.selectedDepartment) {
        filtered = filtered.filter(entry => entry.department === this.selectedDepartment);
      }
      
      // Apply status filter
      if (this.selectedStatus) {
        filtered = filtered.filter(entry => entry.status === this.selectedStatus);
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
  },
  beforeUnmount() {
    // Remove event listeners
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Clear any existing timeout
    if (this.autoConfirmTimeout) {
      clearTimeout(this.autoConfirmTimeout);
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
    processRfidScan() {
      if (!this.rfidValue) return;
      
      // Find instructor by RFID ID using the findInstructorById method
      const instructor = this.findInstructorById(this.rfidValue);
      
      if (instructor) {
        this.currentInstructor = instructor;
        this.showModal = true;
      } else {
        this.showNotification('RFID not recognized', 'error');
      }
      
      // Clear RFID value
      this.rfidValue = '';
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
    }
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
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr;
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
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px;
}

.instructor, .department, .date, .time-in, .time-out {
  font-size: 14px;
  color: #64748B;
  font-family: 'Poppins', sans-serif;
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
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #10B981;
  display: inline-block;
  border: 1px solid #10B981;
  background-color: transparent;
}

.status-badge.in {
  color: #10B981;
  border-color: #10B981;
}

.status-badge.out {
  color: #DD3859;
  border-color: #DD3859;
}

.empty-logbook {
  padding: 48px 0;
  text-align: center;
  color: #64748B;
  font-family: 'Poppins', sans-serif;
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
