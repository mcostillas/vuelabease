<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Booking Management" />
    <div class="bookings-container">
      <div class="bookings-section">
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label for="department-filter">Department:</label>
            <select
              id="department-filter"
              v-model="selectedDepartment"
              @change="applyFilters"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="date-filter">Date Range:</label>
            <select
              id="date-filter"
              v-model="dateFilter"
              @change="applyFilters"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <!-- Bookings Content -->
        <div class="bookings-content">
          <div class="bookings-header">
            <div class="header-item">ID</div>
            <div class="header-item">Department</div>
            <div class="header-item">Event</div>
            <div class="header-item">Date</div>
            <div class="header-item">Person</div>
            <div class="header-item">Status</div>
            <div class="header-item">Actions</div>
          </div>

          <div class="bookings-cards">
            <div
              v-for="(booking, index) in paginatedBookings"
              :key="booking.id"
              class="booking-card"
            >
              <div class="booking-item">
                <div class="booking-id">{{ index + 1 }}</div>
                <div class="department">{{ booking.department }}</div>
                <div class="event">{{ booking.event_name }}</div>
                <div class="date">{{ formatDate(booking.request_date) }}</div>
                <div class="person">{{ booking.person_responsible }}</div>
                <div class="status">
                  <span class="status-badge" :class="booking.status">
                    {{ capitalizeFirstLetter(booking.status) }}
                  </span>
                </div>
                <div class="actions">
                  <button
                    class="action-btn approve-btn"
                    @click="updateStatus(booking.id, 'approved')"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    class="action-btn reject-btn"
                    @click="openRejectPrompt(booking.id)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    class="action-btn message-btn"
                    @click="sendMessage(booking)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 13 12 13C11.6357 13 11.2787 12.8934 10.97 12.7L2 7"
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

            <div v-if="filteredBookings.length === 0" class="empty-bookings">
              <p>No bookings found.</p>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination" v-if="filteredBookings.length > 0">
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

          <div class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </div>

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

    <!-- Rejection Prompt Modal -->
    <div v-if="showRejectPrompt" class="modal-overlay">
      <div class="modal">
        <h3>Reject Booking</h3>
        <p>Please provide a reason for rejecting this booking:</p>
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button class="reject-action-btn" @click="confirmRejection">
            Confirm
          </button>
          <button class="modal-close-btn" @click="closeRejectPrompt">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { createClient } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

