<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Booking Management" />
    <div class="bookings-container">
      <div class="bookings-section">
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label for="department-filter">Department:</label>
            <select id="department-filter" v-model="selectedDepartment" @change="applyFilters">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="date-filter">Date Range:</label>
            <select id="date-filter" v-model="dateFilter" @change="applyFilters">
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
              v-for="booking in paginatedBookings" 
              :key="booking.id" 
              class="booking-card"
            >
              <div class="booking-item">
                <div class="booking-id">{{ booking.id }}</div>
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
                  <button class="action-btn approve-btn" @click="updateStatus(booking.id, 'approved')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn reject-btn" @click="updateStatus(booking.id, 'rejected')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn message-btn" @click="sendMessage(booking)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 13 12 13C11.6357 13 11.2787 12.8934 10.97 12.7L2 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    
    <!-- Booking Details Modal -->
    <Modal 
      :show="showBookingModal" 
      title="Booking Details" 
      @close="closeModal"
    >
      <div v-if="selectedBooking" class="booking-details">
        <div class="detail-section">
          <h3>Requesting Party</h3>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Department:</span>
              <span class="detail-value">{{ selectedBooking.department }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Club/Organization:</span>
              <span class="detail-value">{{ selectedBooking.club || 'N/A' }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Person Responsible:</span>
              <span class="detail-value">{{ selectedBooking.person }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Contact No.:</span>
              <span class="detail-value">{{ selectedBooking.contact }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>Event Details</h3>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Name of Event:</span>
              <span class="detail-value">{{ selectedBooking.event }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Expected Attendees:</span>
              <span class="detail-value">{{ selectedBooking.attendance }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Booking Date:</span>
              <span class="detail-value">{{ formatDate(selectedBooking.requestDate) }}</span>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Event Time:</span>
              <span class="detail-value">{{ selectedBooking.startTime }} - {{ selectedBooking.endTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>Facility</h3>
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="detail-label">Laboratory Equipment:</span>
              <span class="detail-value">{{ selectedBooking.facility }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">Noted By:</span>
              <span class="detail-value">{{ selectedBooking.notedBy || 'Pending' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date Filled:</span>
              <span class="detail-value">{{ formatDate(selectedBooking.dateFilled) }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section status-section">
          <h3>Current Status: 
            <span class="status-badge" :class="selectedBooking.status">
              {{ capitalizeFirstLetter(selectedBooking.status) }}
            </span>
          </h3>
          
          <div v-if="selectedBooking.status === 'pending'" class="status-actions">
            <button class="approve-action-btn" @click="updateStatus(selectedBooking.id, 'approved')">
              Approve Booking
            </button>
            <button class="reject-action-btn" @click="updateStatus(selectedBooking.id, 'rejected')">
              Reject Booking
            </button>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button class="modal-close-btn" @click="closeModal">Close</button>
      </template>
    </Modal>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Modal from '@/components/ui/Modal.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';

export default {
  name: 'AdminBookings',
  components: {
    DashboardLayout,
    Modal,
    AdminHeader
  },
  data() {
    return {
      selectedDepartment: '',
      dateFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      showBookingModal: false,
      selectedBooking: null,
      bookings: [
        {
          id: 'BK001',
          department: 'Computer Studies',
          club: 'Programming Club',
          person: 'John Doe',
          contact: '09123456789',
          event: 'Coding Workshop',
          attendance: 30,
          requestDate: '2025-03-20',
          startTime: '09:00',
          endTime: '12:00',
          facility: 'Computers with IDE, Projector',
          notedBy: 'Dr. Smith',
          dateFilled: '2025-03-14',
          status: 'pending'
        },
        {
          id: 'BK002',
          department: 'Engineering',
          club: 'Robotics Society',
          person: 'Jane Smith',
          contact: '09987654321',
          event: 'Robot Assembly Demo',
          attendance: 25,
          requestDate: '2025-03-22',
          startTime: '13:00',
          endTime: '16:00',
          facility: 'Workbenches, Soldering Equipment, Projector',
          notedBy: 'Dr. Johnson',
          dateFilled: '2025-03-13',
          status: 'approved'
        },
        {
          id: 'BK003',
          department: 'Science',
          club: 'Chemistry Club',
          person: 'Mike Wilson',
          contact: '09456789123',
          event: 'Chemical Reactions Demonstration',
          attendance: 20,
          requestDate: '2025-03-18',
          startTime: '10:00',
          endTime: '12:00',
          facility: 'Lab Equipment, Safety Gear, Chemicals',
          notedBy: 'Dr. Brown',
          dateFilled: '2025-03-10',
          status: 'rejected'
        },
        {
          id: 'BK004',
          department: 'Computer Studies',
          club: 'Game Development Club',
          person: 'Sarah Lee',
          contact: '09789123456',
          event: 'Game Jam',
          attendance: 40,
          requestDate: '2025-03-25',
          startTime: '08:00',
          endTime: '17:00',
          facility: 'High-performance PCs, Game engines installed',
          notedBy: 'Dr. Garcia',
          dateFilled: '2025-03-15',
          status: 'pending'
        },
        {
          id: 'BK005',
          department: 'Engineering',
          club: 'Civil Engineering Society',
          person: 'Robert Chen',
          contact: '09321654987',
          event: 'Structural Design Workshop',
          attendance: 35,
          requestDate: '2025-03-30',
          startTime: '14:00',
          endTime: '17:00',
          facility: 'CAD Software, Projector, Materials Testing Equipment',
          notedBy: 'Dr. Martinez',
          dateFilled: '2025-03-16',
          status: 'pending'
        }
      ]
    }
  },
  computed: {
    filteredBookings() {
      let filtered = [...this.bookings];
      
      // Filter by department
      if (this.selectedDepartment) {
        filtered = filtered.filter(booking => booking.department === this.selectedDepartment);
      }
      
      // Filter by date range
      if (this.dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (this.dateFilter === 'today') {
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.requestDate);
            bookingDate.setHours(0, 0, 0, 0);
            return bookingDate.getTime() === today.getTime();
          });
        } else if (this.dateFilter === 'week') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.requestDate);
            return bookingDate >= weekStart;
          });
        } else if (this.dateFilter === 'month') {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.requestDate);
            return bookingDate >= monthStart;
          });
        }
      }
      
      return filtered;
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBookings.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
    }
  },
  methods: {
    applyFilters() {
      this.currentPage = 1;
    },
    viewBooking(booking) {
      this.selectedBooking = booking;
      this.showBookingModal = true;
    },
    updateStatus(id, newStatus) {
      // Find and update the booking status
      const bookingIndex = this.bookings.findIndex(b => b.id === id);
      if (bookingIndex !== -1) {
        this.bookings[bookingIndex].status = newStatus;
        
        // If we're updating from the modal, update the selected booking too
        if (this.selectedBooking && this.selectedBooking.id === id) {
          this.selectedBooking.status = newStatus;
        }
      }
      
      // In a real app, you would make an API call here
      console.log(`Booking ${id} status updated to ${newStatus}`);
    },
    closeModal() {
      this.showBookingModal = false;
      this.selectedBooking = null;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    sendMessage(booking) {
      console.log(`Sending message to ${booking.person} for booking ${booking.id}`);
    }
  }
}
</script>

<style scoped>
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

.bookings-content {
  margin-top: 24px;
}

.bookings-header {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 0.8fr 0.8fr;
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

.bookings-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.booking-card {
  border: 1px solid #E2E8F0;
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
  color: #DD3859;
}

.department, .event, .date, .person {
  color: #1E293B;
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
  background-color: #F59E0B;
}

.status-badge.approved {
  background-color: #10B981;
}

.status-badge.rejected {
  background-color: #EF4444;
}

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
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #F8FAFC;
}

.approve-btn {
  color: #10B981;
  border-color: #10B981;
}

.reject-btn {
  color: #EF4444;
  border-color: #EF4444;
}

.message-btn {
  color: #3B82F6;
  border-color: #3B82F6;
}

.approve-btn:hover {
  color: #10B981;
  background-color: rgba(16, 185, 129, 0.1);
}

.reject-btn:hover {
  color: #EF4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.message-btn:hover {
  color: #3B82F6;
  background-color: rgba(59, 130, 246, 0.1);
}

.empty-bookings {
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

/* Modal Styles */
.booking-details {
  padding: 1rem 0;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
}

.detail-item {
  flex: 1;
  min-width: 200px;
}

.detail-item.full-width {
  flex: 0 0 100%;
}

.detail-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.status-section {
  border-top: 1px solid #ebebeb;
  padding-top: 1.5rem;
}

.status-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.approve-action-btn,
.reject-action-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.approve-action-btn {
  background-color: #52C41A;
  color: white;
}

.reject-action-btn {
  background-color: #FF4D4F;
  color: white;
}

.approve-action-btn:hover {
  background-color: #389e0d;
}

.reject-action-btn:hover {
  background-color: #cf1322;
}

.modal-close-btn {
  padding: 0.5rem 1.5rem;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.modal-close-btn:hover {
  background-color: #ebebeb;
}

@media (max-width: 1024px) {
  .bookings-header, .booking-item {
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
