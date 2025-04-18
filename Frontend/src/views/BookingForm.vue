<template>
  <div class="booking-container">
    <div class="booking-form-wrapper">
      <div class="form-header">
        <router-link to="/" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" fill="none" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 12H20" fill="none" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
        <h1>Laboratory Facility Booking Form</h1>
      </div>

      <form class="booking-form" @submit.prevent="handleBooking">
        <section class="form-section">
          <h2>REQUESTING PARTY</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <div class="input-wrapper">
                <input type="text" id="department" v-model="department" required>
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4H4C3.45 4 3 4.45 3 5V19C3 19.55 3.45 20 4 20H20C20.55 20 21 19.55 21 19V5C21 4.45 20.55 4 20 4ZM19 18H5V8H19V18ZM19 8H5V6H19V8Z" fill="#dd3859"/>
                    <path d="M15 10H9V12H15V10Z" fill="#dd3859"/>
                    <path d="M15 13H9V15H15V13Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="club">Club/Organization</label>
              <div class="input-wrapper">
                <input type="text" id="club" v-model="club">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="person">Person Responsible</label>
              <div class="input-wrapper">
                <input type="text" id="person" v-model="person" required>
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="contact">Contact No.</label>
              <div class="input-wrapper">
                <input type="tel" id="contact" v-model="contact" required>
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 15.5C18.8 15.5 17.5 15.3 16.4 14.9C16.3 14.9 16.2 14.9 16.1 14.9C15.8 14.9 15.6 15 15.4 15.2L13.2 17.4C10.4 15.9 8 13.6 6.6 10.8L8.8 8.6C9.1 8.3 9.2 7.9 9 7.6C8.7 6.5 8.5 5.2 8.5 4C8.5 3.5 8 3 7.5 3H4C3.5 3 3 3.5 3 4C3 13.4 10.6 21 20 21C20.5 21 21 20.5 21 20V16.5C21 16 20.5 15.5 20 15.5Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>EVENT DETAILS</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="event">Name of Event</label>
              <div class="input-wrapper">
                <input type="text" id="event" v-model="event" required>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="attendance">Expected Attendees</label>
              <div class="input-wrapper">
                <input type="number" id="attendance" v-model="attendance" required>
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="requestDate">Booking Request Date</label>
              <div class="input-wrapper">
                <input type="date" id="requestDate" v-model="requestDate" required class="custom-date-input" @change="checkRoomAvailability">
                <span class="input-icon date-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="startTime">Event Start Time</label>
              <div class="input-wrapper">
                <input type="time" id="startTime" v-model="startTime" required class="time-input">
                <span class="input-icon time-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#dd3859"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="endTime">Event End Time</label>
              <div class="input-wrapper">
                <input type="time" id="endTime" v-model="endTime" required class="time-input">
                <span class="input-icon time-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#dd3859"/>
                    <path d="M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#dd3859"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>ROOM AVAILABILITY</h2>
          <div v-if="!requestDate" class="date-required-message">
            <p>Please select a booking date to see available rooms.</p>
          </div>
          
          <template v-else>
            <div class="form-group">
              <label for="room">Select Laboratory Room</label>
              <div class="input-wrapper select-wrapper">
                <select id="room" v-model="selectedRoom" required>
                  <option value="" disabled selected>Choose a laboratory room</option>
                  <option v-for="room in filteredRooms" :key="room.id" :value="room.id">
                    {{ room.name }} - {{ room.available ? 'Available' : 'Unavailable' }}
                  </option>
                </select>
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#dd3859"/>
                    <path d="M12 15V9m0 6l3-3m-3 3l-3-3" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
            
            <div class="room-availability-container" v-if="filteredRooms.length > 0">
              <div class="room-card" v-for="room in filteredRooms" :key="room.id" 
                  :class="{'selected': selectedRoom === room.id, 'unavailable': !room.available}"
                  @click="selectRoom(room.id)">
                <div class="room-header">
                  <h3>{{ room.name }}</h3>
                  <span class="room-status" :class="room.available ? 'available' : 'unavailable'">
                    {{ room.available ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="no-rooms-message" v-else>
              <p>No laboratory rooms are available for the selected date.</p>
            </div>
          </template>
        </section>

        <section class="form-section">
          <h2>FACILITY</h2>
          <div class="form-group">
            <label for="facility">Laboratory Equipment</label>
            <div class="input-wrapper">
              <input type="text" id="facility" v-model="facility" placeholder="List equipment needed" required>
              <span class="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM19 8H5V6H19V8Z" fill="#dd3859"/>
                </svg>
              </span>
            </div>
          </div>
        </section>

        <section class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label for="notedBy">NOTED BY</label>
              <input type="text" id="notedBy" v-model="notedBy" readonly>
              <small class="input-caption">Program Dean/Adviser/Moderator</small>
            </div>
            <div class="form-group">
              <label for="dateFilled">DATE FILLED</label>
              <input type="date" id="dateFilled" v-model="dateFilled" readonly class="custom-date-input readonly-input">
            </div>
          </div>
        </section>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" @click.prevent="handleBooking">Submit</button>
        </div>
      </form>
    </div>
  </div>
  
  <!-- Success Modal -->
  <Modal 
    :show="showSuccessModal" 
    title="Booking Successful" 
    :show-footer="false"
    :close-on-overlay-click="false"
    @close="closeModal"
  >
    <div class="success-message">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-icon">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#dd3859"/>
      </svg>
      <p>Your booking has been submitted successfully!</p>
      <p>Thank you for using LabEase.</p>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/ui/Modal.vue';

export default {
  name: 'BookingForm',
  components: {
    Modal
  },
  data() {
    return {
      department: '',
      club: '',
      person: '',
      contact: '',
      event: '',
      attendance: '',
      requestDate: '',
      startTime: '',
      endTime: '',
      facility: '',
      notedBy: '',
      dateFilled: new Date().toISOString().substr(0, 10),
      errorMessage: '',
      showSuccessModal: false,
      selectedRoom: '',
      availableRooms: [
        {
          id: 'L201',
          name: 'L201',
          availableDates: ['2025-04-01', '2025-04-02', '2025-04-05', '2025-04-06']
        },
        {
          id: 'L202',
          name: 'L202',
          availableDates: ['2025-04-02', '2025-04-03', '2025-04-04', '2025-04-07']
        },
        {
          id: 'L203',
          name: 'L203',
          availableDates: ['2025-04-01', '2025-04-04', '2025-04-05', '2025-04-08']
        },
        {
          id: 'L204',
          name: 'L204',
          availableDates: ['2025-04-03', '2025-04-06', '2025-04-07', '2025-04-09']
        },
        {
          id: 'L205',
          name: 'L205',
          availableDates: ['2025-04-01', '2025-04-02', '2025-04-08', '2025-04-10']
        },
        {
          id: 'openlab',
          name: 'Open Laboratory',
          availableDates: ['2025-04-04', '2025-04-05', '2025-04-09', '2025-04-10']
        },
        {
          id: 'iotlab',
          name: 'IoT Laboratory',
          availableDates: ['2025-04-01', '2025-04-03', '2025-04-06', '2025-04-07']
        }
      ],
      filteredRooms: []
    }
  },
  methods: {
    handleBooking() {
      // Clear previous error message
      this.errorMessage = ''
      
      // Simple validation
      if (!this.department || !this.person || !this.contact || !this.event || 
          !this.attendance || !this.requestDate || !this.startTime || 
          !this.endTime || !this.facility || !this.dateFilled || !this.selectedRoom) {
        this.errorMessage = 'Please fill in all required fields'
        return
      }
      
      // Validate time range
      if (this.startTime >= this.endTime) {
        this.errorMessage = 'End time must be after start time'
        return
      }
      
      // Check if selected room is available
      const selectedRoom = this.filteredRooms.find(room => room.id === this.selectedRoom);
      if (selectedRoom && !selectedRoom.available) {
        this.errorMessage = 'The selected room is currently unavailable. Please choose another room.'
        return
      }
      
      // Show success modal
      this.showSuccessModal = true
      
      // Automatically redirect after 2.5 seconds
      setTimeout(() => {
        this.closeModal()
        this.$router.push('/login')
      }, 3500)
    },
    closeModal() {
      this.showSuccessModal = false
    },
    selectRoom(roomId) {
      // Only allow selecting available rooms
      const room = this.filteredRooms.find(r => r.id === roomId);
      if (room && room.available) {
        this.selectedRoom = roomId;
      }
    },
    checkRoomAvailability() {
      // Reset selected room when date changes
      this.selectedRoom = '';
      
      // If no date is selected, clear filtered rooms
      if (!this.requestDate) {
        this.filteredRooms = [];
        return;
      }
      
      // Filter rooms based on selected date
      this.filteredRooms = this.availableRooms.map(room => {
        return {
          ...room,
          available: room.availableDates.includes(this.requestDate)
        };
      });
    }
  }
}
</script>

<style scoped>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
}

/* Booking Container */
.booking-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #ffffff;
}