export default {
  name: "AdminBookings",
  components: {
    DashboardLayout,
    AdminHeader,
  },
  data() {
    return {
      selectedDepartment: "", // Selected department filter
      dateFilter: "all", // Selected date range filter
      currentPage: 1, // Current page for pagination
      itemsPerPage: 10, // Number of items per page
      bookings: [], // Array to store bookings fetched from Supabase
      showRejectPrompt: false, // Controls visibility of the rejection prompt modal
      rejectionReason: "", // Stores the reason for rejection
      selectedBookingId: null, // Stores the ID of the booking being rejected
    };
  },
  computed: {
    // Filtered bookings based on department, date range, and unanswered status
    filteredBookings() {
      let filtered = [...this.bookings];

      // Filter by unanswered bookings (status = 'pending' and answered = false)
      filtered = filtered.filter(
        (booking) => booking.status === "pending" && booking.answered === false
      );

      // Filter by department
      if (this.selectedDepartment) {
        filtered = filtered.filter(
          (booking) => booking.department === this.selectedDepartment
        );
      }

      // Filter by date range
      if (this.dateFilter !== "all") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (this.dateFilter === "today") {
          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.request_date);
            bookingDate.setHours(0, 0, 0, 0);
            return bookingDate.getTime() === today.getTime();
          });
        } else if (this.dateFilter === "week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());

          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.request_date);
            return bookingDate >= weekStart;
          });
        } else if (this.dateFilter === "month") {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

          filtered = filtered.filter((booking) => {
            const bookingDate = new Date(booking.request_date);
            return bookingDate >= monthStart;
          });
        }
      }

      return filtered;
    },

    // Paginated bookings for the current page
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBookings.slice(start, end);
    },
    // Total number of pages for pagination
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
    },
  },
  methods: {
    // Fetch bookings from Supabase
    async fetchBookings() {
      try {
        console.log("Fetching bookings from Supabase...");
        const { data, error } = await supabase.from("bookings").select("*");
        if (error) throw error;

        console.log("Fetched bookings:", data);
        this.bookings = data;
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    },
    // Apply filters and reset to the first page
    applyFilters() {
      this.currentPage = 1;
    },
    // Update the status of a booking and mark it as answered
    updateStatus(id, newStatus, reason = null) {
      supabase
        .from("bookings")
        .update({ status: newStatus, remarks: reason, answered: true }) // Update status and set answered to true
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating status:", error.message);
          } else {
            // Update the local state
            const bookingIndex = this.bookings.findIndex((b) => b.id === id);
            if (bookingIndex !== -1) {
              this.bookings[bookingIndex].status = newStatus;
              this.bookings[bookingIndex].remarks = reason;
              this.bookings[bookingIndex].answered = true; // Mark as answered locally
            }
          }
        });
    },
    // Open the rejection prompt modal
    openRejectPrompt(id) {
      this.selectedBookingId = id;
      this.showRejectPrompt = true;
    },
    // Close the rejection prompt modal
    closeRejectPrompt() {
      this.showRejectPrompt = false;
      this.rejectionReason = "";
      this.selectedBookingId = null;
    },
    // Confirm rejection and update the booking status
    confirmRejection() {
      if (!this.rejectionReason.trim()) {
        alert("Please provide a reason for rejection.");
        return;
      }
      this.updateStatus(this.selectedBookingId, "rejected", this.rejectionReason);
      this.closeRejectPrompt();
    },
    // Format a date string into a readable format
    formatDate(dateString) {
      if (!dateString) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    // Capitalize the first letter of a string
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  },
  created() {
    // Fetch bookings when the component is created
    this.fetchBookings();
  },
};
</script>

<style scoped>
/* General Container Styles */
.bookings-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.bookings-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px;
  height: 100%;
}

/* Filters Section */
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
  color: #64748b;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
}

.filter-group select:focus {
  outline: none;
  border-color: #dd3859;
}

/* Bookings Content */
.bookings-content {
  margin-top: 24px;
}

.bookings-header {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px;
  background-color: #dd3859;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  color: white;
}

.header-item {
  font-size: 14px;
}

.bookings-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.booking-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.booking-item {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.booking-id {
  font-weight: 600;
  color: #dd3859;
}

.department,
.event,
.date,
.person {
  color: #1e293b;
  font-size: 14px;
}

.status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-badge.pending {
  background-color: #f59e0b;
}

.status-badge.approved {
  background-color: #10b981;
}

.status-badge.rejected {
  background-color: #ef4444;
}

/* Actions Section */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #f8fafc;
}

.approve-btn {
  color: #10b981;
  border-color: #10b981;
}

.reject-btn {
  color: #ef4444;
  border-color: #ef4444;
}

.message-btn {
  color: #3b82f6;
  border-color: #3b82f6;
}

.approve-btn:hover {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.reject-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.message-btn:hover {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

/* Empty Bookings */
.empty-bookings {
  padding: 48px 0;
  text-align: center;
  color: #64748b;
}

/* Pagination */
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
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f8fafc;
  border-color: #dd3859;
  color: #dd3859;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #64748b;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.modal p {
  margin-bottom: 16px;
  font-size: 14px;
  color: #555;
}

.modal textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.reject-action-btn {
  background-color: #ef4444;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reject-action-btn:hover {
  background-color: #dc2626;
}

.modal-close-btn {
  background-color: #ddd;
  color: #333;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-close-btn:hover {
  background-color: #bbb;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .bookings-header,
  .booking-item {
    grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 0.8fr 0.8fr;
  }
}

@media (max-width: 768px) {
  .bookings-container {
    padding: 16px;
  }

  .bookings-section {
    padding: 16px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .bookings-header {
    display: none;
  }

  .booking-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>