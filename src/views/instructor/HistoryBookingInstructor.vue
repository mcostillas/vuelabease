<template>
  <div class="history-container">
    <div class="top-header">
      <h1 class="page-title">My Booking History</h1>
      <div class="action-controls">
        <div class="search-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by lab name..."
            class="search-input"
            @input="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-wrapper">
          <select v-model="statusFilter" class="filter-select" @change="filterBookings">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Data table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('id')" :class="{ active: sortKey === 'id' }">
              ID <i :class="getSortIcon('id')"></i>
            </th>
            <th @click="sortBy('labName')" :class="{ active: sortKey === 'labName' }">
              Laboratory <i :class="getSortIcon('labName')"></i>
            </th>
            <th @click="sortBy('bookingDate')" :class="{ active: sortKey === 'bookingDate' }">
              Date <i :class="getSortIcon('bookingDate')"></i>
            </th>
            <th @click="sortBy('startTime')" :class="{ active: sortKey === 'startTime' }">
              Start Time <i :class="getSortIcon('startTime')"></i>
            </th>
            <th @click="sortBy('endTime')" :class="{ active: sortKey === 'endTime' }">
              End Time <i :class="getSortIcon('endTime')"></i>
            </th>
            <th @click="sortBy('purpose')" :class="{ active: sortKey === 'purpose' }">
              Purpose <i :class="getSortIcon('purpose')"></i>
            </th>
            <th @click="sortBy('status')" :class="{ active: sortKey === 'status' }">
              Status <i :class="getSortIcon('status')"></i>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="loading-message">
              <div class="spinner"></div>
              Loading bookings...
            </td>
          </tr>
          <tr v-else-if="filteredBookings.length === 0">
            <td colspan="8" class="no-data-message">
              No booking history found
            </td>
          </tr>
          <tr v-for="booking in paginatedBookings" :key="booking.id" :class="{'cancelled': booking.status === 'cancelled', 'completed': booking.status === 'completed'}">
            <td>{{ booking.id }}</td>
            <td>{{ booking.labName }}</td>
            <td>{{ formatDate(booking.bookingDate) }}</td>
            <td>{{ booking.startTime }}</td>
            <td>{{ booking.endTime }}</td>
            <td>
              <span class="purpose-text">{{ truncateText(booking.purpose, 30) }}</span>
            </td>
            <td>
              <span class="status-badge" :class="booking.status">
                {{ capitalize(booking.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-view" @click="viewBookingDetails(booking)">
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="booking.status === 'pending'"
                  class="btn-cancel" 
                  @click="cancelBooking(booking.id)">
                  <i class="fas fa-times"></i>
                </button>
                <button 
                  v-if="booking.status === 'approved' || booking.status === 'completed'"
                  class="btn-export" 
                  @click="exportBooking(booking)">
                  <i class="fas fa-file-export"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <div class="page-info">
        Showing {{ paginationInfo.start }} to {{ paginationInfo.end }} of {{ totalItems }} entries
      </div>
      <div class="pagination-controls">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <template v-for="page in totalPages" :key="page">
          <button 
            v-if="showPageNumber(page)"
            @click="goToPage(page)" 
            :class="['page-number', { active: currentPage === page }]">
            {{ page }}
          </button>
          <span v-else-if="showEllipsis(page)" class="ellipsis">...</span>
        </template>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Booking Details</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="booking-detail" v-if="selectedBooking">
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ selectedBooking.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Laboratory:</span>
              <span class="detail-value">{{ selectedBooking.labName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(selectedBooking.bookingDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">{{ selectedBooking.startTime }} - {{ selectedBooking.endTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Purpose:</span>
              <span class="detail-value">{{ selectedBooking.purpose }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value status-badge" :class="selectedBooking.status">
                {{ capitalize(selectedBooking.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Created At:</span>
              <span class="detail-value">{{ formatDatetime(selectedBooking.createdAt) }}</span>
            </div>
            <div v-if="selectedBooking.adminComment" class="detail-row">
              <span class="detail-label">Admin Comment:</span>
              <span class="detail-value">{{ selectedBooking.adminComment }}</span>
            </div>
          </div>

          <div class="modal-actions" v-if="selectedBooking && selectedBooking.status === 'pending'">
            <button class="cancel-booking-btn" @click="confirmCancelBooking">Cancel Booking</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal-container confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Cancellation</h2>
          <button class="close-btn" @click="closeConfirmation">&times;</button>
        </div>
        <div class="modal-content">
          <p>Are you sure you want to cancel this booking?</p>
          <div class="confirmation-actions">
            <button class="btn-secondary" @click="closeConfirmation">No, Keep It</button>
            <button class="btn-danger" @click="processCancelBooking">Yes, Cancel Booking</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import axios from 'axios'

export default {
  name: 'HistoryBookingInstructor',
  setup() {
    const bookings = ref([])
    const loading = ref(true)
    const searchQuery = ref('')
    const statusFilter = ref('all')
    const sortKey = ref('bookingDate')
    const sortOrder = ref('desc')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showModal = ref(false)
    const selectedBooking = ref(null)
    const showConfirmation = ref(false)
    const bookingToCancel = ref(null)

    // Fetch booking history for the instructor
    const fetchBookings = async () => {
      try {
        loading.value = true
        const response = await axios.get('/api/instructor/bookings/history')
        bookings.value = response.data
      } catch (error) {
        console.error('Failed to fetch booking history:', error)
      } finally {
        loading.value = false
      }
    }

    // Filter bookings based on search and status
    const filteredBookings = computed(() => {
      let result = [...bookings.value]
      
      // Apply status filter
      if (statusFilter.value !== 'all') {
        result = result.filter(booking => booking.status === statusFilter.value)
      }

      // Apply search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(booking => 
          booking.labName.toLowerCase().includes(query)
        )
      }

      // Apply sorting
      result.sort((a, b) => {
        let comparison = 0
        if (a[sortKey.value] > b[sortKey.value]) {
          comparison = 1
        } else if (a[sortKey.value] < b[sortKey.value]) {
          comparison = -1
        }
        return sortOrder.value === 'asc' ? comparison : -comparison
      })

      return result
    })

    // Pagination logic
    const totalItems = computed(() => filteredBookings.value.length)
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
    
    const paginatedBookings = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      return filteredBookings.value.slice(startIndex, endIndex)
    })

    const paginationInfo = computed(() => {
      const start = totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
      const end = Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
      return { start, end }
    })

    // Pagination methods
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const showPageNumber = (page) => {
      // Always show first page, last page, and pages around current page
      return page === 1 || 
             page === totalPages.value || 
             (page >= currentPage.value - 1 && page <= currentPage.value + 1)
    }

    const showEllipsis = (page) => {
      return (page === 2 && currentPage.value > 3) || 
             (page === totalPages.value - 1 && currentPage.value < totalPages.value - 2)
    }

    // Sorting
    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const getSortIcon = (key) => {
      if (sortKey.value !== key) return 'fas fa-sort'
      return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    }

    // Filtering and searching
    const handleSearch = () => {
      currentPage.value = 1
    }

    const filterBookings = () => {
      currentPage.value = 1
    }

    // Modal methods
    const viewBookingDetails = (booking) => {
      selectedBooking.value = booking
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    // Cancel booking
    const cancelBooking = (id) => {
      bookingToCancel.value = id
      showConfirmation.value = true
    }

    const confirmCancelBooking = () => {
      if (selectedBooking.value) {
        bookingToCancel.value = selectedBooking.value.id
        showConfirmation.value = true
        showModal.value = false
      }
    }

    const closeConfirmation = () => {
      showConfirmation.value = false
      bookingToCancel.value = null
    }

    const processCancelBooking = async () => {
      try {
        await axios.put(`/api/instructor/bookings/${bookingToCancel.value}/cancel`)
        
        // Update the local booking status
        bookings.value = bookings.value.map(booking => {
          if (booking.id === bookingToCancel.value) {
            return { ...booking, status: 'cancelled' }
          }
          return booking
        })
        
        closeConfirmation()
      } catch (error) {
        console.error('Failed to cancel booking:', error)
      }
    }

    // Export functionality
    const exportBooking = (booking) => {
      // Implement export functionality here
      console.log('Exporting booking:', booking.id)
    }

    // Utility methods
    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), 'MMM dd, yyyy')
      } catch (error) {
        return dateString
      }
    }

    const formatDatetime = (dateString) => {
      try {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
      } catch (error) {
        return dateString
      }
    }

    const truncateText = (text, length) => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    onMounted(() => {
      fetchBookings()
    })

    return {
      bookings,
      loading,
      searchQuery,
      statusFilter,
      sortKey,
      sortOrder,
      currentPage,
      totalPages,
      paginatedBookings,
      totalItems,
      paginationInfo,
      showModal,
      selectedBooking,
      showConfirmation,
      filteredBookings,
      handleSearch,
      filterBookings,
      sortBy,
      getSortIcon,
      goToPage,
      showPageNumber,
      showEllipsis,
      viewBookingDetails,
      closeModal,
      cancelBooking,
      confirmCancelBooking,
      closeConfirmation,
      processCancelBooking,
      exportBooking,
      formatDate,
      formatDatetime,
      truncateText,
      capitalize
    }
  }
}
</script>

<style scoped>
.history-container {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.75rem;
  color: #333;
  margin: 0;
}

.action-controls {
  display: flex;
  gap: 16px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  padding: 10px 16px 10px 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 280px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  min-width: 140px;
}

.table-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th {
  background-color: #f0f2f5;
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.data-table th.active {
  background-color: #e6eaf0;
}

.data-table th i {
  margin-left: 5px;
  font-size: 12px;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f5f8ff;
}

.loading-message, .no-data-message {
  padding: 40px;
  text-align: center;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #fff8e1;
  color: #f57c00;
}

.status-badge.approved {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.rejected {
  background-color: #ffebee;
  color: #c62828;
}

.status-badge.completed {
  background-color: #e8f0fe;
  color: #1976d2;
}

.status-badge.cancelled {
  background-color: #f5f5f5;
  color: #757575;
}

.purpose-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

tr.cancelled td {
  color: #999;
}

tr.completed {
  background-color: #f9fcff;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-view, .btn-export, .btn-cancel {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-view {
  background-color: #e3f2fd;
  color: #1976d2;
}

.btn-export {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.btn-cancel {
  background-color: #ffebee;
  color: #c62828;
}

.btn-view:hover {
  background-color: #bbdefb;
}

.btn-export:hover {
  background-color: #c8e6c9;
}

.btn-cancel:hover {
  background-color: #ffcdd2;
}

/* Pagination styles */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 10px;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn, .page-number {
  min-width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #444;
}

.page-number.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.page-btn:hover, .page-number:hover {
  background-color: #f0f2f5;
}

.page-btn:disabled {
  background-color: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0 8px;
  color: #666;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.confirmation-modal {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-content {
  padding: 24px;
}

.booking-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: row;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #555;
}

.detail-value {
  flex: 1;
  color: #333;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.cancel-booking-btn {
  padding: 10px 16px;
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-booking-btn:hover {
  background-color: #ffcdd2;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  padding: 10px 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-danger {
  padding: 10px 16px;
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #e9e9e9;
}

.btn-danger:hover {
  background-color: #b71c1c;
}
</style>
