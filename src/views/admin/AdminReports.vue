<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Reports" />
    <div class="reports-container">
      <div class="reports-section">
        <!-- Report Content -->
        <div class="report-content">
          <!-- Filter Controls -->
          <div class="reports-filters">
            <div class="filter-group">
              <label for="reportType">Report Type</label>
              <select id="reportType" v-model="selectedReportType">
                <option value="attendance">Attendance Report</option>
                <option value="rooms">Room Usage Report</option>
                <option value="instructor">Instructor Activity Report</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="dateRange">Date Range</label>
              <select id="dateRange" v-model="selectedDateRange" @change="updateDateRange">
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastSemester">Last Semester</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div class="filter-group" v-if="selectedDateRange === 'lastSemester'">
              <label for="semester">Semester</label>
              <select id="semester" v-model="selectedSemester" @change="updateDateRange">
                <option value="1">First Semester</option>
                <option value="2">Second Semester</option>
              </select>
            </div>
            
            <div class="filter-group" v-if="selectedDateRange === 'custom'">
              <label for="customDateRange">Custom Date Range</label>
              <div class="date-range-picker">
                <input type="date" id="startDate" v-model="dateRange.start" @change="applyFilters">
                <span>to</span>
                <input type="date" id="endDate" v-model="dateRange.end" @change="applyFilters">
              </div>
            </div>
            
            <div class="filter-group department-filter">
              <label for="department">Department</label>
              <select id="department" v-model="selectedDepartment" @change="applyFilters">
                <option value="all">All Departments</option>
                <option value="cabe">CABE</option>
                <option value="cah">CAH</option>
                <option value="ccs">CCS</option>
                <option value="cea">CEA</option>
                <option value="chesfs">CHESFS</option>
                <option value="cmbs">CMBS</option>
                <option value="cm">CM</option>
                <option value="cn">CN</option>
                <option value="cpc">CPC</option>
                <option value="cte">CTE</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="semester">Academic Semester</label>
              <select id="semester" v-model="selectedAcademicSemester" @change="applyFilters">
                <option value="all">All Semesters</option>
                <option value="1">First Semester</option>
                <option value="2">Second Semester</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="laboratory">Laboratory</label>
              <select id="laboratory" v-model="selectedLaboratory" @change="applyFilters">
                <option value="all">All Laboratories</option>
                <option value="l201">L201</option>
                <option value="l202">L202</option>
                <option value="l203">L203</option>
                <option value="l204">L204</option>
                <option value="l205">L205</option>
                <option value="open">Open Laboratory</option>
                <option value="iot">IOT Lab</option>
              </select>
            </div>
            
            <button class="export-btn" @click="exportReport">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
          
          <!-- Attendance Report -->
          <div v-if="selectedReportType === 'attendance'" class="report-card">
            <div class="report-header">
              <h2>Attendance Report</h2>
              <span class="date-range-label">{{ formattedDateRange }}</span>
            </div>
            
            <div class="report-stats">
              <div class="report-card">
                <div class="report-card-value">{{ attendanceData.totalInstructors }}</div>
                <div class="report-card-label">Total Instructors</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ attendanceData.totalHours }}h</div>
                <div class="report-card-label">Total Hours</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ attendanceData.averageHours }}h</div>
                <div class="report-card-label">Average Hours</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ attendanceData.timeSaved }}h</div>
                <div class="report-card-label">Time Saved</div>
                <div class="stat-description">Early check-outs</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ attendanceData.timeLost }}h</div>
                <div class="report-card-label">Time Lost</div>
                <div class="stat-description">Late check-ins/outs</div>
              </div>
            </div>
            
            <div class="report-table-container">
              <h3>Attendance Details</h3>
              
              <div class="report-table-section">
                <div class="report-table-header">
                  <div class="header-item">Instructor</div>
                  <div class="header-item">Department</div>
                  <div class="header-item">Total Hours</div>
                  <div class="header-item">Avg. Check-in</div>
                  <div class="header-item">Avg. Check-out</div>
                </div>
                
                <div class="report-table-cards">
                  <div class="report-table-card" v-for="(instructor, index) in attendanceData.topInstructors" :key="index">
                    <div class="report-table-item">
                      <div class="instructor-name">{{ instructor.name }}</div>
                      <div class="instructor-department">{{ instructor.department }}</div>
                      <div class="total-hours">{{ instructor.totalHours }}h</div>
                      <div class="avg-checkin">{{ instructor.avgCheckIn }}</div>
                      <div class="avg-checkout">{{ instructor.avgCheckOut }}</div>
                    </div>
                    <div class="time-metrics-row">
                      <div class="time-metric saved">
                        <span class="time-metric-label">Time Saved:</span>
                        <span class="time-metric-value">{{ instructor.timeSaved || '0.0' }}h</span>
                      </div>
                      <div class="time-metric lost">
                        <span class="time-metric-label">Time Lost:</span>
                        <span class="time-metric-value">{{ instructor.timeLost || '0.0' }}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Laboratory Usage Report -->
          <div v-if="selectedReportType === 'rooms'" class="report-card">
            <div class="report-header">
              <h2>Laboratory Usage Report</h2>
              <span class="date-range-label">{{ formattedDateRange }}</span>
            </div>
            
            <div class="report-stats">
              <div class="report-card">
                <div class="report-card-value">{{ roomData.totalRooms }}</div>
                <div class="report-card-label">Total Rooms</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ roomData.totalBookings }}</div>
                <div class="report-card-label">Total Bookings</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ roomData.averageUsage }}%</div>
                <div class="report-card-label">Average Usage</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ roomData.peakHours }}</div>
                <div class="report-card-label">Peak Hours</div>
              </div>
            </div>
            
            <div class="report-table-container">
              <h3>Laboratory Usage Details</h3>
              
              <div class="report-table-section">
                <div class="report-table-header">
                  <div class="header-item">Laboratory</div>
                  <div class="header-item">Total Hours</div>
                  <div class="header-item">Usage Rate</div>
                  <div class="header-item">Peak Time</div>
                  <div class="header-item">Status</div>
                </div>
                
                <div class="report-table-cards">
                  <div class="report-table-card" v-for="(room, index) in roomData.rooms" :key="index">
                    <div class="report-table-item">
                      <div class="laboratory">{{ room.name }}</div>
                      <div class="total-hours">{{ room.totalHours }}h</div>
                      <div class="usage-rate">{{ room.usageRate }}%</div>
                      <div class="peak-time">{{ room.peakTime }}</div>
                      <div class="status" :class="room.status.toLowerCase()">{{ room.status }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Instructor Activity Report -->
          <div v-if="selectedReportType === 'instructor'" class="report-card">
            <div class="report-header">
              <h2>Instructor Activity Report</h2>
              <span class="date-range-label">{{ formattedDateRange }}</span>
            </div>
            
            <div class="report-stats">
              <div class="report-card">
                <div class="report-card-value">{{ instructorData.totalInstructors }}</div>
                <div class="report-card-label">Total Instructors</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ instructorData.totalSessions }}</div>
                <div class="report-card-label">Total Sessions</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ instructorData.averageSessions }}</div>
                <div class="report-card-label">Avg Sessions</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ instructorData.timeSaved }}h</div>
                <div class="report-card-label">Time Saved</div>
                <div class="stat-description">Early check-outs</div>
              </div>
              <div class="report-card">
                <div class="report-card-value">{{ instructorData.timeLost }}h</div>
                <div class="report-card-label">Time Lost</div>
                <div class="stat-description">Late check-ins/outs</div>
              </div>
            </div>
            
            <div class="report-table-container">
              <h3>Instructor Details</h3>
              
              <div class="report-table-section">
                <div class="report-table-header">
                  <div class="header-item">Instructor</div>
                  <div class="header-item">Department</div>
                  <div class="header-item">Classes</div>
                  <div class="header-item">Attendance</div>
                  <div class="header-item">Total Hours</div>
                </div>
                
                <div class="report-table-cards">
                  <div class="report-table-card" v-for="(instructor, index) in instructorData.instructorList" :key="index">
                    <div class="report-table-item">
                      <div class="instructor-name">{{ instructor.name }}</div>
                      <div class="instructor-department">{{ instructor.department }}</div>
                      <div class="classes-conducted">{{ instructor.classesConducted }}</div>
                      <div class="attendance-rate">{{ instructor.attendanceRate }}%</div>
                      <div class="total-hours">{{ instructor.totalHours }}h</div>
                    </div>
                    <div class="time-metrics-row">
                      <div class="time-metric saved">
                        <span class="time-metric-label">Time Saved:</span>
                        <span class="time-metric-value">{{ instructor.timeSaved || '0.0' }}h</span>
                      </div>
                      <div class="time-metric lost">
                        <span class="time-metric-label">Time Lost:</span>
                        <span class="time-metric-value">{{ instructor.timeLost || '0.0' }}h</span>
                      </div>
                    </div>
                  </div>
                </div>
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
  name: 'AdminReports',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      selectedReportType: 'attendance',
      selectedDateRange: 'custom',
      dateRange: {
        start: this.getDefaultStartDate(),
        end: this.getDefaultEndDate()
      },
      selectedDepartment: 'all',
      selectedLaboratory: 'all',
      selectedSemester: '1',
      selectedAcademicSemester: 'all',
      notification: {
        show: false,
        message: '',
        type: 'success'
      },
      
      // Attendance report data
      attendanceData: {
        totalInstructors: 42,
        totalHours: 840,
        averageHours: 20,
        timeSaved: 12.5,
        timeLost: 8.2,
        topInstructors: [
          {
            name: 'John Doe',
            department: 'Computer Science',
            totalHours: '42.5',
            avgCheckIn: '08:30 AM',
            avgCheckOut: '04:30 PM',
            timeSaved: '2.5',
            timeLost: '1.0'
          },
          {
            name: 'Jane Smith',
            department: 'Information Technology',
            totalHours: '38.0',
            avgCheckIn: '09:15 AM',
            avgCheckOut: '05:00 PM',
            timeSaved: '1.5',
            timeLost: '2.0'
          },
          {
            name: 'Robert Johnson',
            department: 'Computer Engineering',
            totalHours: '35.5',
            avgCheckIn: '08:45 AM',
            avgCheckOut: '04:15 PM',
            timeSaved: '3.0',
            timeLost: '0.5'
          },
          {
            name: 'Emily Davis',
            department: 'Information Technology',
            totalHours: '40.0',
            avgCheckIn: '08:00 AM',
            avgCheckOut: '04:00 PM',
            timeSaved: '2.0',
            timeLost: '1.5'
          },
          {
            name: 'Michael Wilson',
            department: 'Computer Science',
            totalHours: '36.5',
            avgCheckIn: '09:00 AM',
            avgCheckOut: '04:45 PM',
            timeSaved: '3.5',
            timeLost: '3.2'
          }
        ]
      },
      
      // Room usage data
      roomData: {
        totalRooms: 7,
        totalBookings: 325,
        totalHours: 975,
        averageUsage: 75,
        peakHours: 120,
        rooms: [
          {
            name: 'L201',
            totalHours: 255,
            usageRate: 80,
            peakTime: '10:00 AM - 12:00 PM',
            status: 'Occupied'
          },
          {
            name: 'L202',
            totalHours: 234,
            usageRate: 70,
            peakTime: '1:00 PM - 3:00 PM',
            status: 'Available'
          },
          {
            name: 'L203',
            totalHours: 195,
            usageRate: 60,
            peakTime: '9:00 AM - 11:00 AM',
            status: 'Maintenance'
          },
          {
            name: 'L204',
            totalHours: 216,
            usageRate: 65,
            peakTime: '1:00 PM - 3:00 PM',
            status: 'Occupied'
          },
          {
            name: 'L205',
            totalHours: 204,
            usageRate: 55,
            peakTime: '10:00 AM - 12:00 PM',
            status: 'Available'
          },
          {
            name: 'Open Laboratory',
            totalHours: 186,
            usageRate: 50,
            peakTime: '1:00 PM - 3:00 PM',
            status: 'Occupied'
          },
          {
            name: 'IOT Lab',
            totalHours: 174,
            usageRate: 45,
            peakTime: '10:00 AM - 12:00 PM',
            status: 'Available'
          }
        ]
      },
      
      // Laboratories and their rooms
      laboratories: [
        {
          id: 'l201',
          name: 'L201',
          rooms: [
            {
              roomNumber: 'L201',
              totalBookings: 85,
              totalHours: '255h',
              peakDay: 'Wednesday',
              peakTime: '10:00 AM - 12:00 PM'
            }
          ]
        },
        {
          id: 'l202',
          name: 'L202',
          rooms: [
            {
              roomNumber: 'L202',
              totalBookings: 78,
              totalHours: '234h',
              peakDay: 'Tuesday',
              peakTime: '1:00 PM - 3:00 PM'
            }
          ]
        },
        {
          id: 'l203',
          name: 'L203',
          rooms: [
            {
              roomNumber: 'L203',
              totalBookings: 65,
              totalHours: '195h',
              peakDay: 'Monday',
              peakTime: '9:00 AM - 11:00 AM'
            }
          ]
        },
        {
          id: 'l204',
          name: 'L204',
          rooms: [
            {
              roomNumber: 'L204',
              totalBookings: 72,
              totalHours: '216h',
              peakDay: 'Thursday',
              peakTime: '1:00 PM - 3:00 PM'
            }
          ]
        },
        {
          id: 'l205',
          name: 'L205',
          rooms: [
            {
              roomNumber: 'L205',
              totalBookings: 68,
              totalHours: '204h',
              peakDay: 'Friday',
              peakTime: '10:00 AM - 12:00 PM'
            }
          ]
        },
        {
          id: 'open',
          name: 'Open Laboratory',
          rooms: [
            {
              roomNumber: 'Open Laboratory',
              totalBookings: 62,
              totalHours: '186h',
              peakDay: 'Wednesday',
              peakTime: '1:00 PM - 3:00 PM'
            }
          ]
        },
        {
          id: 'iot',
          name: 'IOT Lab',
          rooms: [
            {
              roomNumber: 'IOT Lab',
              totalBookings: 58,
              totalHours: '174h',
              peakDay: 'Thursday',
              peakTime: '10:00 AM - 12:00 PM'
            }
          ]
        }
      ],
      
      // Room details (legacy, can be removed later)
      roomDetails: [
        {
          roomNumber: '201',
          totalBookings: 85,
          totalHours: '255h',
          peakDay: 'Wednesday',
          peakTime: '10:00 AM - 12:00 PM'
        },
        {
          roomNumber: '202',
          totalBookings: 78,
          totalHours: '234h',
          peakDay: 'Tuesday',
          peakTime: '1:00 PM - 3:00 PM'
        },
        {
          roomNumber: '203',
          totalBookings: 65,
          totalHours: '195h',
          peakDay: 'Monday',
          peakTime: '9:00 AM - 11:00 AM'
        },
        {
          roomNumber: '204',
          totalBookings: 52,
          totalHours: '156h',
          peakDay: 'Thursday',
          peakTime: '2:00 PM - 4:00 PM'
        },
        {
          roomNumber: '205',
          totalBookings: 45,
          totalHours: '135h',
          peakDay: 'Friday',
          peakTime: '11:00 AM - 1:00 PM'
        }
      ],
      
      // Instructor activity data
      instructorData: {
        totalInstructors: 42,
        totalSessions: 210,
        averageSessions: 5,
        timeSaved: 6.8,
        timeLost: 10.3,
        instructorList: [
          {
            name: 'John Doe',
            department: 'Computer Science',
            classesConducted: 28,
            attendanceRate: 96,
            totalHours: 56,
            timeSaved: '1.8',
            timeLost: '2.2'
          },
          {
            name: 'Jane Smith',
            department: 'Information Technology',
            classesConducted: 24,
            attendanceRate: 92,
            totalHours: 48,
            timeSaved: '1.2',
            timeLost: '2.5'
          },
          {
            name: 'Robert Johnson',
            department: 'Computer Engineering',
            classesConducted: 22,
            attendanceRate: 88,
            totalHours: 44,
            timeSaved: '0.8',
            timeLost: '1.5'
          },
          {
            name: 'Emily Davis',
            department: 'Information Technology',
            classesConducted: 26,
            attendanceRate: 94,
            totalHours: 52,
            timeSaved: '1.5',
            timeLost: '1.8'
          },
          {
            name: 'Michael Wilson',
            department: 'Computer Science',
            classesConducted: 20,
            attendanceRate: 90,
            totalHours: 40,
            timeSaved: '1.5',
            timeLost: '2.3'
          }
        ]
      }
    };
  },
  computed: {
    formattedDateRange() {
      if (this.dateRange.start && this.dateRange.end) {
        return `${this.formatDate(this.dateRange.start)} - ${this.formatDate(this.dateRange.end)}`;
      } else {
        return '';
      }
    }
  },
  methods: {
    exportReport() {
      this.showNotification('Report exported successfully!', 'success');
    },
    
    showNotification(message, type) {
      this.notification.message = message;
      this.notification.type = type;
      this.notification.show = true;
      
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    
    getDefaultStartDate() {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().split('T')[0];
    },
    
    getDefaultEndDate() {
      const date = new Date();
      return date.toISOString().split('T')[0];
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    
    updateDateRange() {
      let yesterday, lastWeek, lastMonth, semesterStart;
      
      switch (this.selectedDateRange) {
        case 'today':
          this.dateRange.start = this.getDefaultEndDate();
          this.dateRange.end = this.getDefaultEndDate();
          break;
        case 'yesterday':
          yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          this.dateRange.start = yesterday.toISOString().split('T')[0];
          this.dateRange.end = yesterday.toISOString().split('T')[0];
          break;
        case 'lastWeek':
          lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          this.dateRange.start = lastWeek.toISOString().split('T')[0];
          this.dateRange.end = this.getDefaultEndDate();
          break;
        case 'lastMonth':
          lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          this.dateRange.start = lastMonth.toISOString().split('T')[0];
          this.dateRange.end = this.getDefaultEndDate();
          break;
        case 'lastSemester':
          semesterStart = new Date();
          semesterStart.setMonth(semesterStart.getMonth() - (this.selectedSemester === '1' ? 6 : 12));
          this.dateRange.start = semesterStart.toISOString().split('T')[0];
          this.dateRange.end = this.getDefaultEndDate();
          break;
        default:
          break;
      }
      this.applyFilters();
    },
    
    applyFilters() {
      // Format the date range for display
      const startDate = this.formatDate(this.dateRange.start);
      const endDate = this.formatDate(this.dateRange.end);
      
      // Get department name for display
      let departmentName = "All Departments";
      if (this.selectedDepartment !== 'all') {
        const departmentMap = {
          'cabe': 'College of Accounting and Business Education',
          'cah': 'College of Arts and Humanities',
          'ccs': 'College of Computer Studies',
          'cea': 'College of Engineering and Architecture',
          'chesfs': 'College of Human Environmental Science and Food Studies',
          'cmbs': 'College of Medical and Biological Sciences',
          'cm': 'College of Music',
          'cn': 'College of Nursing',
          'cpc': 'College of Pharmacy and Chemistry',
          'cte': 'College of Teacher Education'
        };
        departmentName = departmentMap[this.selectedDepartment] || this.selectedDepartment;
      }
      
      // Get laboratory name for display
      let laboratoryName = "All Laboratories";
      if (this.selectedLaboratory !== 'all') {
        const labMap = {
          'lab1': 'Computer Laboratory 1',
          'lab2': 'Computer Laboratory 2',
          'lab3': 'Computer Laboratory 3',
          'lab4': 'Computer Laboratory 4',
          'lab5': 'Computer Laboratory 5',
          'lab6': 'Physics Laboratory',
          'lab7': 'Chemistry Laboratory',
          'lab8': 'Biology Laboratory'
        };
        laboratoryName = labMap[this.selectedLaboratory] || this.selectedLaboratory;
      }
      
      // Get semester name for display
      let semesterName = "All Semesters";
      if (this.selectedAcademicSemester !== 'all') {
        semesterName = this.selectedAcademicSemester === '1' ? 'First Semester' : 'Second Semester';
      }
      
      // Get date range type for display
      let dateRangeType = "";
      switch (this.selectedDateRange) {
        case 'today':
          dateRangeType = "Today";
          break;
        case 'yesterday':
          dateRangeType = "Yesterday";
          break;
        case 'lastWeek':
          dateRangeType = "Last Week";
          break;
        case 'lastMonth':
          dateRangeType = "Last Month";
          break;
        case 'lastSemester':
          dateRangeType = `Last ${this.selectedSemester === '1' ? 'First' : 'Second'} Semester`;
          break;
        case 'custom':
          dateRangeType = "Custom Range";
          break;
        default:
          dateRangeType = "Custom Range";
      }
      
      // Create filter message
      const filterMessage = `
        Report Type: ${this.selectedReportType === 'attendance' ? 'Attendance Report' : 'Instructor Activity Report'}
        Date Range: ${dateRangeType} (${startDate} to ${endDate})
        Department: ${departmentName}
        Semester: ${semesterName}
        Laboratory: ${laboratoryName}
      `;
      
      // Show notification with filter information
      this.showNotification(filterMessage, 'info');
      
      // In a real application, you would fetch data based on filters here
      // For example:
      // this.fetchReportData({
      //   reportType: this.selectedReportType,
      //   startDate: this.dateRange.start,
      //   endDate: this.dateRange.end,
      //   department: this.selectedDepartment,
      //   semester: this.selectedAcademicSemester,
      //   laboratory: this.selectedLaboratory
      // });
      
      // For demonstration, we'll update the report title with the filter information
      this.updateReportTitle();
    },
    
    updateReportTitle() {
      // Update the report title based on selected filters
      let title = this.selectedReportType === 'attendance' ? 'Attendance Report' : 'Instructor Activity Report';
      
      // Add date range to title
      const startDate = this.formatDate(this.dateRange.start);
      const endDate = this.formatDate(this.dateRange.end);
      
      // Get date range type for display
      let dateRangeInfo = "";
      switch (this.selectedDateRange) {
        case 'today':
          dateRangeInfo = "Today";
          break;
        case 'yesterday':
          dateRangeInfo = "Yesterday";
          break;
        case 'lastWeek':
          dateRangeInfo = "Last Week";
          break;
        case 'lastMonth':
          dateRangeInfo = "Last Month";
          break;
        case 'lastSemester':
          dateRangeInfo = `Last ${this.selectedSemester === '1' ? 'First' : 'Second'} Semester`;
          break;
        case 'custom':
          dateRangeInfo = `${startDate} to ${endDate}`;
          break;
        default:
          dateRangeInfo = `${startDate} to ${endDate}`;
      }
      
      // Add department if not "all"
      let departmentInfo = "";
      if (this.selectedDepartment !== 'all') {
        departmentInfo = ` - ${this.selectedDepartment.toUpperCase()}`;
      }
      
      // Add semester if not "all"
      let semesterInfo = "";
      if (this.selectedAcademicSemester !== 'all') {
        semesterInfo = ` - ${this.selectedAcademicSemester === '1' ? 'First' : 'Second'} Semester`;
      }
      
      // Add laboratory if not "all"
      let laboratoryInfo = "";
      if (this.selectedLaboratory !== 'all') {
        const labMap = {
          'lab1': 'Lab 1',
          'lab2': 'Lab 2',
          'lab3': 'Lab 3',
          'lab4': 'Lab 4',
          'lab5': 'Lab 5',
          'lab6': 'Physics Lab',
          'lab7': 'Chemistry Lab',
          'lab8': 'Biology Lab'
        };
        laboratoryInfo = ` - ${labMap[this.selectedLaboratory] || this.selectedLaboratory}`;
      }
      
      // Combine all parts
      this.reportTitle = `${title}: ${dateRangeInfo}${departmentInfo}${semesterInfo}${laboratoryInfo}`;
    }
  }
};
</script>

<style scoped>
.reports-container {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
}

.reports-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
}