.booking-form-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 2rem;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-header h1 {
  color: #dd3859;
  font-size: 2rem;
  font-weight: 600;
}

/* Back Button */
.back-button {
  position: absolute;
  left: 0;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* Booking Form */
.booking-form {
  padding: 2rem;
}

/* Form Sections */
.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h2 {
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* Form Rows and Groups */
.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dd3859;
  pointer-events: none;
  z-index: 1;
  transition: color 0.3s ease;
}

.input-icon svg {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  position: relative;
  background-color: #fff;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #dd3859;
}

.form-group input:focus + .input-icon svg,
.form-group textarea:focus + .input-icon svg,
.form-group select:focus + .input-icon svg {
  opacity: 1;
}

.readonly-input {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  color: #E9256E;
  margin: 1rem 0;
  font-size: 0.875rem;
}

/* Form Actions */
.form-actions {
  margin-top: 3rem;
  text-align: right;
}

.submit-btn {
  background: #dd3859;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0.8rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.submit-btn:hover {
  background: #c62c4c;
}

/* Date and Time Inputs */
.custom-date-input,
.time-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  appearance: none;
  background-color: #fff;
  color: #333;
  position: relative;
  cursor: pointer;
}

/* Hide the default calendar and time picker icons */
.custom-date-input::-webkit-calendar-picker-indicator,
.time-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.custom-date-input:hover,
.time-input:hover {
  border-color: #dd3859;
}

