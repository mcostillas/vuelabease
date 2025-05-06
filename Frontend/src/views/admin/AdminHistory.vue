<template>
  <DashboardLayout>
    <AdminHeader pageTitle="History of Bookings" />
    <div class="schedule-container">
      <!-- Schedule Content -->
      <div class="schedule-content">
        <div class="content-wrapper">
          <div class="filters">
            
            <div class="search-group">
              <label for="search-input">Search:</label>
              <div class="search-input-container">
                <input
                  type="text"
                  id="search-input"
                  v-model="searchQuery"
                  placeholder="Search by purpose, section, or room..."
                  @input="applyFilters"
                />
                <svg
                  class="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            
          </div>
          <div class="schedule-header">
            <div class="header-item">Time Slot</div>
            <div class="header-item">Purpose</div>
            <div class="header-item">Person Responsible</div>
            <div class="header-item">Room</div>
            <div class="header-item">Status</div>
          </div>
          <div class="schedule-cards-container">
            <div class="schedule-cards">
              <div
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="schedule-card"
              >
                <div class="schedule-item">
                  <div class="time-slot">
                    {{ formatTime(
                      booking.startTime || "00:00",
                      booking.endTime || "00:00"
                    ) }}
                  </div>
                  <div class="purpose">{{ booking.event }}</div>
                  <div class="section">{{ booking.person }}</div>
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
      searchQuery: "",
      statusFilter: "",
      dateFilter: "all",
      selectedSemester: "current",
      currentPage: 1,
      itemsPerPage: 10,
      bookings: [], // Array to store bookings fetched from Supabase
    };
  },
  computed: {
    filteredBookings() {
  let filtered = [...this.bookings];
  if (this.searchQuery.trim() !== "") {
    const query = this.searchQuery.toLowerCase().trim();
    filtered = filtered.filter((booking) => {
      return (
        (booking.event && booking.event.toLowerCase().includes(query)) ||
        (booking.person && booking.person.toLowerCase().includes(query)) ||
        (booking.selectedRoom && booking.selectedRoom.toLowerCase().includes(query))
      );
    });
  }
  console.log("Filtered Bookings:", filtered); // Debugging log
  return filtered;
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

    // Sort bookings by `updated_at` (or `created_at`) in descending order
    this.bookings = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    console.log("Fetched Bookings:", this.bookings); // Debugging log
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
      console.log("Search Query:", this.searchQuery); // Debugging log
    },
  },
  created() {
    this.fetchBookings(); // Fetch bookings when the component is created
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 12px 20px;
  min-height: calc(100vh - 80px);
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

/* Search Group Styles */
.search-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 250px;
}

.search-group label {
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
}

.search-input-container {
  position: relative;
}

.search-group input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

.search-group input:focus {
  outline: none;
  border-color: #DD3859;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748B;
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
