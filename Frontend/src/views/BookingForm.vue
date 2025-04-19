<template>
  <div class="booking-container">
    <div class="booking-layout">
      <div class="booking-form-wrapper">
        <div class="form-header">
          <router-link to="/login" class="back-button">
            <ArrowLeftIcon class="icon-primary" />
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
                  <BuildingOfficeIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="club">Club/Organization</label>
              <div class="input-wrapper">
                <input type="text" id="club" v-model="club">
                <span class="input-icon">
                  <UserGroupIcon class="icon-primary" />
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
                  <UserIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="contact">Contact No.</label>
              <div class="input-wrapper">
                <input type="tel" id="contact" v-model="contact" required>
                <span class="input-icon">
                  <PhoneIcon class="icon-primary" />
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
                <span class="input-icon">
                  <DocumentTextIcon class="icon-primary" />
                </span>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="attendance">Expected Attendees</label>
              <div class="input-wrapper">
                <input type="text" inputmode="numeric" pattern="[0-9]*" id="attendance" v-model="attendance" required class="no-spinner">
                <span class="input-icon">
                  <UserGroupIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="requestDate">Booking Request Date</label>
              <div class="input-wrapper">
                <input type="date" id="requestDate" v-model="requestDate" required class="custom-date-input" @change="checkRoomAvailability">
                <span class="input-icon date-icon">
                  <CalendarIcon class="icon-primary" />
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
                  <ClockIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="endTime">Event End Time</label>
              <div class="input-wrapper">
                <input type="time" id="endTime" v-model="endTime" required class="time-input">
                <span class="input-icon time-icon">
                  <ClockIcon class="icon-primary" />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>LABORATORY SELECTION</h2>
          <div class="form-group">
            <label for="room">Select Laboratory</label>
            <div class="input-wrapper select-wrapper">
              <select id="room" v-model="selectedRoom" required>
                <option value="" disabled selected>Choose a laboratory</option>
                <option value="L201">L201 - Computer Laboratory</option>
                <option value="L202">L202 - Computer Laboratory</option>
                <option value="L203">L203 - Computer Laboratory</option>
                <option value="L204">L204 - Computer Laboratory</option>
                <option value="L205">L205 - Computer Laboratory</option>
                <option value="IOT">IoT Laboratory</option>
                <option value="openlab">Open Laboratory</option>
              </select>
              <span class="input-icon">
                <ComputerDesktopIcon class="icon-primary" />
              </span>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>FACILITY</h2>
          <div class="form-group">
            <label for="facility">Laboratory Equipment</label>
            <div class="input-wrapper">
              <input type="text" id="facility" v-model="facility" placeholder="List equipment needed" required>
              <span class="input-icon">
                <ComputerDesktopIcon class="icon-primary" />
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

      <!-- Schedule View -->
      <div class="schedule-wrapper">
        <div class="schedule-header">
          <h2>Available Schedule</h2>
        </div>
        <div class="schedule-content">
          <div class="month-selector">
            <button class="month-nav" @click="previousMonth">
              <ArrowLeftIcon class="icon-small" />
            </button>
            <span>{{ currentMonthName }} {{ currentYear }}</span>
            <button class="month-nav" @click="nextMonth">
              <ArrowLeftIcon class="icon-small rotate-180" />
            </button>
          </div>
          
          <div class="calendar">
            <div class="calendar-header">
              <div v-for="day in weekDays" :key="day" class="calendar-cell header-cell">{{ day }}</div>
            </div>
            <div class="calendar-body">
              <div v-for="(day, index) in calendarDays" :key="index" 
                   class="calendar-cell" 
                   :class="{
                     'empty-cell': !day.date, 
                     'current-day': day.isToday,
                     'selected-day': day.date === requestDate,
                     'available-day': day.available,
                     'after-semester': day.isAfterSemester,
                     'past-date': day.isPastDate
                   }"
                   @click="selectDate(day)">
                <template v-if="day.date">
                  <span class="day-number">{{ day.dayNumber }}</span>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Time Slot Schedule -->
          <div class="time-slot-schedule" v-if="requestDate">
            <div class="schedule-section-header">
              <div class="schedule-title-row">
                <h3>Schedule for {{ formatDate(requestDate) }} ({{ selectedDayOfWeek || 'All Days' }})</h3>
              </div>
              <div class="schedule-actions">
                <button class="view-weekly-btn" @click="toggleWeeklyScheduleModal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 2V6" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 2V6" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 10H21" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  View Weekly Schedule
                </button>
              </div>
              <div class="schedule-legend">
                <div class="lab-selector">
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'all'}" @click="selectLabFilter('all')">All Labs</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'L201'}" @click="selectLabFilter('L201')">L201</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'L202'}" @click="selectLabFilter('L202')">L202</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'L203'}" @click="selectLabFilter('L203')">L203</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'L204'}" @click="selectLabFilter('L204')">L204</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'L205'}" @click="selectLabFilter('L205')">L205</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'IOT'}" @click="selectLabFilter('IOT')">IOT</button>
                  <button class="lab-btn" :class="{active: selectedLabFilter === 'openlab'}" @click="selectLabFilter('openlab')">Open Lab</button>
                </div>
              </div>
            </div>
            
            <!-- Weekly Schedule Table Layout -->
            <div class="weekly-schedule">
              <table class="schedule-table">
                <thead>
                  <tr>
                    <th class="time-header">Time</th>
                    <th v-if="!selectedDayOfWeek">Monday</th>
                    <th v-if="!selectedDayOfWeek">Tuesday</th>
                    <th v-if="!selectedDayOfWeek">Wednesday</th>
                    <th v-if="!selectedDayOfWeek">Thursday</th>
                    <th v-if="!selectedDayOfWeek">Friday</th>
                    <th v-if="!selectedDayOfWeek">Saturday</th>
                    <th v-if="selectedDayOfWeek">{{ selectedDayOfWeek }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="block in weeklyTimeBlocks" :key="block.id" class="time-block-row">
                    <td class="time-cell">{{ block.time }}</td>
                    <!-- Show all days when no specific day is selected -->
                    <template v-if="!selectedDayOfWeek">
                      <td v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" :key="day"
                          class="day-cell"
                          :class="{
                            'has-class': hasClassOnDay(block, day),
                            'lunch-time': block.isLunch || false,
                            'selected': isTimeBlockSelected(block, day),
                            'filtered-out': isFilteredOut(block, day)
                          }"
                          @click="selectTimeBlock(block, day)">
                        <div v-if="getClassForDayAndTime(block, day) && !isFilteredOut(block, day)" class="class-info">
                          <div class="class-code">{{ getClassForDayAndTime(block, day).class }}</div>
                          <div class="class-details">
                            <span class="class-section">{{ getClassForDayAndTime(block, day).section }}</span>
                            <span class="class-room">{{ getClassForDayAndTime(block, day).room }}</span>
                          </div>
                        </div>
                      </td>
                    </template>
                    <!-- Show only the selected day -->
                    <template v-else>
                      <td class="day-cell"
                          :class="{
                            'has-class': hasClassOnDay(block, selectedDayOfWeek),
                            'lunch-time': block.isLunch || false,
                            'selected': isTimeBlockSelected(block, selectedDayOfWeek),
                            'filtered-out': isFilteredOut(block, selectedDayOfWeek)
                          }"
                          @click="selectTimeBlock(block, selectedDayOfWeek)">
                        <div v-if="getClassForDayAndTime(block, selectedDayOfWeek) && !isFilteredOut(block, selectedDayOfWeek)" class="class-info">
                          <div class="class-code">{{ getClassForDayAndTime(block, selectedDayOfWeek).class }}</div>
                          <div class="class-details">
                            <span class="class-section">{{ getClassForDayAndTime(block, selectedDayOfWeek).section }}</span>
                            <span class="class-room">{{ getClassForDayAndTime(block, selectedDayOfWeek).room }}</span>
                          </div>
                        </div>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="selected-slot-info" v-if="selectedTimeSlot">
              <div class="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#dd3859"/>
                  <path d="M11 17H13V11H11V17ZM11 9H13V7H11V9Z" fill="#dd3859"/>
                </svg>
              </div>
              <div class="info-text">
                <p>You've selected <strong>{{ getSelectedRoomName() }}</strong> at <strong>{{ formatTimeSlot(selectedTimeSlot) }}</strong></p>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  </div>
  

  
  <!-- Weekly Schedule Modal -->
  <Modal 
    :show="showWeeklyScheduleModal" 
    title="Weekly Class Schedule" 
    :show-footer="true"
    @close="toggleWeeklyScheduleModal"
    class="weekly-modal"
  >
    <div class="weekly-schedule-modal-content">
      <!-- Placeholder message for when semester ends or no data is available -->
      <div v-if="!hasScheduleData || isSemesterEnded" class="schedule-placeholder">
        <div class="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#dd3859" stroke-width="2"/>
            <path d="M16 2V6" stroke="#dd3859" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="#dd3859" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="#dd3859" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 class="placeholder-title">Weekly Schedule</h3>
        <p class="placeholder-text">The weekly class schedule will be available once the scheduling team provides the data.</p>
        <p class="placeholder-info">This schedule will show all regular classes to help you avoid booking conflicts.</p>
      </div>
      
      <!-- Actual schedule display when data is available -->
      <div v-else class="weekly-schedule-display">
        <!-- Filter controls -->
        <div class="schedule-filters">
          <div class="filter-group">
            <label for="section-filter">Section:</label>
            <select id="section-filter" v-model="weeklyScheduleFilter.section">
              <option value="all">All Sections</option>
              <option v-for="section in availableSections" :key="section" :value="section">{{ section }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label for="lab-filter">Laboratory:</label>
            <select id="lab-filter" v-model="weeklyScheduleFilter.lab">
              <option value="all">All Labs</option>
              <option value="L201">L201</option>
              <option value="L202">L202</option>
              <option value="L203">L203</option>
              <option value="L204">L204</option>
              <option value="L205">L205</option>
              <option value="IOT">IoT Lab</option>
              <option value="Open Lab">Open Lab</option>
            </select>
          </div>
        </div>
        
        <!-- Weekly schedule table -->
        <div class="weekly-schedule-table-container">
          <table class="weekly-schedule-table">
            <thead>
              <tr>
                <th class="time-column">Time</th>
                <th v-for="day in weekDays.slice(1, 7)" :key="day">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Display schedule data provided by scheduling team -->
              <template v-for="timeSlot in getTimeSlots()" :key="timeSlot">
                <tr :class="{ 'lunch-row': isLunchTime(timeSlot) }">
                  <td class="time-cell">{{ timeSlot }}</td>
                  <template v-for="day in weekDays.slice(1, 7)" :key="`${timeSlot}-${day}`">
                    <td :class="{ 
                          'has-class': hasScheduleForTimeAndDay(timeSlot, day),
                          'merged-cell': isPartOfMergedCell(timeSlot, day) && !isStartOfMergedCell(timeSlot, day)
                        }"
                        v-if="!isPartOfMergedCell(timeSlot, day) || isStartOfMergedCell(timeSlot, day)"
                        :rowspan="getMergedCellRowspan(timeSlot, day)">
                      <div v-for="schedule in getScheduleForTimeAndDay(timeSlot, day)" :key="schedule.id" class="class-info">
                        <div class="class-code">{{ schedule.class }}</div>
                        <div class="class-section">{{ schedule.section }}</div>
                        <div class="class-instructor">{{ schedule.instructor }}</div>
                        <div class="class-room">{{ schedule.room }}</div>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="modal-footer">
        <button class="close-btn" @click="toggleWeeklyScheduleModal">Close</button>
      </div>
    </template>
  </Modal>
  
  <!-- Success Modal -->
  <Modal 
    :show="showSuccessModal" 
    title="Booking Successful" 
    :show-footer="false"
    :close-on-overlay-click="false"
    @close="closeModal"
  >
    <div class="profile-edit-options">
      <div class="success-confirmation">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-icon">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="checkmark" d="M22 4L12 14.01L9 11.01" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>Your booking has been submitted successfully!</h3>
      </div>
      
      <button class="option-button view-bookings" @click="closeModal">
        <div class="option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="option-content">
          <h3>Return to Login</h3>
          <p>Go back to the login page</p>
        </div>
      </button>
      
      <button class="option-button new-booking" @click="resetForm">
        <div class="option-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="option-content">
          <h3>Create New Booking</h3>
          <p>Make another laboratory booking</p>
        </div>
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/ui/Modal.vue';
import { 
  ArrowLeftIcon, 
  BuildingOfficeIcon, 
  UserIcon, 
  UserGroupIcon, 
  PhoneIcon, 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ComputerDesktopIcon
} from '@heroicons/vue/24/outline';

