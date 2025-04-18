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

      <!-- Schedule Cards Layout -->
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
              <div class="time-slot">{{ formatTime(booking.start_time, booking.end_time) }}</div>
              <div class="purpose">{{ booking.event_name }}</div>
              <div class="section">{{ booking.section || "N/A" }}</div>
              <div class="room">{{ booking.room_id }}</div>
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
        const { data, error } = await supabase.from("bookings").select("*");
        if (error) throw error;
        this.bookings = data;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    },
    applyFilters() {
      this.currentPage = 1;
    },
    formatTime(start, end) {
      const formatHour = (timeStr) => {
        const [hour, minute] = timeStr.split(":");
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${period}`;
      };
      return `${formatHour(start)} - ${formatHour(end)}`;
    },
  },
  created() {
    this.fetchBookings();
  },
};
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