.custom-date-input:focus,
.time-input:focus {
  border-color: #dd3859;
  box-shadow: 0 0 0 2px rgba(221, 56, 89, 0.1);
}

/* Ensure the SVG icons are properly positioned and don't overlap */
.date-icon,
.time-icon {
  pointer-events: none;
  z-index: 2;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-form-wrapper {
    padding: 1rem;
  }
  
  .booking-form {
    padding: 1.5rem;
  }
  
  .form-header h1 {
    font-size: 1.5rem;
  }
}

/* Success Modal Styles */
.success-message {
  text-align: center;
  padding: 1rem;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  animation: scaleIn 0.5s ease-in-out;
}

.checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 1s ease-in-out forwards;
  animation-delay: 0.5s;
}

@keyframes dash {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-message p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
  animation: fadeIn 0.5s ease-in-out forwards;
  opacity: 0;
}

.success-message p:nth-child(2) {
  animation-delay: 0.3s;
}

.success-message p:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Room Availability Styles */
.select-wrapper select {
  appearance: none;
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #fff;
  cursor: pointer;
}

.room-availability-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.room-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
}

.room-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.room-card.selected {
  border-color: #dd3859;
  box-shadow: 0 4px 12px rgba(221, 56, 89, 0.15);
}

.room-card.unavailable {
  opacity: 0.7;
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.room-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.room-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.room-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
  width: 100%;
}

.room-status.available {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.room-status.unavailable {
  background-color: #fdecea;
  color: #d32f2f;
}

.no-rooms-message {
  text-align: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 1rem;
}

.date-required-message {
  text-align: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 1rem;
  color: #666;
}
</style>