export default {
  name: 'BookingForm',
  components: {
    Modal,
    ArrowLeftIcon, 
    BuildingOfficeIcon, 
    UserIcon, 
    UserGroupIcon, 
    PhoneIcon, 
    CalendarIcon, 
    ClockIcon, 
    DocumentTextIcon, 
    ComputerDesktopIcon
  },
  data() {
    return {
      selectedSectionFilter: 'all',
      selectedLabFilter: 'all', // Default to showing all labs
      selectedTimeBlock: null,
      selectedDay: null,
      // Weekly schedule filter
      weeklyScheduleFilter: {
        section: 'all',
        lab: 'all'
      },
      // Flag to indicate if schedule data is available
      hasScheduleData: true,
      // Available sections for filtering
      availableSections: ['BSIT-3A', 'BSIT-3B', 'BSCS-3'],
      // Schedule data that will be provided by the scheduling team
      scheduleData: [
        // Default schedule data starting at 7:30 AM
        {
          id: 1,
          time: '7:30 AM - 9:00 AM',
          startTime: '07:30',
          endTime: '09:00',
          periods: [
            {day: 'Monday', class: 'CC311', section: 'BSIT-3B', instructor: 'BELTRAN,H.', room: 'L201', isClass: true},
            {day: 'Thursday', class: 'CC311', section: 'BSIT-3B', instructor: 'BELTRAN,H.', room: 'L201', isClass: true}
          ]
        },
        {
          id: 2,
          time: '9:00 AM - 10:30 AM',
          startTime: '09:00',
          endTime: '10:30',
          periods: [
            {day: 'Monday', class: 'GECOM 23', section: 'BSIT-3B', instructor: 'TBA', room: 'L202', isClass: true},
            {day: 'Friday', class: 'GECOM 23', section: 'BSIT-3B', instructor: 'TBA', room: 'L202', isClass: true}
          ]
        },
        {
          id: 3,
          time: '10:30 AM - 12:00 PM',
          startTime: '10:30',
          endTime: '12:00',
          periods: [
            {day: 'Tuesday', class: 'ITELECT2', section: 'BSIT-3B', instructor: 'MOLINA,J.', room: 'L205', isClass: true},
            {day: 'Wednesday', class: 'ELEC305', section: 'BSIT-3B', instructor: 'ADLAON,K.M.', room: 'L201', isClass: true},
            {day: 'Friday', class: 'CC314', section: 'BSIT-3B', instructor: 'CLORIMEL,S.R.', room: 'L203', isClass: true}
          ]
        },
        {
          id: 4,
          time: '12:00 PM - 1:00 PM',
          startTime: '12:00',
          endTime: '13:00',
          isLunch: true,
          periods: []
        },
        {
          id: 5,
          time: '1:00 PM - 2:30 PM',
          startTime: '13:00',
          endTime: '14:30',
          periods: [
            {day: 'Monday', class: 'IT311', section: 'BSIT-3B', instructor: 'TBA', room: 'L205', isClass: true}
          ]
        },
        {
          id: 6,
          time: '2:30 PM - 4:00 PM',
          startTime: '14:30',
          endTime: '16:00',
          periods: [
            {day: 'Friday', class: 'CC312', section: 'BSIT-3B', instructor: 'TBA', room: 'L201', isClass: true}
          ]
        },
        {
          id: 7,
          time: '4:00 PM - 5:30 PM',
          startTime: '16:00',
          endTime: '17:30',
          periods: [
            {day: 'Thursday', class: 'CC313', section: 'BSIT-3B', instructor: 'MANERO,C.J.D.', room: 'L204', isClass: true}
          ]
        }
      ],
      // Define current semester date range based on actual academic calendar
      currentSemesterStart: '2024-12-10', // First day of current semester (Dec 10, 2024)
      currentSemesterEnd: '2025-04-25',   // Last day of current semester (Apr 24, 2025)
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
      showWeeklyScheduleModal: false,
      selectedRoom: '',
      selectedTimeSlot: '',
      currentDate: new Date(),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      // Time slots based on the actual schedule from the photos
      timeSlots: [
        { time: '7:30 AM - 9:00 AM', value: '07:30', duration: 90, isLunch: false },
        { time: '8:00 AM - 8:30 AM', value: '08:00', duration: 30, isLunch: false },
        { time: '8:30 AM - 9:00 AM', value: '08:30', duration: 30, isLunch: false },
        { time: '9:00 AM - 9:30 AM', value: '09:00', duration: 30, isLunch: false },
        { time: '9:30 AM - 10:00 AM', value: '09:30', duration: 30, isLunch: false },
        { time: '10:00 AM - 10:30 AM', value: '10:00', duration: 30, isLunch: false },
        { time: '10:30 AM - 11:00 AM', value: '10:30', duration: 30, isLunch: false },
        { time: '11:00 AM - 11:30 AM', value: '11:00', duration: 30, isLunch: false },
        { time: '11:30 AM - 12:00 PM', value: '11:30', duration: 30, isLunch: false },
        { time: '12:00 PM - 12:30 PM', value: '12:00', duration: 30, isLunch: true },
        { time: '12:30 PM - 1:00 PM', value: '12:30', duration: 30, isLunch: true },
        { time: '1:00 PM - 1:30 PM', value: '13:00', duration: 30, isLunch: false },
        { time: '1:30 PM - 2:00 PM', value: '13:30', duration: 30, isLunch: false },
        { time: '2:00 PM - 2:30 PM', value: '14:00', duration: 30, isLunch: false },
        { time: '2:30 PM - 3:00 PM', value: '14:30', duration: 30, isLunch: false },
        { time: '3:00 PM - 3:30 PM', value: '15:00', duration: 30, isLunch: false },
        { time: '3:30 PM - 4:00 PM', value: '15:30', duration: 30, isLunch: false },
        { time: '4:00 PM - 4:30 PM', value: '16:00', duration: 30, isLunch: false },
        { time: '4:30 PM - 5:00 PM', value: '16:30', duration: 30, isLunch: false },
        { time: '5:00 PM - 5:30 PM', value: '17:00', duration: 30, isLunch: false },
        { time: '5:30 PM - 6:00 PM', value: '17:30', duration: 30, isLunch: false },
        { time: '6:00 PM - 6:30 PM', value: '18:00', duration: 30, isLunch: false },
        { time: '6:30 PM - 7:00 PM', value: '18:30', duration: 30, isLunch: false },
      ],
      // Weekly time blocks for the schedule display - completely flexible structure
      // This can accommodate any time slot combination from the scheduling team
      weeklyTimeBlocks: [
        // Morning classes - can have any time range
        { 
          id: 1, 
          time: '07:30 - 09:00', 
          startTime: '07:30',
          endTime: '09:00',
          periods: [
            {day: 'Monday', class: 'CC311', section: 'BSIT-3A/BSCS-3', instructor: 'CASQUEJO,M.N.', room: '305', isClass: true},
            {day: 'Monday', class: 'CC311', section: 'BSIT-3B', instructor: 'BELTRAN,H.', room: '307', isClass: true},
            {day: 'Thursday', class: 'CC311', section: 'BSIT-3A/BSCS-3', instructor: 'CASQUEJO,M.N.', room: '305', isClass: true},
            {day: 'Thursday', class: 'CC311', section: 'BSIT-3B', instructor: 'BELTRAN,H.', room: '307', isClass: true}
          ]
        },
        
        // Multiple classes at the same time slot
        { 
          id: 2, 
          time: '09:00 - 10:30', 
          startTime: '09:00',
          endTime: '10:30',
          periods: [
            {day: 'Monday', class: 'GECOM 23', section: 'BSIT-3A/BSCS-3', instructor: 'AGUISANDO, M.', room: '303 ICB', isClass: true},
            {day: 'Monday', class: 'GECOM 23', section: 'BSIT-3B', instructor: 'TBA', room: '303 ICB', isClass: true},
            {day: 'Friday', class: 'GECOM 23', section: 'BSIT-3A/BSCS-3', instructor: 'AGUISANDO, M.', room: '303 ICB', isClass: true},
            {day: 'Friday', class: 'GECOM 23', section: 'BSIT-3B', instructor: 'TBA', room: '303 ICB', isClass: true}
          ]
        },
        
        // Longer time block (9:00 - 12:00)
        { 
          id: 3, 
          time: '09:00 - 12:00', 
          startTime: '09:00',
          endTime: '12:00',
          periods: [
            {day: 'Tuesday', class: 'CC312', section: 'BSIT-3A/BSCS-3', instructor: 'MINERO,C.J.D.', room: 'L201', isClass: true},
            {day: 'Tuesday', class: 'ITELECT2', section: 'BSIT-3B', instructor: 'MOLINA,J.', room: 'L205', isClass: true},
            {day: 'Wednesday', class: 'CC314', section: 'BSIT-3A/BSCS-3', instructor: 'CLORIMEL,S.R.', room: 'L204', isClass: true},
            {day: 'Wednesday', class: 'ELEC305', section: 'BSIT-3B', instructor: 'ADLAON,K.M.', room: 'L201', isClass: true},
            {day: 'Friday', class: 'CC313', section: 'BSIT-3B', instructor: 'BOLO,M.', room: 'L204', isClass: true},
            {day: 'Friday', class: 'CC314', section: 'BSIT-3B', instructor: 'CLORIMEL,S.R.', room: 'L203', isClass: true}
          ]
        },
        
        // Lunch period
        { 
          id: 4, 
          time: '12:00 - 13:00', 
          startTime: '12:00',
          endTime: '13:00',
          isLunch: true, 
          periods: [] 
        },
        
        // Afternoon classes
        { 
          id: 5, 
          time: '13:00 - 14:00', 
          startTime: '13:00',
          endTime: '14:00',
          periods: [
            {day: 'Monday', class: 'IT311', section: 'BSIT-3B', instructor: 'TBA', room: 'L205', isClass: true}
          ]
        },
        
        // Example of a class that spans 1-4 PM (longer afternoon class)
        { 
          id: 6, 
          time: '13:00 - 16:00', 
          startTime: '13:00',
          endTime: '16:00',
          periods: [
            {day: 'Wednesday', class: 'ELECTIVE', section: 'BSIT-3A', instructor: 'GUEST', room: 'L202', isClass: true}
          ]
        },
        
        // Another afternoon class
        { 
          id: 7, 
          time: '13:00 - 14:00', 
          startTime: '13:00',
          endTime: '14:00',
          periods: [
            {day: 'Friday', class: 'SEMINAR', section: 'BSCS-3', instructor: 'FACULTY', room: 'L205', isClass: true}
          ]
        },
        
        { id: 8, time: '14:00 - 15:30', periods: [
          {day: 'Monday', class: 'CC312', section: 'BSIT-3A/BSCS-3', instructor: 'TBA', room: 'L203', isClass: true},
          {day: 'Tuesday', class: 'CSELECT1', section: 'BSCS-3', instructor: 'MOLINA,J.', room: 'IOT', isClass: true},
          {day: 'Tuesday', class: 'ITELECT2', section: 'BSIT-3A', instructor: 'SERAFICA,S.', room: 'IOT', isClass: true},
          {day: 'Thursday', class: 'ELEC305', section: 'BSIT-3A/BSCS-3', instructor: 'ADLAON,K.M.', room: 'L203', isClass: true},
          {day: 'Friday', class: 'CC312', section: 'BSIT-3B', instructor: 'TBA', room: 'L201', isClass: true},
          {day: 'Friday', class: 'CSELECT2', section: 'BSCS-3', instructor: 'TBA', room: 'IOT', isClass: true},
          {day: 'Friday', class: 'ITELECT1', section: 'BSIT-3A', instructor: 'SERAFICA,S.', room: 'IOT', isClass: true}
        ] },
        { id: 9, time: '04:00 - 05:30', periods: [
          {day: 'Monday', class: 'IT311', section: 'BSIT-3B', instructor: 'TBA', room: 'L201', isClass: true},
          {day: 'Tuesday', class: 'IT311', section: 'BSIT-3A', instructor: 'TBA', room: 'IOT', isClass: true},
          {day: 'Thursday', class: 'CC313', section: 'BSIT-3B', instructor: 'MANERO,C.J.D.', room: 'L204', isClass: true},
          {day: 'Thursday', class: 'IT311', section: 'BSIT-3A', instructor: 'TBA', room: 'L202', isClass: true}
        ] },
        { id: 10, time: '05:30 - 07:00', periods: [] },
      ],
      availableRooms: [
        {
          id: 'L201',
          name: 'L201',
          availableDates: [
            '2025-04-16', '2025-04-17', '2025-04-18', '2025-04-19', '2025-04-22', '2025-04-23', '2025-04-24', '2025-04-25', '2025-04-26', '2025-04-29', '2025-04-30',
            '2025-05-02', '2025-05-03', '2025-05-06', '2025-05-07', '2025-05-10', '2025-05-13', '2025-05-14', '2025-05-17', '2025-05-20', '2025-05-21', '2025-05-24', '2025-05-27', '2025-05-28', '2025-05-31',
            '2025-06-03', '2025-06-04', '2025-06-07', '2025-06-10', '2025-06-11', '2025-06-14', '2025-06-17', '2025-06-18', '2025-06-21', '2025-06-24', '2025-06-25', '2025-06-28'
          ]
        },
        {
          id: 'L202',
          name: 'L202',
          availableDates: [
            '2025-04-16', '2025-04-17', '2025-04-18', '2025-04-20', '2025-04-22', '2025-04-24', '2025-04-25', '2025-04-27', '2025-04-29',
            '2025-05-01', '2025-05-04', '2025-05-08', '2025-05-11', '2025-05-15', '2025-05-18', '2025-05-22', '2025-05-25', '2025-05-29',
            '2025-06-01', '2025-06-05', '2025-06-08', '2025-06-12', '2025-06-15', '2025-06-19', '2025-06-22', '2025-06-26', '2025-06-29'
          ]
        },
        {
          id: 'L203',
          name: 'L203',
          availableDates: [
            '2025-04-16', '2025-04-18', '2025-04-19', '2025-04-21', '2025-04-23', '2025-04-25', '2025-04-26', '2025-04-28', '2025-04-30',
            '2025-05-02', '2025-05-05', '2025-05-07', '2025-05-09', '2025-05-12', '2025-05-14', '2025-05-16', '2025-05-19', '2025-05-21', '2025-05-23', '2025-05-26', '2025-05-28', '2025-05-30',
            '2025-06-02', '2025-06-04', '2025-06-06', '2025-06-09', '2025-06-11', '2025-06-13', '2025-06-16', '2025-06-18', '2025-06-20', '2025-06-23', '2025-06-25', '2025-06-27', '2025-06-30'
          ]
        },
        {
          id: 'L204',
          name: 'L204',
          availableDates: [
            '2025-04-16', '2025-04-17', '2025-04-19', '2025-04-20', '2025-04-22', '2025-04-24', '2025-04-26', '2025-04-27', '2025-04-29',
            '2025-05-01', '2025-05-03', '2025-05-04', '2025-05-06', '2025-05-08', '2025-05-10', '2025-05-11', '2025-05-13', '2025-05-15', '2025-05-17', '2025-05-18', '2025-05-20', '2025-05-22', '2025-05-24', '2025-05-25', '2025-05-27', '2025-05-29', '2025-05-31',
            '2025-06-01', '2025-06-03', '2025-06-05', '2025-06-07', '2025-06-08', '2025-06-10', '2025-06-12', '2025-06-14', '2025-06-15', '2025-06-17', '2025-06-19', '2025-06-21', '2025-06-22', '2025-06-24', '2025-06-26', '2025-06-28', '2025-06-29'
          ]
        },
        {
          id: 'L205',
          name: 'L205',
          availableDates: [
            '2025-04-16', '2025-04-18', '2025-04-20', '2025-04-21', '2025-04-23', '2025-04-25', '2025-04-27', '2025-04-28', '2025-04-30',
            '2025-05-02', '2025-05-04', '2025-05-05', '2025-05-07', '2025-05-09', '2025-05-11', '2025-05-12', '2025-05-14', '2025-05-16', '2025-05-18', '2025-05-19', '2025-05-21', '2025-05-23', '2025-05-25', '2025-05-26', '2025-05-28', '2025-05-30',
            '2025-06-01', '2025-06-02', '2025-06-04', '2025-06-06', '2025-06-08', '2025-06-09', '2025-06-11', '2025-06-13', '2025-06-15', '2025-06-16', '2025-06-18', '2025-06-20', '2025-06-22', '2025-06-23', '2025-06-25', '2025-06-27', '2025-06-29', '2025-06-30'
          ]
        },
        {
          id: 'openlab',
          name: 'Open Laboratory',
          availableDates: [
            '2025-04-16', '2025-04-17', '2025-04-19', '2025-04-21', '2025-04-22', '2025-04-24', '2025-04-26', '2025-04-28', '2025-04-29',
            '2025-05-01', '2025-05-03', '2025-05-05', '2025-05-06', '2025-05-08', '2025-05-10', '2025-05-12', '2025-05-13', '2025-05-15', '2025-05-17', '2025-05-19', '2025-05-20', '2025-05-22', '2025-05-24', '2025-05-26', '2025-05-27', '2025-05-29', '2025-05-31',
            '2025-06-02', '2025-06-03', '2025-06-05', '2025-06-07', '2025-06-09', '2025-06-10', '2025-06-12', '2025-06-14', '2025-06-16', '2025-06-17', '2025-06-19', '2025-06-21', '2025-06-23', '2025-06-24', '2025-06-26', '2025-06-28', '2025-06-30'
          ]
        },
        {
          id: 'iotlab',
          name: 'IoT Laboratory',
          availableDates: [
            '2025-04-16', '2025-04-18', '2025-04-20', '2025-04-22', '2025-04-23', '2025-04-25', '2025-04-27', '2025-04-29', '2025-04-30',
            '2025-05-02', '2025-05-04', '2025-05-06', '2025-05-07', '2025-05-09', '2025-05-11', '2025-05-13', '2025-05-14', '2025-05-16', '2025-05-18', '2025-05-20', '2025-05-21', '2025-05-23', '2025-05-25', '2025-05-27', '2025-05-28', '2025-05-30',
            '2025-06-01', '2025-06-03', '2025-06-04', '2025-06-06', '2025-06-08', '2025-06-10', '2025-06-11', '2025-06-13', '2025-06-15', '2025-06-17', '2025-06-18', '2025-06-20', '2025-06-22', '2025-06-24', '2025-06-25', '2025-06-27', '2025-06-29'
          ]
        }
      ],
      filteredRooms: [],
      calendarDays: []
    }
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentDate).toLocaleString('default', { month: 'long' });
    },
    currentYear() {
      return new Date(this.currentDate).getFullYear();
    },
    filteredTimeSlots() {
      return this.timeSlots.filter(slot => !slot.isLunch);
    },
    filteredTimeBlocks() {
      if (!this.selectedDayOfWeek) {
        return this.weeklyTimeBlocks;
      }
      
      return this.weeklyTimeBlocks.filter(block => {
        return block.periods.some(period => period.day === this.selectedDayOfWeek);
      });
    },
    // Check if the current semester has ended
    isSemesterEnded() {
      const today = new Date().toISOString().substr(0, 10);
      return today > this.currentSemesterEnd;
    },
    // Get consolidated time slots for the weekly schedule
    consolidatedTimeSlots() {
      // Create an array of all unique time ranges from weeklyTimeBlocks
      const timeSlots = [];
      
      // Extract all time slots from weeklyTimeBlocks
      this.weeklyTimeBlocks.forEach(block => {
        // Skip if we already have this time slot
        if (timeSlots.some(slot => slot.time === block.time)) {
          return;
        }
        
        timeSlots.push({
          time: block.time,
          startTime: block.startTime || block.time.split(' - ')[0],
          endTime: block.endTime || block.time.split(' - ')[1],
          isLunch: block.isLunch || false
        });
      });
      
      // Sort time slots by start time
      return timeSlots.sort((a, b) => {
        const aTime = a.startTime.replace(':', '');
        const bTime = b.startTime.replace(':', '');
        return parseInt(aTime) - parseInt(bTime);
      });
    }
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    // Methods for weekly schedule display
    getTimeSlots() {
      // Extract unique time slots from the schedule data
      const timeSlots = [];
      
      // Use scheduleData instead of weeklyTimeBlocks
      this.scheduleData.forEach(block => {
        if (!timeSlots.includes(block.time)) {
          timeSlots.push(block.time);
        }
      });
      
      // Sort time slots by start time
      return timeSlots.sort((a, b) => {
        const aStart = a.split(' - ')[0].trim();
        const bStart = b.split(' - ')[0].trim();
        return this.compareTimeStrings(aStart, bStart);
      });
    },
    
    compareTimeStrings(a, b) {
      // Convert time strings to comparable values
      // Handle AM/PM format
      const aIsPM = a.toLowerCase().includes('pm');
      const bIsPM = b.toLowerCase().includes('pm');
      
      // Extract hours and minutes
      let aTimeParts = a.replace(/\s*(am|pm)\s*/i, '').split(':');
      let bTimeParts = b.replace(/\s*(am|pm)\s*/i, '').split(':');
      
      let aHours = parseInt(aTimeParts[0]);
      let aMinutes = parseInt(aTimeParts[1] || 0);
      let bHours = parseInt(bTimeParts[0]);
      let bMinutes = parseInt(bTimeParts[1] || 0);
      
      // Convert to 24-hour format for comparison
      if (aIsPM && aHours < 12) aHours += 12;
      if (bIsPM && bHours < 12) bHours += 12;
      
      // Special case for 12 AM (midnight)
      if (!aIsPM && aHours === 12) aHours = 0;
      if (!bIsPM && bHours === 12) bHours = 0;
      
      if (aHours !== bHours) {
        return aHours - bHours;
      }
      return aMinutes - bMinutes;
    },
    
    hasScheduleForTimeAndDay(timeSlot, day) {
      // Check if there's a schedule for the given time slot and day
      return this.scheduleData.some(block => {
        if (block.time !== timeSlot) return false;
        
        return block.periods.some(period => {
          if (period.day !== day) return false;
          
          // Apply section filter if not set to 'all'
          if (this.weeklyScheduleFilter.section !== 'all' && 
              !period.section.includes(this.weeklyScheduleFilter.section)) {
            return false;
          }
          
          // Apply lab filter if not set to 'all'
          if (this.weeklyScheduleFilter.lab !== 'all' && 
              period.room !== this.weeklyScheduleFilter.lab) {
            return false;
          }
          
          return true;
        });
      });
    },
    
    getScheduleForTimeAndDay(timeSlot, day) {
      // Get all schedules for the given time slot and day
      const schedules = [];
      
      this.scheduleData.forEach(block => {
        if (block.time !== timeSlot) return;
        
        block.periods.forEach(period => {
          if (period.day !== day) return;
          
          // Apply section filter if not set to 'all'
          if (this.weeklyScheduleFilter.section !== 'all' && 
              !period.section.includes(this.weeklyScheduleFilter.section)) {
            return;
          }
          
          // Apply lab filter if not set to 'all'
          if (this.weeklyScheduleFilter.lab !== 'all' && 
              period.room !== this.weeklyScheduleFilter.lab) {
            return;
          }
          
          schedules.push(period);
        });
      });
      
      return schedules;
    },
    
    // Methods for handling merged cells
    isPartOfMergedCell(timeSlot, day) {
      // Check if this cell is part of a merged cell (spanning multiple time slots)
      // For now, we'll use the existing data structure to determine this
      const timeSlots = this.getTimeSlots();
      const timeIndex = timeSlots.indexOf(timeSlot);
      
      if (timeIndex <= 0) return false;
      
      // Check if there's a class that spans multiple time slots
      for (let i = 0; i < timeIndex; i++) {
        const previousTimeSlot = timeSlots[i];
        const previousSchedules = this.getScheduleForTimeAndDay(previousTimeSlot, day);
        
        for (const schedule of previousSchedules) {
          // If a previous schedule spans to this time slot, this cell is part of a merged cell
          if (this.doesScheduleSpanToTimeSlot(schedule, previousTimeSlot, timeSlot)) {
            return true;
          }
        }
      }
      
      return false;
    },
    
    isStartOfMergedCell(timeSlot, day) {
      // Check if this cell is the start of a merged cell
      const schedules = this.getScheduleForTimeAndDay(timeSlot, day);
      const nextTimeSlot = this.getNextTimeSlot(timeSlot);
      
      if (!nextTimeSlot) return false;
      
      for (const schedule of schedules) {
        if (this.doesScheduleSpanToTimeSlot(schedule, timeSlot, nextTimeSlot)) {
          return true;
        }
      }
      
      return false;
    },
    
    getMergedCellRowspan(timeSlot, day) {
      // Get the rowspan for a merged cell
      if (!this.isStartOfMergedCell(timeSlot, day)) return 1;
      
      const schedules = this.getScheduleForTimeAndDay(timeSlot, day);
      const timeSlots = this.getTimeSlots();
      const startIndex = timeSlots.indexOf(timeSlot);
      let maxSpan = 1;
      
      for (const schedule of schedules) {
        let span = 1;
        for (let i = startIndex + 1; i < timeSlots.length; i++) {
          const nextTimeSlot = timeSlots[i];
          if (this.doesScheduleSpanToTimeSlot(schedule, timeSlot, nextTimeSlot)) {
            span++;
          } else {
            break;
          }
        }
        maxSpan = Math.max(maxSpan, span);
      }
      
      return maxSpan;
    },
    
    getNextTimeSlot(timeSlot) {
      // Get the next time slot in the list
      const timeSlots = this.getTimeSlots();
      const index = timeSlots.indexOf(timeSlot);
      
      if (index < 0 || index >= timeSlots.length - 1) return null;
      
      return timeSlots[index + 1];
    },
    
    doesScheduleSpanToTimeSlot(schedule, fromTimeSlot, toTimeSlot) {
      // Check if a schedule spans from one time slot to another
      // This is a placeholder implementation that can be updated with actual logic
      // based on how the scheduling team provides the data
      
      // For now, we'll use a simple heuristic based on the class duration
      // Check if the schedule data exists for both time slots
      const fromSchedules = this.scheduleData.find(block => block.time === fromTimeSlot);
      const toSchedules = this.scheduleData.find(block => block.time === toTimeSlot);
      
      if (!fromSchedules || !toSchedules) return false;
      
      // Check if there's a class that spans these time slots
      // This is just a placeholder logic - you'll need to update it based on your actual data structure
      return false; // For now, return false to avoid errors
    },
    
    // Original methods
    hasClassOnDay(block, day) {
      if (this.selectedLabFilter === 'all') {
        return block.periods.some(period => period.day === day && period.isClass);
      } else {
        return block.periods.some(period => 
          period.day === day && 
          period.isClass && 
          period.room === this.selectedLabFilter
        );
      }
    },
    
    isFilteredOut(block, day) {
      if (this.selectedLabFilter === 'all') return false;
      
      const classForDay = this.getClassForDayAndTime(block, day);
      return classForDay && classForDay.room !== this.selectedLabFilter;
    },
    
    isLabRoom(room) {
      const labRooms = ['L201', 'L202', 'L203', 'L204', 'L205', 'IOT', 'Open Laboratory'];
      return labRooms.includes(room);
    },
    
    // Check if a time block is a lunch period
    isLunchTime(timeRange) {
      if (!timeRange) return false;
      
      // Check if this is a designated lunch period
      return timeRange.toLowerCase().includes('lunch') || 
             (timeRange.toLowerCase().includes('12:00 pm') && timeRange.toLowerCase().includes('1:00 pm'));
    },
    
    // Get all classes for a specific day and time block
    getClassesForDayAndTime(block, day) {
      if (!block.periods) return [];
      return block.periods.filter(period => period.day === day && period.isClass);
    },
    
    getClassForDayAndTime(block, day) {
      if (!block.periods) return null;
      return block.periods.find(period => period.day === day && period.isClass);
    },
    
    isTimeBlockSelected(block, day) {
      return this.selectedTimeBlock === block.time && this.selectedDay === day;
    },
    
    selectTimeBlock(block, day) {
      // Don't select lunch time blocks
      if (this.isLunchTime(block.time)) return;
      
      // Don't select blocks that already have a class
      if (this.hasClassOnDay(block, day)) return;
      
      this.selectedTimeBlock = block.time;
      this.selectedDay = day;
      
      // Extract start and end times from the block time range
      const [startTime, endTime] = block.time.split(' - ');
      this.startTime = startTime;
      this.endTime = endTime;
      
      // Find the corresponding room based on the day
      const roomMapping = {
        'Monday': 'L201',
        'Tuesday': 'L202',
        'Wednesday': 'L203',
        'Thursday': 'L204',
        'Friday': 'L205',
        'Saturday': 'openlab'
      };
      
      // Set the selected room and ensure it's reflected in the dropdown
      this.selectedRoom = roomMapping[day] || '';
    },
    
    selectDate(day) {
      // Check if the date is in the past
      if (day.isPastDate) {
        this.errorMessage = 'Cannot book past dates';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        return;
      }
      
      if (day.date && day.available) {
        this.requestDate = day.date;
        this.selectedTimeSlot = '';
        
        // Get the day of the week from the selected date
        const date = new Date(day.date);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.selectedDayOfWeek = daysOfWeek[date.getDay()];
        
        // Check room availability for the selected date
        this.updateRoomAvailability();
      }
    },
    
    // Format date for display (YYYY-MM-DD to Month DD, YYYY)
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    },
    
    // Format time from 24-hour to 12-hour format
    formatTime(time24) {
      if (!time24) return '';
      
      // If already in 12-hour format, return as is
      if (time24.includes('AM') || time24.includes('PM')) {
        return time24;
      }
      
      const [hours, minutes] = time24.split(':');
      const hoursNum = parseInt(hours);
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const hours12 = hoursNum % 12 || 12;
      
      return `${hours12}:${minutes} ${period}`;
    },
    
    // Check room availability for the selected date
    updateRoomAvailability() {
      if (!this.requestDate) return;
      
      // Update available rooms based on the selected date
      this.availableRooms.forEach(room => {
        room.isAvailable = room.availableDates.includes(this.requestDate);
      });
      
      // Filter time slots based on the selected date and day of week
      this.filteredTimeSlots = this.weeklyTimeBlocks.filter(block => {
        // Check if the time slot is available for the selected day
        return !this.hasClassOnDay(block, this.selectedDayOfWeek) || 
               (this.selectedLabFilter !== 'all' && !this.isFilteredOut(block, this.selectedDayOfWeek));
      });
    },
    
    // Toggle between showing all days or just the selected day
    toggleDayView() {
      if (this.selectedDayOfWeek) {
        this.selectedDayOfWeek = null; // Show all days
      } else if (this.requestDate) {
        // Get the day of the week from the selected date
        const date = new Date(this.requestDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.selectedDayOfWeek = daysOfWeek[date.getDay()];
      }
      // Update the filtered time slots after toggling view
      this.updateRoomAvailability();
    },
    
    // Filter labs by room
    selectLabFilter(lab) {
      this.selectedLabFilter = lab;
    },
    
    // Select section filter for the weekly schedule
    selectSectionFilter(section) {
      this.selectedSectionFilter = section;
    },
    
    // Toggle the weekly schedule modal
    toggleWeeklyScheduleModal() {
      this.showWeeklyScheduleModal = !this.showWeeklyScheduleModal;
    },
    // ... methods ...
    generateCalendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      // Get first day of month and total days in month
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const today = new Date();
      // Format today's date consistently to avoid timezone issues
      const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      // Generate calendar days array
      this.calendarDays = [];
      
      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        this.calendarDays.push({ date: null });
      }
      
      // Add actual days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        // Format date manually to avoid timezone issues
        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // Check if date is within the current semester period
        const isWithinSemester = formattedDate >= this.currentSemesterStart && formattedDate <= this.currentSemesterEnd;
        
        // Check if date is in the past
        const isPastDate = formattedDate < formattedToday;
        
        // Check if any room is available on this date
        const isAvailable = isWithinSemester && !isPastDate && this.availableRooms.some(room => 
          room.availableDates.includes(formattedDate)
        );
        
        // Determine if this date is after the semester end
        const isAfterSemester = formattedDate > this.currentSemesterEnd;
        
        this.calendarDays.push({
          date: formattedDate,
          dayNumber: i,
          isToday: formattedDate === formattedToday,
          available: isAvailable,
          isAfterSemester: isAfterSemester,
          isPastDate: isPastDate
        });
      }
      
      // Fill remaining cells to complete the grid (6 rows x 7 columns)
      const totalCells = 42; // 6 rows x 7 columns
      const remainingCells = totalCells - this.calendarDays.length;
      
      for (let i = 0; i < remainingCells; i++) {
        this.calendarDays.push({ date: null });
      }
    },
    // ... methods ...
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

