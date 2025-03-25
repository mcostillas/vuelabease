<template>
  <div class="booking-container">
    <div class="booking-form-wrapper">
      <div class="form-header">
        <router-link to="/login" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
              <input type="text" id="department" v-model="department" required>
            </div>
            <div class="form-group">
              <label for="club">Club/Organization</label>
              <input type="text" id="club" v-model="club">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="person">Person Responsible</label>
              <input type="text" id="person" v-model="person" required>
            </div>
            <div class="form-group">
              <label for="contact">Contact No.</label>
              <input type="tel" id="contact" v-model="contact" required>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>EVENT DETAILS</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="event">Name of Event</label>
              <input type="text" id="event" v-model="event" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="attendance">Expected Attendees</label>
              <input type="number" id="attendance" v-model="attendance" required>
            </div>
            <div class="form-group">
              <label for="requestDate">Booking Request Date</label>
              <input type="date" id="requestDate" v-model="requestDate" required class="custom-date-input">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="startTime">Event Start Time</label>
              <input type="time" id="startTime" v-model="startTime" required>
            </div>
            <div class="form-group">
              <label for="endTime">Event End Time</label>
              <input type="time" id="endTime" v-model="endTime" required>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>FACILITY</h2>
          <div class="form-group">
            <label for="facility">Laboratory Equipment</label>
            <input type="text" id="facility" v-model="facility" placeholder="List equipment needed" required>
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
        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="checkmark" d="M22 4L12 14.01L9 11.01" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
      showSuccessModal: false
    }
  },
  methods: {
    handleBooking() {
      // Clear previous error message
      this.errorMessage = ''
      
      // Simple validation
      if (!this.department || !this.person || !this.contact || !this.event || 
          !this.attendance || !this.requestDate || !this.startTime || 
          !this.endTime || !this.facility || !this.dateFilled) {
        this.errorMessage = 'Please fill in all required fields'
        return
      }
      
      // Validate time range
      if (this.startTime >= this.endTime) {
        this.errorMessage = 'End time must be after start time'
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
}

.form-group label {
  display: block;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #dd3859;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1.2rem;
  padding-right: 2.5rem;
}

.input-caption {
  display: block;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.3rem;
  text-align: center;
}

/* Read-only Input */
input[readonly] {
  background-color: #f5f5f5;
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
input[type="time"] {
  width: 100%;
  padding: 0.8rem;
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23dd3859' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
  background-size: 18px;
  padding-right: 40px;
}

.custom-date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.custom-date-input:hover,
input[type="time"]:hover {
  border-color: #dd3859;
}

.custom-date-input:focus,
input[type="time"]:focus {
  border-color: #dd3859;
  box-shadow: 0 0 0 2px rgba(221, 56, 89, 0.1);
}

input[type="time"]::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23dd3859' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolyline points='12 6 12 12 16 14'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
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
</style>
