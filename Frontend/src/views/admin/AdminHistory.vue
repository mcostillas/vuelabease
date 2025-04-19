<template>
  <DashboardLayout>
    <AdminHeader pageTitle="History of Bookings" />
    <div class="schedule-container">
      <div class="filters">
        <div class="filter-group">
          <label for="program-filter">Program:</label>
          <select
            id="program-filter"
            v-model="selectedProgram"
            @change="applyFilters"
          >
            <option value="">All Programs</option>
            <option value="CABE">
              College of Accounting and Business Education
            </option>
            <option value="CAH">College of Arts and Humanities</option>
            <option value="CCS">College of Computer Studies</option>
            <option value="CEA">College of Engineering and Architecture</option>
            <option value="CHESFS">
              College of Human Environmental Science and Food Studies
            </option>
            <option value="CMBS">
              College of Medical and Biological Sciences
            </option>
            <option value="CM">College of Music</option>
            <option value="CN">College of Nursing</option>
            <option value="CPC">College of Pharmacy and Chemistry</option>
            <option value="CTE">College of Teacher Education</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="year-filter">Year Level:</label>
          <select
            id="year-filter"
            v-model="selectedYear"
            @change="applyFilters"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="section-filter">Section:</label>
          <select
            id="section-filter"
            v-model="selectedSection"
            @change="applyFilters"
          >
            <option value="">All Sections</option>
            <option
              v-for="section in availableSections"
              :key="section"
              :value="section"
            >
              {{ section }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            @change="applyFilters"
          >
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
          <select
            id="semester-filter"
            v-model="selectedSemester"
            @change="applyFilters"
          >
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
          <div class="header-item">Time Slot</div>
          <div class="header-item">Purpose</div>
          <div class="header-item">Section</div>
          <div class="header-item">Room</div>
          <div class="header-item">Status</div>
        </div>
        
        <div class="schedule-cards-container">

        <div class="schedule-cards">
          <div
            v-for="booking in filteredBookings"
            :key="booking.id"
            class="schedule-card"
            :class="booking.status"
          >
            <div class="schedule-item">
              <div class="time-slot">
                {{
                  formatTime(
                    booking.start_time || "00:00",
                    booking.end_time || "00:00"
                  )
                }}
              </div>
              <div class="purpose">{{ booking.event_name }}</div>
              <div class="section">{{ booking.section || "N/A" }}</div>
              <div class="room">{{ booking.room_id }}</div>
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
        </div> <!-- Close schedule-cards-container -->
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
/* eslint-disable vue/no-unused-components */
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

export default {
  name: "AdminHistory",
  components: {
    DashboardLayout,
    AdminHeader,
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
      // Generate sections based on program and year
      const sections = [];
      if (this.selectedProgram && this.selectedYear) {
        const program = this.selectedProgram;
        const year = this.selectedYear;
        const sectionLetters = ["A", "B", "C", "D", "E"];

        sectionLetters.forEach((letter) => {
          sections.push(`${program}-${year}${letter}`);
        });
      }
      return sections;
    },
    filteredBookings() {
      let filtered = [...this.bookings];

      // Apply program filter
      if (this.selectedProgram) {
        filtered = filtered.filter(
          (booking) => booking.program === this.selectedProgram
        );
      }

      // Apply year filter
      if (this.selectedYear) {
        filtered = filtered.filter(
          (booking) => booking.year === this.selectedYear
        );
      }

      // Apply section filter
      if (this.selectedSection) {
        filtered = filtered.filter(
          (booking) => booking.section === this.selectedSection
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(
          (booking) => booking.status === this.statusFilter
        );
      }

      // Apply date filter
      if (this.dateFilter !== "all") {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        let startDate, endDate;

        if (this.dateFilter === "week") {
          startDate = startOfWeek;
          endDate = new Date(today);
          endDate.setDate(startOfWeek.getDate() + 6); // Saturday
        } else if (this.dateFilter === "month") {
          startDate = startOfMonth;
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
        } else if (this.dateFilter === "semester") {
          // Simplified semester dates
          if (this.selectedSemester === "current") {
            startDate = new Date("2024-08-01");
            endDate = new Date("2024-12-31");
          } else if (this.selectedSemester === "2024-2") {
            startDate = new Date("2025-01-01");
            endDate = new Date("2025-05-31");
          } else if (this.selectedSemester === "2024-1") {
            startDate = new Date("2024-08-01");
            endDate = new Date("2024-12-31");
          } else if (this.selectedSemester === "2023-2") {
            startDate = new Date("2024-01-01");
            endDate = new Date("2024-05-31");
          } else if (this.selectedSemester === "2023-1") {
            startDate = new Date("2023-08-01");
            endDate = new Date("2023-12-31");
          }
        }

        if (startDate && endDate) {
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= startDate && bookingDate <= endDate;
          });
        }
      }

      // Pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.bookings.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchBookings() {
      try {
        console.log("Fetching answered bookings from Supabase...");
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("answered", true); // Fetch only answered bookings
        if (error) throw error;

        console.log("Fetched bookings:", data);
        this.bookings = data;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    formatTime(start, end) {
      const formatHour = (timeStr) => {
        if (!timeStr || typeof timeStr !== "string") {
          return "Invalid Time"; // Handle undefined or invalid time
        }
        const [hour, minute] = timeStr.split(":");
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${period}`;
      };

      const formattedStart = formatHour(start);
      const formattedEnd = formatHour(end);

      return `${formattedStart} - ${formattedEnd}`;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    applyFilters() {
      this.currentPage = 1; // Reset pagination when filters change
    },
  },
  created() {
    this.fetchBookings(); // Fetch bookings when the component is created
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.schedule-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 24px;
}

.schedule-cards-container {
  position: relative;
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

.section,
.room {
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
