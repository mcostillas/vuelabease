<template>
  <DashboardLayout>
    <InstructorHeader pageTitle="History of Bookings" />
    <div class="schedule-container">
      <!-- Schedule Content -->
      <div class="schedule-content">
        <div class="content-wrapper">
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
              <div class="purpose">{{ booking.event }}</div>
              <div class="section">{{ booking.section || "N/A" }}</div>
              <div class="room">{{ booking.selectedRoom }}</div>
              <div class="status">
                <span class="status-badge" :class="booking.status">
                  {{ capitalizeFirstLetter(booking.status) }}
                </span>
              </div>
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="page-info">Page {{ currentPage }} of {{ totalPages }}</div>

        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import InstructorHeader from "@/components/instructor/InstructorHeader.vue";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

export default {
  name: "InstructorHistory",
  components: {
    DashboardLayout,
    InstructorHeader,
  },
  data() {
    return {
      selectedProgram: "",
      selectedYear: "",
      selectedSection: "",
      statusFilter: "",
      dateFilter: "all",
      selectedSemester: "current",
      currentPage: 1,
      itemsPerPage: 10,
      bookings: [], // Array to store bookings fetched from Supabase
    };
  },
  computed: {
    availableSections() {
      const sections = [];
      this.bookings.forEach((booking) => {
        if (
          (!this.selectedProgram || booking.program === this.selectedProgram) &&
          (!this.selectedYear || booking.year === this.selectedYear) &&
          booking.section &&
          !sections.includes(booking.section)
        ) {
          sections.push(booking.section);
        }
      });
      return sections.sort();
    },
    filteredBookings() {
    let filtered = [...this.bookings];

    // Filter by program
    if (this.selectedProgram) {
      filtered = filtered.filter((booking) => booking.program === this.selectedProgram);
    }

    // Filter by year
    if (this.selectedYear) {
      filtered = filtered.filter((booking) => booking.year === this.selectedYear);
    }

    // Filter by section
    if (this.selectedSection) {
      filtered = filtered.filter((booking) => booking.section === this.selectedSection);
    }

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter((booking) => booking.status === this.statusFilter);
    }

    // Filter by answered status
    filtered = filtered.filter((booking) => booking.answered === true);

    // Pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  },
  totalPages() {
    return Math.ceil(
      this.bookings.filter((booking) => booking.answered === true).length / this.itemsPerPage
    );
  },
},
  methods: {
    async fetchBookings() {
      try {
        // Get the current instructor's email from localStorage
        const instructorEmail = localStorage.getItem('email');
        
        if (!instructorEmail) {
          console.error('Instructor email not found in localStorage');
          return;
        }
        
        console.log('Fetching booking history for instructor:', instructorEmail);
        
        // Get ALL bookings from the database
        const { data: allBookings, error: allError } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (allError) {
          console.error('Error fetching all bookings:', allError);
          return;
        }
        
        console.log('ALL bookings in database:', allBookings);
        console.log('Booking person fields:', allBookings.map(b => b.person));
        
        // For demo purposes, show all bookings
        console.log('Showing all bookings for demo purposes');
        this.bookings = allBookings;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    },
    applyFilters() {
      this.currentPage = 1;
    },
    formatTime(start, end) {
      const formatHour = (timeStr) => {
        if (!timeStr) return 'N/A';
        const [hour, minute] = timeStr.split(":");
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${period}`;
      };
      
      const startFormatted = formatHour(start);
      const endFormatted = formatHour(end);
      
      if (startFormatted === 'N/A' || endFormatted === 'N/A') {
        return 'Time not specified';
      }
      
      return `${startFormatted} - ${endFormatted}`;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  created() {
    this.fetchBookings();
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 12px 20px;
  min-height: calc(100vh - 80px);
}

.schedule-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px;
  height: 100%;
}

.schedule-content {
  margin-bottom: 24px;
}

.content-wrapper {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 32px;
  width: 100%;
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
  margin-top: 8px;
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 12px;
  max-width: 100%;
}

.schedule-header {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  background-color: #DD3859;
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
  grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.time-slot {
  color: #DD3859;
  font-weight: 600;
  font-size: 14px;
}

.purpose {
  font-weight: 500;
  color: #1E293B;
  font-size: 14px;
}

.section, .room {
  color: #64748B;
  font-size: 14px;
}

.status {
  font-weight: 500;
  font-size: 14px;
  text-transform: capitalize;
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

.status-badge.pending {
  background-color: #FFF1F3;
  color: #DD3859;
}

.status-badge.approved {
  background-color: #e6f7e6;
  color: #22c55e;
}

.status-badge.rejected {
  background-color: #FFF1F3;
  color: #DD3859;
}

.status-badge.cancelled {
  background-color: #f1f1f1;
  color: #6b7280;
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
    grid-template-columns: 1.5fr 2fr 1fr 1fr 1fr;
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