.reports-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 24px 24px 0;
  align-items: flex-end;
  margin-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.filter-group {
  margin-right: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #64748b;
}

.filter-group select,
.date-input input {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
  font-family: 'Poppins', sans-serif;
}

.filter-group select:focus,
.date-input input:focus {
  outline: none;
  border-color: #DD3859;
}

.semester-selector {
  margin-top: 8px;
}

.semester-selector select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
  font-family: 'Poppins', sans-serif;
}

.semester-selector select:focus {
  outline: none;
  border-color: #DD3859;
}

.department-filter select,
.semester-filter select {
  width: 160px;
}

.date-range-picker {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-range-picker input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.date-range-picker span {
  color: #64748b;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
  font-family: 'Poppins', sans-serif;
  height: 42px;
}

.export-btn:hover {
  background-color: #C42D4E;
  transform: translateY(-2px);
}

.export-btn svg {
  stroke: currentColor;
}

/* Report Content Styling */
.report-content {
  padding: 0 40px 40px;
  width: 100%;
}

.report-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.report-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.date-range-label {
  font-size: 14px;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 6px 14px;
  border-radius: 16px;
}

.report-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.report-stats .report-card {
  flex: 1;
  min-width: 180px;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.report-card-value {
  font-size: 32px;
  font-weight: 700;
  color: #DD3859;
  margin-bottom: 12px;
}

.report-card-label {
  font-size: 16px;
  color: #64748b;
}

.stat-card {
  flex: 1;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #DD3859;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 16px;
  color: #64748b;
}

.stat-description {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
  font-style: italic;
}

/* Chart Styling */
.usage-chart {
  margin-bottom: 40px;
}

.usage-chart h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-bar-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.room-label {
  width: 100px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

.chart-bar {
  height: 32px;
  background-color: #DD3859;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  transition: width 0.5s ease;
}

.bar-value {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* Instructor Cards Styling */
.instructor-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.instructor-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.instructor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.instructor-card-header {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.instructor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.instructor-info img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f1f5f9;
}

.instructor-details h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.department {
  font-size: 14px;
  color: #64748b;
}

.instructor-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #f1f5f9;
}

.metric:last-child {
  border-bottom: none;
}

.metric-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 16px;
  color: #1e293b;
  font-weight: 600;
}

.time-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.time-saved .metric-value {
  color: #10B981;
}

.time-lost .metric-value {
  color: #DD3859;
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

/* Report Table Section Styling */
.report-table-section {
  margin-top: 24px;
}

.report-table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background-color: #FFF1F3;
  border: 1px solid #99183A;
  border-radius: 8px;
  margin-bottom: 16px;
}

.report-table-header .header-item {
  color: #DD3859;
  font-size: 14px;
  font-weight: 500;
}

.report-table-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.report-table-card {
  border: 1px solid #dfdfdf;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.report-table-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.report-table-item {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.laboratory, .total-hours, .usage-rate, .peak-time, .status {
  font-size: 14px;
  color: #1E293B;
}

.laboratory {
  font-weight: 600;
  color: #DD3859;
}

.total-hours, .usage-rate {
  font-weight: 500;
}

.status {
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
  text-align: center;
}

.status.available {
  background-color: #e6f7ed;
  color: #039855;
}

.status.maintenance {
  background-color: #fff8e1;
  color: #f59e0b;
}

.status.occupied {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .reports-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .export-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
  
  .report-stats {
    flex-direction: column;
  }
  
  .instructor-cards {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

/* Additional styling for instructor report tables */
.instructor-name {
  font-weight: 600;
  color: #DD3859;
}

.instructor-department {
  font-weight: 500;
  color: #1E293B;
}

.time-metrics-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  margin-top: 8px;
  border-top: 1px dashed #f1f5f9;
  font-size: 13px;
}

.time-metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-metric.saved .time-metric-value {
  color: #039855;
}

.time-metric.lost .time-metric-value {
  color: #dc2626;
}

.time-metric-label {
  color: #64748B;
}

.time-metric-value {
  font-weight: 600;
}

.classes-conducted, .attendance-rate, .avg-checkin, .avg-checkout {
  font-weight: 500;
}
</style>
