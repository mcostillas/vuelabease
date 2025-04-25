<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Reports" />
    <div class="reports-container">
      <!-- Laboratory Usage Section -->
      <div class="report-section">
        <div class="section-header">
          <h2>Laboratory Usage</h2>
          <div class="section-actions">
            <div class="filter-container">
              <select v-model="selectedLabPeriod" class="filter-select" @change="updateLabUsageData">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <div v-if="selectedLabPeriod === 'custom'" class="date-range-picker">
                <input type="date" v-model="labDateRange.start" class="date-input" @change="updateLabUsageData" />
                <span>to</span>
                <input type="date" v-model="labDateRange.end" class="date-input" @change="updateLabUsageData" />
              </div>
              
              <select v-model="selectedLabDepartment" class="filter-select" @change="updateLabUsageData">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              
              <button class="action-button" @click="exportLabUsage">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
        </div>
        
        <!-- Lab Usage Summary Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 14L11 10L15 14L21 8" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getTotalLabHours() }} hours</div>
              <div class="metric-label">Total Usage Hours</div>
              <div class="metric-detail">Across all labs</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getAverageHoursPerDay() }}</div>
              <div class="metric-label">Average Hours</div>
              <div class="metric-detail">Per day</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 7H7" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 14H7" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 4H10C9.44772 4 9 4.44772 9 5V21H18V5C18 4.44772 17.5523 4 17 4Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getMostUsedLab() }}</div>
              <div class="metric-label">Most Used Lab</div>
              <div class="metric-detail">{{ getMostUsedLabHours() }} hours</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getPeakUsageTime() }}</div>
              <div class="metric-label">Peak Usage Time</div>
              <div class="metric-detail">Most active period</div>
            </div>
          </div>
        </div>
        
        <!-- Usage Bars -->
        <div class="section-subheader">
          <h3>Usage by Laboratory</h3>
          <div class="view-toggle">
            <button 
              @click="labViewMode = 'hours'" 
              :class="{ 'active': labViewMode === 'hours' }"
              class="toggle-btn"
            >Hours</button>
            <button 
              @click="labViewMode = 'sessions'" 
              :class="{ 'active': labViewMode === 'sessions' }"
              class="toggle-btn"
            >Sessions</button>
            <button 
              @click="labViewMode = 'utilization'" 
              :class="{ 'active': labViewMode === 'utilization' }"
              class="toggle-btn"
            >Utilization %</button>
          </div>
        </div>
        
        <div class="usage-bars">
          <div class="usage-bar-item" v-for="room in filteredLabUsageData" :key="room.id">
            <div class="usage-bar-header">
              <div class="usage-name">Lab {{ room.id }}</div>
              <div class="usage-value" v-if="labViewMode === 'hours'">{{ room.hours }} hours</div>
              <div class="usage-value" v-else-if="labViewMode === 'sessions'">{{ room.sessions }} sessions</div>
              <div class="usage-value" v-else>{{ room.utilization }}% utilized</div>
            </div>
            <div class="usage-bar-container">
              <div class="usage-bar" 
                   :style="{ 
                     width: getBarWidth(room), 
                     backgroundColor: getBarColor(getBarValue(room)) 
                   }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Attendance Statistics Section -->
      <div class="report-section">
        <div class="section-header">
          <h2>Attendance Statistics</h2>
          <div class="section-actions">
            <div class="filter-container">
              <select v-model="selectedAttendancePeriod" class="filter-select">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="custom">Custom Range</option>
              </select>
              <div v-if="selectedAttendancePeriod === 'custom'" class="date-range-picker">
                <input type="date" v-model="selectedDateRange.start" class="date-input" />
                <span>to</span>
                <input type="date" v-model="selectedDateRange.end" class="date-input" />
              </div>
              <select v-model="selectedDepartment" class="filter-select">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
              <select v-model="selectedInstructor" class="filter-select">
                <option value="">All Instructors</option>
                <option v-for="instructor in instructors" :key="instructor" :value="instructor">{{ instructor }}</option>
              </select>
              <button class="action-button" @click="exportAttendanceStats">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ lateEntriesCount }}</div>
              <div class="metric-label">Late Entries</div>
              <div class="metric-detail">
                {{ totalLateMinutes }} total minutes
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ overtimeEntriesCount }}</div>
              <div class="metric-label">Overtime Entries</div>
              <div class="metric-detail">
                {{ totalOvertimeMinutes }} total minutes
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ punctualEntriesCount }}</div>
              <div class="metric-label">Punctual Entries</div>
              <div class="metric-detail">
                {{ punctualPercentage }}% of total
              </div>
            </div>
          </div>
        </div>
        
        <div class="attendance-table">
          <div class="table-header">
            <div class="header-cell">Instructor</div>
            <div class="header-cell">Department</div>
            <div class="header-cell">Date</div>
            <div class="header-cell">Scheduled Start</div>
            <div class="header-cell">Scheduled End</div>
            <div class="header-cell">Time In</div>
            <div class="header-cell">Time Out</div>
            <div class="header-cell">Late</div>
            <div class="header-cell">Overtime</div>
          </div>
          
          <div class="table-body">
            <div class="table-row" v-for="entry in filteredAttendanceData" :key="entry.id">
              <div class="table-cell">{{ entry.name }}</div>
              <div class="table-cell">{{ entry.department }}</div>
              <div class="table-cell">{{ entry.date }}</div>
              <div class="table-cell">{{ entry.scheduledStart }}</div>
              <div class="table-cell">{{ entry.scheduledEnd }}</div>
              <div class="table-cell">{{ entry.timeIn }}</div>
              <div class="table-cell">{{ entry.manualTimeOut || entry.timeOut || '-' }}</div>
              <div class="table-cell">
                <span v-if="calculateLateness(entry)" class="late-badge">{{ calculateLateness(entry) }} min</span>
                <span v-else>-</span>
              </div>
              <div class="table-cell">
                <span v-if="calculateOvertime(entry)" class="overtime-badge">{{ calculateOvertime(entry) }} min</span>
                <span v-else>-</span>
              </div>
            </div>
            
            <div v-if="filteredAttendanceData.length === 0" class="empty-table">
              <p>No attendance data available for the selected filters.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bookings Information Section -->
      <div class="report-section">
        <div class="section-header">
          <h2>Bookings Information</h2>
          <div class="section-actions">
            <div class="filter-container">
              <select v-model="selectedBookingPeriod" class="filter-select">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
              </select>
              <button class="action-button" @click="exportBookings">
                <i class="fas fa-download"></i> Export
              </button>
            </div>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#DD3859" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ bookingStats.totalBookings }}</div>
              <div class="metric-label">Total Bookings</div>
              <div class="metric-trend positive">
                +{{ bookingStats.growth }} from last period
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L9 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ bookingStats.avgDuration }}</div>
              <div class="metric-label">Average Duration</div>
              <div class="metric-detail">
                Per booking
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 7H10M9 11H10M14 7H15M14 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ bookingStats.mostBookedLab }}</div>
              <div class="metric-label">Most Booked Lab</div>
              <div class="metric-detail">
                {{ bookingStats.mostBookedCount }} bookings
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- User Statistics Section -->
      <div class="report-section">
        <div class="section-header">
          <h2>User Statistics</h2>
          <div class="section-actions">
            <button class="action-button" @click="exportUserStats">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 17.3438 16.8736 16.717 16.6438 16.1429M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M7 20V18C7 17.3438 7.12642 16.717 7.35625 16.1429M7.35625 16.1429C8.0935 14.301 9.89482 13 12 13C14.1052 13 15.9065 14.301 16.6438 16.1429M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM21 10C21 11.1046 20.1046 12 19 12C17.8954 12 17 11.1046 17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10ZM7 10C7 11.1046 6.10457 12 5 12C3.89543 12 3 11.1046 3 10C3 8.89543 3.89543 8 5 8C6.10457 8 7 8.89543 7 10Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ userStats.totalUsers }}</div>
              <div class="metric-label">Total Users</div>
              <div class="metric-detail">
                {{ userStats.activeUsers }} active this month
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ userStats.mostActiveUser }}</div>
              <div class="metric-label">Most Active User</div>
              <div class="metric-detail">
                {{ userStats.mostActiveCount }} sessions
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 17H15M9 13H15M9 9H10M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21H5M19 21H21M5 21H3" stroke="#DD3859" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ userStats.avgSessions }}</div>
              <div class="metric-label">Avg. Sessions</div>
              <div class="metric-detail">
                Per user
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'AdminReports',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get date for one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const startDate = oneMonthAgo.toISOString().split('T')[0];
    
    return {
      // Filter selections
      selectedLabPeriod: 'month',
      selectedAttendancePeriod: 'month',
      selectedBookingPeriod: 'month',
      selectedInstructor: '',
      selectedDepartment: '',
      selectedLabDepartment: '',
      labViewMode: 'hours',
      selectedDateRange: {
        start: startDate,
        end: today
      },
      labDateRange: {
        start: startDate,
        end: today
      },
      // Laboratory usage data
      labUsageData: [
        { id: 1, hours: 120, sessions: 45, utilization: 75, department: 'College of Computer Studies' },
        { id: 2, hours: 85, sessions: 32, utilization: 53, department: 'College of Engineering' },
        { id: 3, hours: 150, sessions: 60, utilization: 94, department: 'College of Computer Studies' },
        { id: 4, hours: 60, sessions: 25, utilization: 38, department: 'College of Science' },
        { id: 5, hours: 95, sessions: 38, utilization: 59, department: 'College of Engineering' }
      ],
      // Attendance data
      attendanceData: [
        {
          id: "14230206",
          name: 'Marc Maurice Costillas',
          department: 'College of Computer Studies',
          date: today,
          scheduledStart: '08:00 AM',
          scheduledEnd: '12:00 PM',
          timeIn: '08:30 AM',
          timeOut: '12:30 PM',
          status: 'out',
          subject: 'Web Development',
          section: 'BSIT-3A',
          autoLogout: false
        },
        {
          id: "14409518",
          name: 'Mark Anthony Nisnea',
          department: 'College of Computer Studies',
          date: today,
          scheduledStart: '09:00 AM',
          scheduledEnd: '12:00 PM',
          timeIn: '09:15 AM',
          timeOut: null,
          status: 'in',
          subject: 'Database Management',
          section: 'BSIT-3B',
          autoLogout: false
        },
        {
          id: "16864846",
          name: 'Rockford Jade Dagohoy',
          department: 'College of Computer Studies',
          date: today,
          scheduledStart: '08:00 AM',
          scheduledEnd: '03:00 PM',
          timeIn: '08:00 AM',
          timeOut: '03:45 PM',
          status: 'out',
          subject: 'Digital Electronics',
          section: 'BSIT-3A',
          autoLogout: false
        }
      ],
      
      departments: ['College of Computer Studies', 'College of Engineering', 'College of Science'],
      instructors: ['Marc Maurice Costillas', 'Mark Anthony Nisnea', 'Rockford Jade Dagohoy'],
      
      // Bookings statistics
      bookingStats: {
        totalBookings: 245,
        growth: '12%',
        avgDuration: '2.5 hours',
        mostBookedLab: 'Lab 3',
        mostBookedCount: 68
      },
      
      // User statistics
      userStats: {
        totalUsers: 450,
        activeUsers: 320,
        mostActiveUser: 'John Doe',
        mostActiveCount: 15,
        avgSessions: 3.2
      },
      
      // Notification
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    // Filtered lab usage data based on department filter
    filteredLabUsageData() {
      if (!this.selectedLabDepartment) {
        return this.labUsageData;
      }
      
      return this.labUsageData.filter(lab => lab.department === this.selectedLabDepartment);
    },
    
    // Filtered attendance data based on selected filters
    filteredAttendanceData() {
      if (!this.attendanceData || !Array.isArray(this.attendanceData)) {
        return [];
      }
      
      let filtered = this.attendanceData.slice(); // Create a copy of the array
      
      // Filter by date range
      if (this.selectedAttendancePeriod === 'custom' && this.selectedDateRange.start && this.selectedDateRange.end) {
        filtered = filtered.filter(entry => {
          return entry.date >= this.selectedDateRange.start && entry.date <= this.selectedDateRange.end;
        });
      } else if (this.selectedAttendancePeriod === 'week') {
        // Filter for current week
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        const firstDayStr = firstDayOfWeek.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        filtered = filtered.filter(entry => {
          return entry.date >= firstDayStr && entry.date <= todayStr;
        });
      } else if (this.selectedAttendancePeriod === 'month') {
        // Filter for current month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        filtered = filtered.filter(entry => {
          return entry.date >= firstDayStr && entry.date <= todayStr;
        });
      } else if (this.selectedAttendancePeriod === 'semester') {
        // Assuming semester is roughly 4 months
        const today = new Date();
        const firstDayOfSemester = new Date(today);
        firstDayOfSemester.setMonth(today.getMonth() - 4);
        const firstDayStr = firstDayOfSemester.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        
        filtered = filtered.filter(entry => {
          return entry.date >= firstDayStr && entry.date <= todayStr;
        });
      }
      
      // Filter by instructor
      if (this.selectedInstructor) {
        filtered = filtered.filter(entry => entry.name === this.selectedInstructor);
      }
      
      // Filter by department
      if (this.selectedDepartment) {
        filtered = filtered.filter(entry => entry.department === this.selectedDepartment);
      }
      
      return filtered;
    },
    
    // Statistics computed properties
    lateEntriesCount() {
      return this.filteredAttendanceData.filter(entry => this.calculateLateness(entry) !== null).length;
    },
    
    totalLateMinutes() {
      const lateEntries = this.filteredAttendanceData.filter(entry => this.calculateLateness(entry) !== null);
      if (lateEntries.length === 0) return 0;
      
      return Math.round(lateEntries.reduce((sum, entry) => sum + this.calculateLateness(entry), 0));
    },
    
    overtimeEntriesCount() {
      return this.filteredAttendanceData.filter(entry => this.calculateOvertime(entry) !== null).length;
    },
    
    totalOvertimeMinutes() {
      const overtimeEntries = this.filteredAttendanceData.filter(entry => this.calculateOvertime(entry) !== null);
      if (overtimeEntries.length === 0) return 0;
      
      return Math.round(overtimeEntries.reduce((sum, entry) => sum + this.calculateOvertime(entry), 0));
    },
    
    punctualEntriesCount() {
      return this.filteredAttendanceData.filter(entry => this.calculateLateness(entry) === null && entry.timeIn).length;
    },
    
    punctualPercentage() {
      const totalEntries = this.filteredAttendanceData.filter(entry => entry.timeIn).length;
      if (totalEntries === 0) return 0;
      
      return Math.round((this.punctualEntriesCount / totalEntries) * 100);
    },
  },
  methods: {
    // Convert time string (e.g., '08:30 AM') to minutes since midnight
    convertTimeToMinutes(timeStr) {
      if (!timeStr) return 0;
      
      // Parse the time string
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      // Return total minutes
      return hours * 60 + minutes;
    },
    getBarColor(value) {
      if (value < 40) {
        return '#10B981'; // Green for low usage
      } else if (value < 70) {
        return '#FBBF24'; // Yellow for medium usage
      } else {
        return '#DD3859'; // Red for high usage
      }
    },
    

    
    getBarWidth(room) {
      if (this.labViewMode === 'hours') {
        return (room.hours / this.getMaxHours() * 100) + '%';
      } else if (this.labViewMode === 'sessions') {
        const maxSessions = Math.max(...this.filteredLabUsageData.map(r => r.sessions));
        return (room.sessions / maxSessions * 100) + '%';
      } else {
        return room.utilization + '%';
      }
    },
    
    getBarValue(room) {
      if (this.labViewMode === 'hours') {
        return room.hours;
      } else if (this.labViewMode === 'sessions') {
        return room.sessions;
      } else {
        return room.utilization;
      }
    },
    
    getMaxHours() {
      return Math.max(...this.labUsageData.map(room => room.hours));
    },
  
    getTotalLabHours() {
      return this.filteredLabUsageData.reduce((total, room) => total + room.hours, 0);
    },
  
    getAverageHoursPerDay() {
      const totalHours = this.getTotalLabHours();
      // Calculate number of days in the selected period
      let days = 30; // Default to month
      
      if (this.selectedLabPeriod === 'week') {
        days = 7;
      } else if (this.selectedLabPeriod === 'semester') {
        days = 120;
      } else if (this.selectedLabPeriod === 'year') {
        days = 365;
      } else if (this.selectedLabPeriod === 'custom') {
        const start = new Date(this.labDateRange.start);
        const end = new Date(this.labDateRange.end);
        days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }
      
      return (totalHours / days).toFixed(1);
    },
  
    getMostUsedLab() {
      if (this.filteredLabUsageData.length === 0) return 'N/A';
      
      const mostUsed = this.filteredLabUsageData.reduce((prev, current) => {
        return (prev.hours > current.hours) ? prev : current;
      });
      
      return `Lab ${mostUsed.id}`;
    },
  
    getMostUsedLabHours() {
      if (this.filteredLabUsageData.length === 0) return 0;
      
      const mostUsed = this.filteredLabUsageData.reduce((prev, current) => {
        return (prev.hours > current.hours) ? prev : current;
      });
      
      return mostUsed.hours;
    },
  
    getPeakUsageTime() {
      // Since we removed the time distribution data, return a fixed value
      // or calculate based on lab usage data
      return '10am-12pm'; // Fixed value based on typical peak usage time
    },
  
    updateLabUsageData() {
      // In a real application, this would fetch data from the backend
      // For now, we'll just simulate filtering
      this.showNotification('Laboratory usage data updated', 'success');
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
    
    // Export functions
    exportLabUsage() {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Laboratory Usage Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add filter information
      doc.text(`Period: ${this.selectedLabPeriod.charAt(0).toUpperCase() + this.selectedLabPeriod.slice(1)}`, 14, 38);
      doc.text(`Department: ${this.selectedLabDepartment || 'All Departments'}`, 14, 46);
      
      // Add table with lab usage data
      const tableColumn = ['Laboratory', 'Hours', 'Sessions', 'Utilization %', 'Department'];
      const tableRows = [];
      
      this.filteredLabUsageData.forEach(lab => {
        tableRows.push([
          `Lab ${lab.id}`,
          lab.hours,
          lab.sessions,
          `${lab.utilization}%`,
          lab.department
        ]);
      });
      
      // Add summary information
      doc.text(`Total Usage Hours: ${this.getTotalLabHours()} hours`, 14, 54);
      doc.text(`Average Hours Per Day: ${this.getAverageHoursPerDay()}`, 14, 62);
      doc.text(`Most Used Lab: Lab ${this.getMostUsedLab()} (${this.getMostUsedLabHours()} hours)`, 14, 70);
      doc.text(`Peak Usage Time: ${this.getPeakUsageTime()}`, 14, 78);
      
      // Generate the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        headStyles: { fillColor: [221, 56, 89] },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      
      // Save the PDF
      doc.save(`lab_usage_report_${this.formatDateForFilename()}.pdf`);
      
      // Show notification
      this.showNotification('Laboratory usage data exported as PDF successfully');
    },
    
    exportAttendanceStats() {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Attendance Statistics Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add filter information
      doc.text(`Period: ${this.selectedAttendancePeriod.charAt(0).toUpperCase() + this.selectedAttendancePeriod.slice(1)}`, 14, 38);
      doc.text(`Department: ${this.selectedDepartment || 'All Departments'}`, 14, 46);
      doc.text(`Instructor: ${this.selectedInstructor || 'All Instructors'}`, 14, 54);
      
      // Add summary information
      doc.text(`Late Entries: ${this.lateEntriesCount} (${this.totalLateMinutes} minutes)`, 14, 62);
      doc.text(`Overtime Entries: ${this.overtimeEntriesCount} (${this.totalOvertimeMinutes} minutes)`, 14, 70);
      doc.text(`Punctual Entries: ${this.punctualPercentage}% of total`, 14, 78);
      
      // Add table with attendance data
      const tableColumn = ['Instructor', 'Department', 'Date', 'Subject', 'Section', 'Time In', 'Time Out', 'Late (min)', 'Overtime (min)'];
      const tableRows = [];
      
      this.filteredAttendanceData.forEach(entry => {
        tableRows.push([
          entry.name,
          entry.department,
          entry.date,
          entry.subject,
          entry.section,
          entry.timeIn || 'N/A',
          entry.timeOut || 'N/A',
          this.calculateLateness(entry) || 0,
          this.calculateOvertime(entry) || 0
        ]);
      });
      
      // Generate the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        headStyles: { fillColor: [221, 56, 89] },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      
      // Save the PDF
      doc.save(`attendance_report_${this.formatDateForFilename()}.pdf`);
      
      // Show notification
      this.showNotification('Attendance statistics exported as PDF successfully');
    },
    
    exportBookings() {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Bookings Information Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add filter information
      doc.text(`Period: ${this.selectedBookingPeriod.charAt(0).toUpperCase() + this.selectedBookingPeriod.slice(1)}`, 14, 38);
      
      // Add summary information
      doc.text(`Total Bookings: ${this.bookingStats.totalBookings}`, 14, 46);
      doc.text(`Growth: +${this.bookingStats.growth} from last period`, 14, 54);
      doc.text(`Average Duration: ${this.bookingStats.avgDuration} per booking`, 14, 62);
      doc.text(`Most Booked Lab: ${this.bookingStats.mostBookedLab} (${this.bookingStats.mostBookedCount} bookings)`, 14, 70);
      
      // Since we don't have actual booking data, we'll create a sample table
      const tableColumn = ['Laboratory', 'Date', 'Start Time', 'End Time', 'Instructor', 'Subject', 'Section', 'Status'];
      
      // Sample data rows
      const tableRows = [
        ['Lab 3', '2025-04-20', '08:00 AM', '10:00 AM', 'Marc Maurice Costillas', 'Web Development', 'BSIT-3A', 'Completed'],
        ['Lab 1', '2025-04-21', '10:00 AM', '12:00 PM', 'Mark Anthony Nisnea', 'Database Management', 'BSIT-3B', 'Completed'],
        ['Lab 3', '2025-04-22', '01:00 PM', '03:00 PM', 'Rockford Jade Dagohoy', 'Digital Electronics', 'BSIT-3A', 'Completed'],
        ['Lab 2', '2025-04-23', '03:00 PM', '05:00 PM', 'Marc Maurice Costillas', 'Web Development', 'BSIT-3A', 'Completed'],
        ['Lab 3', '2025-04-24', '08:00 AM', '10:00 AM', 'Mark Anthony Nisnea', 'Database Management', 'BSIT-3B', 'Completed']
      ];
      
      // Generate the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 78,
        theme: 'grid',
        headStyles: { fillColor: [221, 56, 89] },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      
      // Save the PDF
      doc.save(`bookings_report_${this.formatDateForFilename()}.pdf`);
      
      // Show notification
      this.showNotification('Bookings information exported as PDF successfully');
    },
    
    exportUserStats() {
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('User Statistics Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add user statistics information
      doc.text(`Total Users: ${this.userStats.totalUsers}`, 14, 46);
      doc.text(`Active Users: ${this.userStats.activeUsers}`, 14, 54);
      doc.text(`Most Active User: ${this.userStats.mostActiveUser}`, 14, 62);
      doc.text(`Most Active Count: ${this.userStats.mostActiveCount} sessions`, 14, 70);
      doc.text(`Average Sessions: ${this.userStats.avgSessions} per user`, 14, 78);
      
      // Create a table for user statistics
      const tableColumn = ['Metric', 'Value'];
      const tableRows = [
        ['Total Users', this.userStats.totalUsers],
        ['Active Users', this.userStats.activeUsers],
        ['Most Active User', this.userStats.mostActiveUser],
        ['Most Active Count', this.userStats.mostActiveCount],
        ['Average Sessions', this.userStats.avgSessions]
      ];
      
      // Generate the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        headStyles: { fillColor: [221, 56, 89] },
        styles: { font: 'helvetica', fontSize: 10 }
      });
      
      // Save the PDF
      doc.save(`user_stats_report_${this.formatDateForFilename()}.pdf`);
      
      // Show notification
      this.showNotification('User statistics exported as PDF successfully');
    },
    
    // Helper function to format date for filename
    formatDateForFilename() {
      const date = new Date();
      return date.toISOString().split('T')[0];
    },
    

    
    // Show notification
    showNotification(message, type = 'success') {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.reports-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.report-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #DD3859;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #c9314f;
}

/* Date Range Picker */
.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
}