/* Remove spinner buttons from number inputs for all browsers */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Custom class to remove any spinner buttons */
.no-spinner {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;
  /* Ensure no buttons are displayed */
  background-image: none !important;
  background-color: white !important;
  border-radius: 8px !important;
  padding-right: 40px !important;
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
  padding: 2rem;
}

/* Layout */
.booking-layout {
  width: 100%;
  max-width: 1400px;
  display: flex;
  gap: 1.5rem;
}

.booking-form-wrapper {
  flex: 1;
  max-width: 50%;
  padding: 1.5rem;
  border-right: 1px solid #eee;
}

.schedule-wrapper {
  flex: 1;
  max-width: 50%;
  padding: 1.5rem;
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
  padding: 1.5rem;
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
  gap: 1.5rem;
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

/* Success Modal Styles */
/* Profile Edit Options Styles - For Success Modal */
.profile-edit-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.success-confirmation {
  text-align: center;
  margin-bottom: 1rem;
}

.success-confirmation h3 {
  margin-top: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.option-button {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid #eee;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-button.view-bookings {
  color: #DD3859;
}

.option-button.view-bookings:hover {
  border-color: #DD3859;
}

.option-button.new-booking {
  color: #22c55e;
}

.option-button.new-booking:hover {
  border-color: #22c55e;
}

.option-icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  margin: 0 0 0.25rem 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}

.option-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
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

/* Responsive Design */
@media (max-width: 1200px) {
  .booking-layout {
    flex-direction: column;
  }
  
  .booking-form-wrapper,
  .schedule-wrapper {
    max-width: 100%;
  }
  
  .booking-form-wrapper {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .booking-container {
    padding: 1rem;
  }
  
  .booking-form-wrapper,
  .schedule-wrapper {
    padding: 1rem;
  }
  
  .booking-form {
    padding: 1.5rem;
  }
  
  .form-header h1 {
    font-size: 1.5rem;
  }
  
  .calendar-cell {
    height: 40px;
  }
  
  .schedule-legend {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .time-slot-schedule {
    margin-top: 1.5rem;
  }
  
  .room-header,
  .room-slot {
    flex: 0 0 3rem;
  }
  
  .time-label {
    width: 3.5rem;
    font-size: 0.7rem;
  }
  
  .legend-badge {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
  
  .time-row {
    height: 2.5rem;
  }
  
  .room-slot {
    height: 2rem;
  }
}

/* Schedule View Styles */
.schedule-header {
  margin-bottom: 1.5rem;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(221, 56, 89, 0.1);
}

.schedule-header h2 {
  color: #dd3859;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Time Slot Schedule Styles */
.time-slot-schedule {
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  background-color: white;
  border: 1px solid #f0f0f0;
}

.schedule-section-header {
  padding: 1.25rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
}

.schedule-section-header h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #dd3859;
  font-weight: 600;
  text-align: center;
}

.schedule-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.5rem;
}

.legend-badge {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.legend-badge.available {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.legend-badge.occupied {
  background-color: #ffebee;
  color: #d32f2f;
}

.legend-badge.lunch {
  background-color: #f5f5f5;
  color: #616161;
}

.lab-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.lab-btn {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #666;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lab-btn.active {
  background-color: #dd3859;
  color: white;
  border-color: #dd3859;
}

.lab-btn:hover {
  background-color: #f1f1f1;
  border-color: #ccc;
}

.lab-btn.active:hover {
  background-color: #c62c4c;
}

.schedule-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.view-weekly-btn {
  background-color: white;
  border: 1px solid #dd3859;
  color: #dd3859;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-weekly-btn:hover {
  background-color: rgba(221, 56, 89, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.view-weekly-btn svg {
  margin-right: 0.5rem;
}

.view-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Weekly Schedule Table Styles */
.weekly-schedule {
  padding: 1rem;
  overflow-x: auto;
}

.weekly-schedule-modal {
  width: 100%;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.table-container {
  width: 100%;
  overflow: visible;
  max-height: 70vh;
}

.schedule-table.full-week {
  width: 100%;
  table-layout: fixed;
  font-size: 0.8rem;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #e0e0e0;
  padding: 0;
  vertical-align: top;
  position: relative;
}

.schedule-table th {
  background-color: #f8f9fa;
  color: #444;
  font-weight: 600;
  padding: 0.75rem 0.5rem;
  text-align: center;
}

.time-header {
  width: 80px;
  text-align: center;
}

.time-cell {
  background-color: #f8f9fa;
  color: #555;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 0.25rem;
  height: 60px;
}

.day-cell {
  height: 60px;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: white;
  width: 14.28%;
}

.day-cell:hover:not(.has-class):not(.lunch-time) {
  background-color: rgba(46, 125, 50, 0.05);
}

.day-cell.has-class {
  background-color: #dd3859;
  color: white;
  cursor: default;
}

.day-cell.lunch-time {
  background-color: #f5f5f5;
  cursor: default;
  position: relative;
}

.day-cell.lunch-time::after {
  content: 'LUNCH';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #777;
}

.day-cell.selected {
  background-color: rgba(221, 56, 89, 0.1);
  border: 2px solid #dd3859;
  z-index: 1;
}

.class-info-container {
  padding: 0.25rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
  max-height: 100%;
}

.class-info {
  padding: 0.35rem 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.class-code {
  font-weight: 700;
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.class-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.class-section {
  font-size: 0.75rem;
  font-weight: 500;
}

.class-room {
  font-weight: 600;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

/* Month selector styles */
.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.month-selector span {
  font-weight: 600;
  color: #333;
}

.month-nav {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.month-nav:hover {
  background-color: rgba(221, 56, 89, 0.1);
}

.calendar {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f0f0f0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.header-cell {
  padding: 0.75rem 0;
  text-align: center;
  font-weight: 600;
  color: #555;
  font-size: 0.85rem;
  border-bottom: 1px solid #e0e0e0;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 2px;
  padding: 8px;
  background-color: #f9f9f9;
}

.calendar-cell {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: 1;
  font-size: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  margin: 2px;
  border: 1px solid #f0f0f0;
}

.after-semester, .past-date {
  color: #999;
  cursor: not-allowed;
  position: relative;
}

.past-date {
  text-decoration: line-through;
  opacity: 0.7;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  color: #999;
}

/* Removed warning indicators */

/* Weekly Schedule Modal */
.weekly-modal >>> .modal-container {
  max-width: 98vw !important;
  width: 1200px !important;
  max-height: 90vh;
  overflow: hidden;
  background-color: white;
}

.weekly-modal >>> .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.schedule-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 1rem;
}

.placeholder-icon {
  margin-bottom: 1.5rem;
}

.placeholder-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.placeholder-text {
  font-size: 1rem;
  color: #555;
  max-width: 500px;
  margin-bottom: 0.5rem;
}

.placeholder-info {
  font-size: 0.9rem;
  color: #777;
  max-width: 500px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.close-btn {
  background-color: #dd3859;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #c62b4a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.selector-group {
  margin-bottom: 0.75rem;
}

.selector-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
  padding-left: 0.25rem;
}

.section-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.section-btn {
  padding: 0.4rem 0.75rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-btn:hover {
  background-color: #f0f0f0;
}

.section-btn.active {
  background-color: #dd3859;
  color: white;
  border-color: #dd3859;
}

.schedule-legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  padding: 0.75rem;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  background-color: white;
  border-radius: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.has-class-legend {
  background-color: #dd3859;
}

.lunch-legend {
  background-color: #f5f5f5;
}

.available-legend {
  background-color: white;
  border: 1px solid #e0e0e0;
}

.weekly-schedule-table-container {
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.modal-schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modal-schedule-table th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}



.calendar-cell:hover:not(.empty-cell) {
  background-color: rgba(221, 56, 89, 0.05);
}

.empty-cell {
  background-color: transparent;
  border: none;
  box-shadow: none;
  cursor: default;
}

.day-number {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.current-day {
  background-color: rgba(221, 56, 89, 0.1);
  border: 1px solid rgba(221, 56, 89, 0.3);
}

.current-day .day-number {
  font-weight: 700;
  color: #dd3859;
}

.selected-day {
  background-color: rgba(221, 56, 89, 0.2);
  border: 2px solid #dd3859;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(221, 56, 89, 0.15);
}

.availability-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 2px;
}

.availability-indicator.available {
  background-color: #2e7d32;
}

.availability-indicator.unavailable {
  background-color: #d32f2f;
}

.room-legend {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.room-legend h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.room-legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

.room-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.room-legend-item.available {
  background-color: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.room-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #d32f2f;
}

.room-indicator.available {
  background-color: #2e7d32;
}

/* Heroicons Styles */
.icon-primary {
  width: 20px;
  height: 20px;
  color: #dd3859;
}

.icon-small {
  width: 16px;
  height: 16px;
  color: #dd3859;
}

.rotate-180 {
  transform: rotate(180deg);
}

.success-icon {
  width: 64px;
  height: 64px;
  color: #dd3859;
  margin-bottom: 1rem;
}

/* Status Badge Styles */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.status-badge.cancelled {
  background-color: #64748b;
}
/* Weekly Schedule Modal Styles */
.weekly-schedule-modal-content {
  width: 100%;
  overflow-x: auto;
}

.modal-lab-selector {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

/* Weekly Schedule Styles */
.weekly-schedule-table-container {
  overflow-x: auto;
  max-height: 60vh;
}

.weekly-schedule-display {
  padding: 1rem;
}

.schedule-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-family: 'Poppins', sans-serif;
}

.weekly-schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
}

.weekly-schedule-table th {
  background-color: #f0f0f0;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
}

.weekly-schedule-table .time-column {
  width: 120px;
  background-color: #f0f0f0;
  position: sticky;
  left: 0;
  z-index: 20;
}

.weekly-schedule-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  vertical-align: top;
  height: 60px;
}

.weekly-schedule-table .time-cell {
  background-color: #f9f9f9;
  font-weight: 500;
  text-align: center;
  position: sticky;
  left: 0;
  z-index: 5;
}

.weekly-schedule-table .has-class {
  background-color: #ffecd1;
}

.weekly-schedule-table .lunch-row td {
  background-color: #f0f0f0;
  color: #777;
  font-style: italic;
  text-align: center;
}

.weekly-schedule-table .merged-cell {
  display: none;
}

/* Style for cells that span multiple rows */
.weekly-schedule-table td[rowspan] {
  vertical-align: middle;
  border: 2px solid #ddd;
}

.class-info {
  background-color: #ffd580;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.class-code {
  font-weight: bold;
}

.class-section {
  font-size: 0.75rem;
}

.class-instructor {
  font-size: 0.75rem;
  font-style: italic;
}

.class-room {
  font-weight: 500;
  margin-top: 0.25rem;
}

.modal-schedule-table {
  min-width: 900px;
  width: 100%;
}

@media (max-width: 1200px) {
  .modal-schedule-table {
    min-width: 700px;
  }
}
</style>
