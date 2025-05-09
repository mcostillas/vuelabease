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
            <label for="status-filter">Status:</label>
            <select
              id="status-filter"
              v-model="statusFilter"
              @change="applyFilters"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div class="search-group">
            <label for="search-input">Search:</label>
            <div class="search-input-container">
              <input
                type="text"
                id="search-input"
                v-model="searchQuery"
                placeholder="Search by event, person, or department..."
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

          <div class="bookings-cards-container">
            <div class="bookings-cards">
              <div
                v-for="(booking, index) in paginatedBookings"
                :key="booking.id"
                class="booking-card"
              >
                <div class="booking-item">
                  <div class="booking-id">{{ index + 1 }}</div>
                  <div class="department">{{ booking.department }}</div>
                  <div class="event">{{ booking.event }}</div>
                  <div class="date">{{ formatDate(booking.requestDate) }}</div>
                  <div class="person">{{ booking.person }}</div>
                  <div class="status">
                    <span class="status-badge" :class="booking.status">
                      {{ capitalizeFirstLetter(booking.status) }}
                    </span>
                  </div>
                  <div class="actions">
                    <div class="action-menu">
                      <button class="menu-trigger" @click="toggleActionMenu(booking.id)">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="12" cy="6" r="2" fill="currentColor" />
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                          <circle cx="12" cy="18" r="2" fill="currentColor" />
                        </svg>
                      </button>
                      <div class="action-dropdown" v-if="activeActionMenu === booking.id">
                        <button class="action-btn approve-btn" @click="openApprovalPrompt(booking.id)">
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
                          <span>Approve</span>
                        </button>
                        <button class="action-btn reject-btn" @click="openRejectPrompt(booking.id)">
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
                          <span>Reject</span>
                        </button>
                        <button class="action-btn details-btn" @click="openBookingDetailsModal(booking)">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 8V12"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12 16H12.01"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredBookings.length === 0" class="empty-bookings">
                <p>No bookings found.</p>
              </div>
            </div>
          </div>
          <!-- Close bookings-cards-container -->
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
    <!-- Booking Details Modal -->
    <div v-if="showBookingDetailsModal" class="modal-overlay">
      <div class="modal booking-details-modal">
        <div class="modal-header">
          <h3>Booking Details</h3>
          <button class="close-button" @click="closeBookingDetailsModal">
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
        </div>
        <div class="modal-content">
          <div class="detail-item">
            <div class="detail-label">Event: </div>
            <div class="detail-value">{{ selectedBookingDetails.event }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Person Responsible: </div>
            <div class="detail-value">{{ selectedBookingDetails.person }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Department: </div>
            <div class="detail-value">{{ selectedBookingDetails.department }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Date: </div>
            <div class="detail-value">{{ formatDate(selectedBookingDetails.requestDate) }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Time: </div>
            <div class="detail-value">
              {{ formatTime(selectedBookingDetails.startTime) }} - {{ formatTime(selectedBookingDetails.endTime) }}
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Requester: </div>
            <div class="detail-value">{{ selectedBookingDetails.person }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Selected Laboratory: </div>
            <div class="detail-value">{{ selectedBookingDetails.selectedRoom }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status: </div>
            <div class="detail-value">{{ capitalizeFirstLetter(selectedBookingDetails.status) }}</div>
          </div>
        </div>
        <div class="form-actions center">
          <button type="button" class="cancel-btn" @click="closeBookingDetailsModal">Close</button>
        </div>
      </div>
    </div>
    <!-- Approval Prompt Modal -->
    <div v-if="showApprovalPrompt" class="modal-overlay">
      <div class="modal confirm-approval">
        <div class="modal-header">
          <h3>Approve Booking</h3>
          <button class="close-button" @click="closeApprovalPrompt">
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
        </div>
        <div class="modal-content">
          <div class="icon-container">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke="#10B981"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="approval-message">
            Are you sure you want to approve this booking?
          </p>
        </div>
        <div class="form-actions center">
          <button type="button" class="cancel-btn" @click="closeApprovalPrompt">
            Cancel
          </button>
          <button type="button" class="labease-btn" @click="confirmApproval">
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
    <!-- Rejection Prompt Modal -->
    <div v-if="showRejectPrompt" class="modal-overlay">
      <div class="modal confirm-reject">
        <div class="modal-header">
          <h3>Reject Booking</h3>
          <button class="close-button" @click="closeRejectPrompt">
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
        </div>
        <div class="modal-content">
          <div class="icon-container">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                stroke="#DD3859"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="reject-message">
            Please provide a reason for rejecting this booking:
          </p>
          <textarea
            v-model="rejectionReason"
            placeholder="Enter rejection reason..."
            rows="4"
            class="reject-textarea"
          ></textarea>
        </div>
        <div class="form-actions center">
          <button type="button" class="cancel-btn" @click="closeRejectPrompt">
            Cancel
          </button>
          <button type="button" class="labease-btn" @click="confirmRejection">
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { ref } from "vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import { createClient } from "@supabase/supabase-js";

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
  setup() {
    const activeActionMenu = ref(null);
    
    // Toggle action menu function
    const toggleActionMenu = (bookingId) => {
      if (activeActionMenu.value === bookingId) {
        activeActionMenu.value = null;
      } else {
        activeActionMenu.value = bookingId;
      }
    };

    return {
      activeActionMenu,
      toggleActionMenu,
    };
  },
  data() {
    return {
      // Selected department filter
      selectedDepartment: "",
      searchQuery: "", // Search query for filtering bookings
      statusFilter: "", // Status filter for bookings
      currentPage: 1, // Current page for pagination
      itemsPerPage: 10, // Number of items per page
      bookings: [], // Array to store bookings fetched from Supabase
      showRejectPrompt: false, // Controls visibility of the rejection prompt modal
      rejectionReason: "", // Stores the reason for rejection
      selectedBookingId: null, // Stores the ID of the booking being rejected
      showBookingDetailsModal: false, // Controls visibility of the booking details modal
      selectedBookingDetails: null, 
      showApprovalPrompt: false,
    };
  },
  computed: {
    // Filtered bookings based on department, search query, status, and unanswered status
    filteredBookings() {
      let filtered = [...this.bookings];

      // If no status filter is selected, only show pending unanswered bookings by default
      if (!this.statusFilter) {
        filtered = filtered.filter(
          (booking) => booking.status === "pending" && booking.answered === false
        );
      } else {
        // Otherwise, filter by the selected status
        filtered = filtered.filter((booking) => {
          if (this.statusFilter === "pending") {
            return booking.status === "pending" && booking.answered === false;
          } else {
            return booking.status === this.statusFilter;
          }
        });
      }

      // Filter by department
      if (this.selectedDepartment) {
        filtered = filtered.filter(
          (booking) => booking.department === this.selectedDepartment
        );
      }

      // Filter by search query
      if (this.searchQuery.trim() !== "") {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((booking) => {
          return (
            (booking.event && booking.event.toLowerCase().includes(query)) ||
            (booking.person && booking.person.toLowerCase().includes(query)) ||
            (booking.department && booking.department.toLowerCase().includes(query))
          );
        });
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
    // Toggle the action menu dropdown
    // Open the booking details modal
    
    formatTime(time) {
      if (!time || typeof time !== "string") {
        return "Invalid Time"; // Handle undefined or invalid time
      }
      const [hour, minute] = time.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12; // Convert to 12-hour format
      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
    },
   
    openBookingDetailsModal(booking) {
  console.log("Opening booking details modal for:", booking); // Debugging log
  this.selectedBookingDetails = booking; // Set the selected booking details
  this.showBookingDetailsModal = true; // Open the modal

  // Ensure other modals are closed
  this.showApprovalPrompt = false;
  this.showRejectPrompt = false;
},

closeBookingDetailsModal() {
  console.log("Closing booking details modal"); // Debugging log
  this.showBookingDetailsModal = false; // Close the modal
  this.selectedBookingDetails = null; // Clear the selected booking details
},

    

    // Fetch bookings from Supabase
    async fetchBookings() {
  try {
    console.log("Fetching bookings from Supabase...");
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false }); // Sort by created_at in descending order

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
  // Retrieve the logged-in user's name
  const loggedInUser = localStorage.getItem('firstName'); // Replace 'userName' with the actual key

  // First get the booking details to create a proper notification
  supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single()
    .then(({ data: booking, error: fetchError }) => {
      if (fetchError) {
        console.error("Error fetching booking details:", fetchError.message);
        return;
      }

      console.log('Retrieved booking details for notification:', booking);

      // Now update the booking status and notedBy column
      supabase
        .from("bookings")
        .update({
          status: newStatus,
          remarks: reason,
          answered: true, // Mark as answered
          notedBy: loggedInUser, // Add the admin's name who processed the booking
        })
        .eq("id", id)
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error("Error updating booking status:", updateError.message);
          } else {
            console.log(`Booking ${id} status updated to ${newStatus}`);
            // Update the local bookings array to reflect the changes
            const bookingIndex = this.bookings.findIndex((b) => b.id === id);
            if (bookingIndex !== -1) {
              this.bookings[bookingIndex].status = newStatus;
              this.bookings[bookingIndex].remarks = reason;
              this.bookings[bookingIndex].answered = true; // Mark as answered locally
              this.bookings[bookingIndex].notedBy = loggedInUser; // Update locally
            }

            // Create a notification for both approved and rejected bookings
            if (booking.instructorEmail) {
              console.log(`Creating ${newStatus} notification for instructor: ${booking.instructorEmail}`);
              // Pass only the booking object to the createNotification method
              this.createNotification(booking);
            } else {
              console.log('No instructor email found in booking, cannot create notification');
            }
          }
        });
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
    // Open the approval prompt modal
    openApprovalPrompt(id) {
      this.selectedBookingId = id;
      this.showApprovalPrompt = true;
    },

    // Close the approval prompt modal
    closeApprovalPrompt() {
      this.showApprovalPrompt = false;
      this.selectedBookingId = null;
    },

    // Confirm approval and update the booking status
    confirmApproval() {
      this.updateStatus(this.selectedBookingId, "approved");
      this.closeApprovalPrompt();
    },
    // Confirm rejection and update the booking status
    confirmRejection() {
      if (!this.rejectionReason.trim()) {
        alert("Please provide a reason for rejection.");
        return;
      }
      this.updateStatus(
        this.selectedBookingId,
        "rejected",
        this.rejectionReason
      );
      this.closeRejectPrompt();
    },
    
    // Create a notification for the instructor about booking status changes
    createNotification(booking) {
      console.log('Creating notification for booking:', booking);
      console.log('Instructor email:', booking.instructorEmail);
      
      // Calculate timeRange from startTime and endTime
      const timeRange = booking.startTime && booking.endTime ? 
        `${booking.startTime} - ${booking.endTime}` : 'Not specified';
      
      console.log('Calculated timeRange for notification:', timeRange);

      // Update the booking to mark notification as sent
      supabase
        .from("bookings")
        .update({
          notification_sent: true
        })
        .eq("id", booking.id)
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error("Error updating booking notification status:", updateError.message);
          } else {
            console.log(`Booking ${booking.id} marked as notification sent`);
          }
        });
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
  color: #64748b;
}

.search-input-container {
  position: relative;
}

.search-group input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background-color: white;
  width: 100%;
  font-family: "Poppins", sans-serif;
}

.search-group input:focus {
  outline: none;
  border-color: #dd3859;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
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
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
  gap: 16px; /* Add gap between label and value */
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b; /* Grayish color for labels */
  flex: 1; /* Allow labels to take up space */
  text-align: left;
  white-space: nowrap; /* Prevent text from wrapping */
}

.detail-value {
  font-size: 14px;
  font-weight: bolder;
  color: #1e293b; /* Darker color for values */

  text-align: right;
  flex: 2; /* Allow values to take up more space */
  white-space: nowrap; /* Prevent text from wrapping */
 
 
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

.status-badge.approved, .status-badge.confirmed {
  background-color: #e6f7e6;
  color: #22c55e;
}

.status-badge.cancelled, .status-badge.rejected {
  background-color: #f1f1f1;
  color: #6b7280;
}

.status-badge.active {
  background-color: #e6f7e6;
  color: #22c55e;
}

.status-badge.inactive {
  background-color: #FFF1F3;
  color: #DD3859;
}

/* Actions Section */
.actions {
  display: flex;
  justify-content: flex-start; /* Align to the left to match header */
  align-items: center;
  padding-left: 16px; /* Add padding to align with header text */
}

.action-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.menu-trigger {
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
  color: #64748b;
}

.menu-trigger:hover {
  background-color: #f8fafc;
  color: #dd3859;
  border-color: #dd3859;
}

.action-dropdown {
  position: absolute;
  top: -10px;
  left: 40px; /* Width of button (32px) + small gap */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.action-btn {
  width: 100%;
  height: auto;
  padding: 8px 12px;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.action-btn:last-child {
  border-bottom: none;
}

.action-btn span {
  font-size: 14px;
}

.action-btn:hover {
  background-color: #f8fafc;
}

.approve-btn {
  color: #10b981;
  border-color: #e2e8f0;
}

.reject-btn {
  color: #ef4444;
  border-color: #e2e8f0;
}


.approve-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

.reject-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.details-btn {
  color: #3b82f6; /* Blue color for details */
  border-color: #3b82f6;
}

.details-btn:hover {
  background-color: rgba(59, 130, 246, 0.1); /* Light blue background on hover */
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

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
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
  backdrop-filter: blur(4px);
}

.modal {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modal-appear 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #dd3859;
  font-family: "Poppins", sans-serif;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #dd3859;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  border-radius: 50%;
}

.close-button:hover {
  opacity: 0.7;
}

.modal-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.reject-message {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.reject-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.reject-textarea:focus {
  outline: none;
  border-color: #dd3859;
  box-shadow: 0 0 0 2px rgba(221, 56, 89, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #eee;
}

.form-actions.center {
  justify-content: center; 
}

.cancel-btn {
  padding: 0.8rem 2rem;
  font-weight: 500;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #eee;
}

.labease-btn {
  background-color: #dd3859;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.labease-btn:hover {
  background-color: #c8314f;
}

@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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