.date-input:focus {
  outline: none;
  border-color: #DD3859;
}

/* Laboratory Usage Section Styles */
.section-subheader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
}

.section-subheader h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 6px 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background-color: #DD3859;
  color: white;
  border-color: #DD3859;
}

.toggle-btn:hover:not(.active) {
  background-color: #f1f5f9;
  color: #1e293b;
}

/* Laboratory Usage Bars */
.usage-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.usage-bar-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.usage-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usage-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.usage-value {
  font-size: 14px;
  font-weight: 600;
  color: #DD3859;
}

.usage-bar-container {
  height: 12px;
  background-color: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.usage-bar {
  height: 100%;
  background-color: #DD3859;
  border-radius: 6px;
  transition: width 0.5s ease;
}

/* Time Distribution Styles */
.time-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-label {
  width: 80px;
  font-size: 13px;
  color: #64748b;
}

.time-bar-container {
  flex: 1;
  height: 12px;
  background-color: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.time-bar {
  height: 100%;
  background-color: #3B82F6;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.time-value {
  width: 40px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-align: right;
}

/* Day Distribution Styles */
.day-distribution {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  margin-top: 16px;
  padding-top: 24px;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: calc(100% / 7 - 12px);
}

.day-bar-container {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
}

.day-bar {
  width: 100%;
  background-color: #3B82F6;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease;
}

.day-label {
  font-size: 13px;
  color: #64748b;
}

.day-value {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

/* Attendance Table */
.attendance-table {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-cell {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
  text-align: left;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr 0.8fr;
  border-bottom: 1px solid #e2e8f0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #1e293b;
}

.late-badge, .overtime-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.late-badge {
  background-color: #FEE2E2;
  color: #DC2626;
}

.overtime-badge {
  background-color: #DBEAFE;
  color: #2563EB;
}

.empty-table {
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}



/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}

.metric-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFF1F3;
  border-radius: 12px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.metric-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.metric-trend {
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.positive {
  color: #10B981;
}

.metric-trend.negative {
  color: #DD3859;
}

.metric-detail {
  font-size: 12px;
  color: #94a3b8;
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

/* Responsive Design */
@media (max-width: 768px) {
  .metrics-grid, .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-container {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-range-picker {
    flex-direction: column;
    width: 100%;
  }
  
  .date-input {
    width: 100%;
  }
  
  .action-button {
    width: 100%;
    justify-content: center;
  }
  
  .table-header, .table-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .header-cell, .table-cell {
    padding: 8px;
  }
  
  .header-cell:nth-child(n+4), .table-cell:nth-child(n+4) {
    display: none;
  }
}
</style>
