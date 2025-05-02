<template>
  <div class="booking-container">
    <div class="booking-layout">
      <div class="header">
        <router-link to="/" class="back-button">
          <ArrowLeftIcon class="icon-primary" />
        </router-link>
        <h1>Laboratory Booking System</h1>
      </div>

      <!-- Schedule View -->
      <div class="schedule-wrapper">
        <div class="schedule-header">
          <h2>Laboratory Booking</h2>
        </div>
        <div class="schedule-content">
          <!-- Calendar for date selection -->
          <div class="date-selection-section">
            <h3>Select a Date</h3>
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
                <div
                  v-for="day in weekDays"
                  :key="day"
                  class="calendar-cell header-cell"
                >
                  {{ day }}
                </div>
              </div>
              <div class="calendar-body">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="calendar-cell"
                  :class="{
                    'empty-cell': !day.date,
                    'current-day': day.isToday,
                    'selected-day': day.date === requestDate,
                    'available-day': day.available,
                    'before-semester': day.isBeforeSemester,
                    'after-semester': day.isAfterSemester,
                    'past-date': day.isPastDate,
                  }"
                  @click="selectDate(day)"
                  :title="day.semesterMessage || ''"
                >
                  <template v-if="day.date">
                    <span class="day-number">{{ day.dayNumber }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Schedule Display (shown after selecting a date) -->
          <div class="weekly-schedule-section" v-if="requestDate">
            <div class="schedule-section-header">
              <h3>Weekly Schedule for {{ formatDate(requestDate) }}</h3>
              <div class="schedule-actions">
                <button class="book-now-btn" @click="openBookingModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Book Now
                </button>
              </div>
            </div>

            <!-- Weekly Schedule Table (similar to reference image) -->
            <div class="weekly-schedule-table-container">
              <table class="weekly-schedule-table">
                <thead>
                  <tr>
                    <th class="time-column">Time</th>
                    <th v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" :key="day">{{ day }}</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Time slots from 7:30 AM to 7:00 PM -->
                  <tr v-for="timeSlot in timeSlots" :key="timeSlot.value" :class="{'lunch-row': timeSlot.isLunch}">
                    <td class="time-cell">{{ timeSlot.time }}</td>
                    <td 
                      v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" 
                      :key="`${timeSlot.value}-${day}`"
                      :class="{'has-class': getScheduleForTimeSlotAndDay(timeSlot, day).length > 0}"
                    >
                      <div 
                        v-for="schedule in getScheduleForTimeSlotAndDay(timeSlot, day)" 
                        :key="schedule.id"
                        :class="['class-info', { 'pending-booking': schedule.isPending }]"
                      >
                        <div class="class-code">{{ schedule.course_code }}</div>
                        <div class="class-section">{{ schedule.section }}</div>
                        <div v-if="!schedule.isPending" class="class-instructor">{{ schedule.instructor }}</div>
                        <div v-else class="pending-label">PENDING APPROVAL</div>
                        <div class="class-room">{{ schedule.lab_room }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
<!-- Requester Info Modal -->
<div v-if="showRequesterModal" class="direct-modal-overlay">
  <div class="direct-modal-container requester-modal">
    <div class="direct-modal-header">
      <h3>Requester Information</h3>
      <button class="direct-close-button" @click="closeRequesterModal" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="direct-modal-body">
      <form class="requester-form" @submit.prevent="validateRequesterInfo">
        <div class="form-group">
          <label class="requester-type-label">I am a:</label>
          <div class="requester-type-selector">
            <label class="requester-type-option" :class="{ 'selected': requesterType === 'student' }">
              <input type="radio" v-model="requesterType" value="student" class="requester-radio" checked>
              <div class="requester-icon student-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </div>
              <span class="requester-type-text">Student</span>
            </label>
            <label class="requester-type-option" :class="{ 'selected': requesterType === 'instructor' }">
              <input type="radio" v-model="requesterType" value="instructor" class="requester-radio">
              <div class="requester-icon instructor-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                  <path fill-rule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clip-rule="evenodd" />
                  <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                </svg>
              </div>
              <span class="requester-type-text">Instructor</span>
            </label>
          </div>
        </div>
        
        <!-- Student Fields -->
        <div v-if="requesterType === 'student'">
          <div class="form-group">
            <label for="studentName">Full Name</label>
            <div class="input-wrapper">
              <input type="text" id="studentName" v-model="studentName" required />
              <span class="input-icon">
                <UserIcon class="icon-primary" />
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="studentEmail">School Email</label>
            <div class="input-wrapper">
              <input type="email" id="studentEmail" v-model="studentEmail" required 
                placeholder="example@uic.edu.ph" />
              <span class="input-icon">
                <EnvelopeIcon class="icon-primary" />
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="studentDepartment">Department</label>
            <div class="input-wrapper">
              <input type="text" id="studentDepartment" v-model="studentDepartment" required />
              <span class="input-icon">
                <BuildingOfficeIcon class="icon-primary" />
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="studentSection">Section</label>
            <div class="input-wrapper">
              <input type="text" id="studentSection" v-model="studentSection" required />
              <span class="input-icon">
                <UserGroupIcon class="icon-primary" />
              </span>
            </div>
          </div>
        </div>
        
        <!-- Instructor Fields -->
        <div v-if="requesterType === 'instructor'">
          <div class="form-group">
            <label for="instructorName">Full Name</label>
            <div class="input-wrapper">
              <input type="text" id="instructorName" v-model="instructorName" required />
              <span class="input-icon">
                <UserIcon class="icon-primary" />
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="requesterErrorMessage" class="error-message">
          {{ requesterErrorMessage }}
        </div>
      </form>
    </div>
    <div class="direct-modal-footer">
      <button class="submit-btn" @click="validateRequesterInfo">Continue</button>
    </div>
  </div>
</div>

<!-- Direct Booking Form Modal -->
<div v-if="showBookingModal" class="direct-modal-overlay">
  <div class="direct-modal-container">
    <div class="direct-modal-header">
      <h3>Laboratory Booking Form</h3>
      <button class="direct-close-button" @click="closeBookingModal" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 6L18 18" stroke="#dd3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="direct-modal-body">
      <form class="booking-form-modal" @submit.prevent="handleBooking">
        <section class="form-section">
          <h2>REQUESTING PARTY</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="department">Department</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="department"
                  v-model="department"
                  required
                />
                <span class="input-icon">
                  <BuildingOfficeIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="club">Club/Organization</label>
              <div class="input-wrapper">
                <input type="text" id="club" v-model="club" />
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
                <input type="text" id="person" v-model="person" required />
                <span class="input-icon">
                  <UserIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="contact">Email Address</label>
              <div class="input-wrapper">
                <input type="email" id="contact" v-model="contact" required />
                <span class="input-icon">
                  <EnvelopeIcon class="icon-primary" />
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
                <input type="text" id="event" v-model="event" required />
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
                <input
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  id="attendance"
                  v-model="attendance"
                  required
                  class="no-spinner"
                />
                <span class="input-icon">
                  <UserGroupIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="startTime">Event Start Time</label>
              <div class="input-wrapper">
                <input
                  type="time"
                  id="startTime"
                  v-model="startTime"
                  required
                />
                <span class="input-icon time-icon">
                  <ClockIcon class="icon-primary" />
                </span>
              </div>
            </div>
            <div class="form-group">
              <label for="endTime">Event End Time</label>
              <div class="input-wrapper">
                <input
                  type="time"
                  id="endTime"
                  v-model="endTime"
                  required
                />
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
            <label for="room">Choose a Laboratory</label>
            <div class="input-wrapper select-wrapper">
              <select id="room" v-model="selectedRoom" required>
                <option value="" disabled selected>Choose a laboratory</option>
                <option
                  v-for="room in filteredRooms"
                  :key="room.name"
                  :value="room.name"
                >
                  {{ room.name }}
                </option>
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
              <textarea
                id="facility"
                v-model="facility"
                rows="3"
                placeholder="List any specific equipment or facilities needed"
              ></textarea>
            </div>
          </div>
        </section>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
    <div class="direct-modal-footer">
      <button class="submit-btn" @click="handleBooking">Submit</button>
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
      <!-- Placeholder for no data or semester ended -->
      <div
        v-if="!hasScheduleData || isSemesterEnded"
        class="schedule-placeholder"
      >
        <div class="placeholder-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="#dd3859"
              stroke-width="2"
            />
            <path
              d="M16 2V6"
              stroke="#dd3859"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M8 2V6"
              stroke="#dd3859"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M3 10H21"
              stroke="#dd3859"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h3 class="placeholder-title">Weekly Schedule</h3>
        <p class="placeholder-text">
          The weekly class schedule will be available once the scheduling team
          provides the data.
        </p>
        <p class="placeholder-info">
          This schedule will show all regular classes to help you avoid booking
          conflicts.
        </p>
      </div>

      <!-- Weekly schedule display -->
      <div v-else class="weekly-schedule-display">
        <!-- Filters -->
        <div class="schedule-filters">
          <div class="filter-group">
            <label for="section-filter">Section:</label>
            <select id="section-filter" v-model="weeklyScheduleFilter.section">
              <option value="all">All Sections</option>
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
            <label for="lab-filter">Laboratory:</label>
            <select id="lab-filter" v-model="weeklyScheduleFilter.lab">
              <option value="all">All Labs</option>
              <option
                v-for="lab in [
                  'L201',
                  'L202',
                  'L203',
                  'L204',
                  'L205',
                  'IOT',
                  'Open Lab',
                ]"
                :key="lab"
                :value="lab"
              >
                {{ lab }}
              </option>
            </select>
          </div>
        </div>

        <!-- Weekly schedule table -->
        <div class="weekly-schedule-table-container">
            <table class="weekly-schedule-table">
              <thead>
                <tr>
                  <th class="time-column">Time</th>
                  <th v-for="day in filteredWeekDays" :key="day">{{ day }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="timeSlot in timeSlots"
                  :key="timeSlot.value"
                  class="time-block-row"
                >
                <td class="time-cell">{{ timeSlot.time }}</td>
                <td
                  v-for="day in filteredWeekDays"
                  :key="`${timeSlot.value}-${day}`"
                  class="day-cell"
                  :class="{
                    'has-class': getScheduleForTimeSlotAndDay(timeSlot, day).length > 0,
                    'lunch-time': timeSlot.isLunch
                  }"
                >
                  <div
                    v-for="schedule in getFilteredSchedules(timeSlot, day)"
                    :key="schedule.id"
                    class="class-info"
                  >
                    <div class="class-code">{{ schedule.course_code }}</div>
                    <div class="class-details">
                      <span class="class-section">{{ schedule.section }}</span>
                      <span class="class-room">{{ schedule.room }}</span>
                    </div>
                  </div>
                  <template v-if="getFilteredSchedules(timeSlot, day).length === 0">
                    <span>No schedule</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <button class="close-btn" @click="toggleWeeklyScheduleModal">
          Close
        </button>
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
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="success-icon"
        >
          <path
            d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
            stroke="#dd3859"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            class="checkmark"
            d="M22 4L12 14.01L9 11.01"
            stroke="#dd3859"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h3>Your booking has been submitted successfully!</h3>
      </div>

      <button class="option-button view-bookings" @click="closeModal">
        <div class="option-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M16 2V6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M8 2V6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M3 10H21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <router-link to="/" class="option-text">
          <div class="option-content">
            <h3>Return to Login</h3>

            <p>Check your booking history</p>
            <p>Go back to the login page</p>
          </div>
        </router-link>
      </button>

      <button class="option-button new-booking" @click="resetForm">
        <div class="option-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M5 12H19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <router-link to="/booking" class="option-text">
          <div class="option-content">
            <h3>Create New Booking</h3>
            <p>Make another laboratory booking</p>
          </div>
        </router-link>
      </button>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/ui/Modal.vue";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
} from "@heroicons/vue/24/outline";



const supabaseBookings = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

const supabaseSchedules = createClient(
  "https://yfiyhsazgjsxjmybsyar.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXloc2F6Z2pzeGpteWJzeWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE5MzEsImV4cCI6MjA1ODQ1NzkzMX0.j7oFwaqYvJq45jhPuQBPEtNU-itU-CRleOJcqm1fOOo"
);

// For user authentication and instructor validation
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);
export default {
  name: "BookingForm",
  components: {
    Modal,
    ArrowLeftIcon,
    BuildingOfficeIcon,
    UserIcon,
    UserGroupIcon,
    ClockIcon,
    DocumentTextIcon,
    ComputerDesktopIcon,
    EnvelopeIcon,
  },
  data() {
    return {
      // Modal states
      showRequesterModal: false,
      showBookingModal: false,
      
      // Requester info
      requesterType: "student",
      studentName: "",
      studentEmail: "",
      studentDepartment: "",
      studentSection: "",
      instructorName: "",
      requesterErrorMessage: "",
      
      selectedSectionFilter: "all",
      selectedLabFilter: "all", // Default to showing all labs
      selectedTimeBlock: null,
      selectedDay: null,
      scheduleData: [], // Original schedule data
      pendingBookings: [], // Bookings that are pending approval
      filteredScheduleData: [], // Schedules filtered by the selected day
      selectedDayOfWeek: null, 
      // Weekly schedule filter
      weeklyScheduleFilter: {
        section: "all",
        lab: "all",
      },
      // Flag to indicate if schedule data is available
      hasScheduleData: true,
      // Available sections for filtering
      availableSections: [
        "BSIT-1A",
        "BSIT-1B",
        "BSCS-1",
        "BSIT-2A",
        "BSIT-2B",
        "BSCS-2",
        "BSIT-3A",
        "BSIT-3B",
        "BSCS-3",
        "BSIT-4A",
        "BSIT-4B",
        "BSCS-4",
      ],
      // Schedule data that will be provided by the scheduling team
     
      // Define current semester date range based on actual academic calendar
      currentSemesterStart: "2024-12-10", // First day of current semester (Dec 10, 2024)
      currentSemesterEnd: "2025-04-25", // Last day of current semester (Apr 24, 2025)
      department: "",
      club: "",
      person: "",
      contact: "",
      event: "",
      attendance: "",
      requestDate: "",
      startTime: "",
      endTime: "",
      facility: "",
      notedBy: "",
      dateFilled: new Date().toISOString().substr(0, 10),
      errorMessage: "",
      dateRangeWarning: "",
      showSuccessModal: false,
      showWeeklyScheduleModal: false,
      selectedRoom: "",
      selectedTimeSlot: "",
      currentDate: new Date(),
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      // Time slots based on the actual schedule from the photos
      timeSlots: [
  {
    time: "7:00 AM - 8:00 AM",
    value: "07:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "8:00 AM - 9:00 AM",
    value: "08:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "9:00 AM - 10:00 AM",
    value: "09:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "10:00 AM - 11:00 AM",
    value: "10:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "11:00 AM - 12:00 PM",
    value: "11:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "12:00 PM - 1:00 PM",
    value: "12:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "1:00 PM - 2:00 PM",
    value: "13:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "2:00 PM - 3:00 PM",
    value: "14:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "3:00 PM - 4:00 PM",
    value: "15:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "4:00 PM - 5:00 PM",
    value: "16:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "5:00 PM - 6:00 PM",
    value: "17:00",
    duration: 60,
    isLunch: false,
  },
  {
    time: "6:00 PM - 7:00 PM",
    value: "18:00",
    duration: 60,
    isLunch: false,
  },

],
      // Weekly time blocks for the schedule display - completely flexible structure
      // This can accommodate any time slot combination from the scheduling team
      weeklyTimeBlocks: [],
      availableRooms: [
        { name: "L201", availableDates: ["2025-04-22", "2025-04-23"] },
        { name: "L202", availableDates: ["2025-04-22", "2025-04-24"] },
        { name: "L203", availableDates: ["2025-04-23", "2025-04-25"] },
        { name: "L204", availableDates: ["2025-04-22", "2025-04-23"] },
        { name: "L205", availableDates: ["2025-04-24", "2025-04-25"] },
        { name: "IOT", availableDates: ["2025-04-22", "2025-04-23"] },
        { name: "Open Lab", availableDates: ["2025-04-22", "2025-04-23"] },
      ],
      filteredRooms: [],
      calendarDays: [],
    };
  },
  computed: {
    displayedDays() {
    if (this.selectedDayOfWeek) {
      return [this.selectedDayOfWeek]; // Return only the selected day
    }
    return this.filteredWeekDays; // Return all days if no day is selected
  },
    filteredSchedulesForDay() {
    if (!this.selectedDayOfWeek) {
      return this.scheduleData; // Return all schedules if no day is selected
    }

    // Filter schedules for the selected day
    return this.scheduleData.filter(
      (schedule) => schedule.day === this.selectedDayOfWeek
    );
  },
    currentMonthName() {
      return new Date(this.currentDate).toLocaleString("default", {
        month: "long",
      });
    },

    filteredWeekDays() {
      // Return the filtered array (Monday to Saturday)
      return this.weekDays.slice(1, 7);
    },

    // Helper method to convert time to minutes

    currentYear() {
      return new Date(this.currentDate).getFullYear();
    },
    filteredTimeSlots() {
      return this.timeSlots.filter((slot) => !slot.isLunch);
    },
    filteredTimeBlocks() {
      if (!this.selectedDayOfWeek) {
        return this.weeklyTimeBlocks;
      }

      return this.weeklyTimeBlocks.filter((block) => {
        return block.periods.some(
          (period) => period.day === this.selectedDayOfWeek
        );
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
      this.weeklyTimeBlocks.forEach((block) => {
        // Skip if we already have this time slot
        if (timeSlots.some((slot) => slot.time === block.time)) {
          return;
        }

        timeSlots.push({
          time: block.time,
          startTime: block.startTime || block.time.split(" - ")[0],
          endTime: block.endTime || block.time.split(" - ")[1],
          isLunch: block.isLunch || false,
        });
      });

      // Sort time slots by start time
      return timeSlots.sort((a, b) => {
        const aTime = a.startTime.replace(":", "");
        const bTime = b.startTime.replace(":", "");
        return parseInt(aTime) - parseInt(bTime);
      });
    },
  },
  mounted() {
    // Initialize the calendar
    this.generateCalendar();
    // Fetch schedules
    this.fetchSchedules();
    // Fetch pending bookings
    this.fetchPendingBookings();
  },
  methods: {
    formatDate(date) {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  },
    getDayCellStyle(timeSlot, day) {
      const schedule = this.getScheduleForTimeSlotAndDay(timeSlot, day)[0];
      if (schedule) {
        return {
          backgroundColor: this.getScheduleColor(schedule),
          color: "#fff",
          fontWeight: "bold",
        };
      }
      return {};
    },
    getScheduleColor(schedule) {
      // If it's a pending booking, use a specific color
      if (schedule.isPending) {
        return "#FFF3CD"; // Light yellow for pending bookings
      }
      
      // Assign colors based on the room or other properties
      const roomColors = {
        L201: "#FFD580", // Yellow
        L202: "#FFABAB", // Light Red
        L203: "#A0E7E5", // Light Blue
        L204: "#B4F8C8", // Light Green
        L205: "#FFDAC1", // Peach
        IOT: "#D5AAFF", // Purple
        "Open Lab": "#FFC3A0", // Orange
      };

      return roomColors[schedule.lab_room] || "#E0E0E0"; // Default to gray if no match
    },
    getFilteredSchedules(timeSlot, day) {
      // First get all schedules for this time slot and day
      const allSchedules = this.getScheduleForTimeSlotAndDay(timeSlot, day);
      
      // If "all" sections is selected, return all schedules
      if (this.weeklyScheduleFilter.section === 'all') {
        return allSchedules;
      }
      
      // Otherwise, filter schedules by the selected section
      return allSchedules.filter(schedule => {
        // Normalize both strings by removing any spaces or hyphens for comparison
        const normalizedScheduleSection = schedule.section ? schedule.section.replace(/[-\s]/g, '').toLowerCase() : '';
        const normalizedFilterSection = this.weeklyScheduleFilter.section.replace(/[-\s]/g, '').toLowerCase();
        
        // Check if the normalized schedule section includes the normalized filter section
        return normalizedScheduleSection.includes(normalizedFilterSection);
      });
    },
    convertTimeToMinutes(time) {
  if (typeof time !== "string") {
    console.error("Invalid time format:", time);
    return 0; // Return 0 or handle the invalid case appropriately
  }

  // Check if the time includes AM/PM
  if (time.includes("AM") || time.includes("PM")) {
    time = this.formatTo24Hour(time); // Convert to 24-hour format
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
},
async filterAvailableRooms() {
    if (!this.requestDate || !this.startTime || !this.endTime) {
      this.filteredRooms = []; // Clear the dropdown if no date or time is selected
      return;
    }

    try {
      // Fetch room schedules for the selected date
      const { data, error } = await supabaseSchedules
        .from("schedules")
        .select("*")
        .eq("day", this.selectedDayOfWeek);

      if (error) throw error;

      console.log("Fetched schedules:", data);

      // Filter out rooms that are already booked during the selected time range
      const unavailableRooms = data
        .filter((schedule) => {
          const scheduleStart = this.convertTimeToMinutes(schedule.start_time);
          const scheduleEnd = this.convertTimeToMinutes(schedule.end_time);
          const bookingStart = this.convertTimeToMinutes(this.startTime);
          const bookingEnd = this.convertTimeToMinutes(this.endTime);

          // Check if the selected time range overlaps with the schedule
          return (
            (bookingStart >= scheduleStart && bookingStart < scheduleEnd) || // Booking starts during the schedule
            (bookingEnd > scheduleStart && bookingEnd <= scheduleEnd) || // Booking ends during the schedule
            (bookingStart <= scheduleStart && bookingEnd >= scheduleEnd) // Booking fully overlaps the schedule
          );
        })
        .map((schedule) => schedule.lab_room);

      console.log("Unavailable rooms:", unavailableRooms);

      // Filter available rooms
      this.filteredRooms = this.availableRooms.filter(
        (room) => !unavailableRooms.includes(room.name)
      );

      console.log("Filtered available rooms:", this.filteredRooms);
    } catch (error) {
      console.error("Error fetching room schedules:", error.message);
      this.errorMessage = "Failed to fetch room availability.";
    }
  },
  
    hasClassInTimeSlot(timeSlot, day) {
      if (!Array.isArray(this.scheduleData)) {
        console.error("scheduleData is not an array or is undefined");
        return false;
      }

      return this.scheduleData.some((block) => {
        // Log only blocks for a specific day or condition
        if (block.day === "Monday") {
          console.log("Block for Monday:", block);
        }

        if (!block || typeof block !== "object") {
          return false;
        }

        if (!Array.isArray(block.periods)) {
          return false;
        }

        return block.periods.some((period) => {
          if (period.day === day) {
            console.log("Period for day:", period);
          }
          return period.day === day;
        });
      });
    },

    // Get the schedule for a specific time slot and day

    // Check if a time slot is within a given time range
    isTimeSlotInRange(timeSlotValue, startTime, endTime) {
      // Normalize time formats to 24-hour format
      const slotStart = this.convertTimeToMinutes(
        this.formatTo24Hour(timeSlotValue)
      );
      const classStart = this.convertTimeToMinutes(
        this.formatTo24Hour(startTime)
      );
      const classEnd = this.convertTimeToMinutes(this.formatTo24Hour(endTime));

      return slotStart >= classStart && slotStart < classEnd;
    },
    formatTo24Hour(time) {
      const [timePart, period] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    },
    // Convert a time string (e.g., "09:00") to minutes since midnight

    updateSelectedDay() {
      if (this.requestDate) {
        const date = new Date(this.requestDate);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        this.selectedDayOfWeek = daysOfWeek[date.getDay()];
      }
    },
    filteredDaysForTimeSlot(timeSlot) {
      return this.weekDays.slice(1, 7).filter((day) => {
        return (
          !this.isPartOfMergedCell(timeSlot, day) ||
          this.isStartOfMergedCell(timeSlot, day)
        );
      });
    },
    getTimeSlots() {
      const timeSlots = [];
      if (!this.scheduleData || !Array.isArray(this.scheduleData)) {
        return timeSlots; // Return an empty array if scheduleData is undefined
      }

      this.scheduleData.forEach((block) => {
        if (block.time && !timeSlots.includes(block.time)) {
          timeSlots.push(block.time);
        }
      });

      return timeSlots.sort((a, b) => {
        const aStart = a.split(" - ")[0].trim();
        const bStart = b.split(" - ")[0].trim();
        return this.compareTimeStrings(aStart, bStart);
      });
    },

    compareTimeStrings(a, b) {
      // Convert time strings to comparable values
      // Handle AM/PM format
      const aIsPM = a.toLowerCase().includes("pm");
      const bIsPM = b.toLowerCase().includes("pm");

      // Extract hours and minutes
      let aTimeParts = a.replace(/\s*(am|pm)\s*/i, "").split(":");
      let bTimeParts = b.replace(/\s*(am|pm)\s*/i, "").split(":");

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
    
    async fetchPendingBookings() {
      try {
        const { data, error } = await supabaseBookings
          .from("bookings")
          .select("*")
          .eq("status", "pending");
        
        if (error) throw error;
        
        console.log("Pending bookings:", data);
        
        // Process the pending bookings to match the schedule data format
        this.pendingBookings = data.map(booking => {
          // Convert the booking date to a day of the week
          const bookingDate = new Date(booking.requestDate);
          const daysOfWeek = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ];
          const dayOfWeek = daysOfWeek[bookingDate.getDay()];
          
          return {
            id: booking.id,
            day: dayOfWeek,
            start_time: booking.startTime,
            end_time: booking.endTime,
            lab_room: booking.selectedRoom,
            section: "Pending",
            course_code: "PENDING",
            course_name: booking.event,
            isPending: true, // Flag to identify pending bookings
            event: booking.event,
            department: booking.department,
            requestDate: booking.requestDate
          };
        });
      } catch (error) {
        console.error("Error fetching pending bookings:", error.message);
        this.errorMessage = "Failed to fetch pending bookings.";
      }
    },

    async fetchSchedules() {
      try {
        const { data, error } = await supabaseSchedules
          .from("schedules")
          .select("*");
        if (error) throw error;

        console.log("Raw data from API:", data); // Log raw data from the API

        // Ensure periods is always populated
        this.scheduleData = data.map((block) => {
          console.log("Before processing block:", block); // Log each block before processing
          const processedBlock = {
            ...block,
            periods: [
              {
                day: block.day,
                start_time: block.start_time,
                end_time: block.end_time,
                lab_room: block.lab_room,
                section: block.section,
                course_code: block.course_code,
                course_name: block.course_name,
              },
            ],
          };
           // Log each block after processing
          return processedBlock;
        });

       // Log the final scheduleData
      } catch (error) {
       
        this.scheduleData = [];
        this.errorMessage = "Failed to fetch schedules.";
      }
    },
    
    hasScheduleForTimeAndDay(timeSlot) {
      if (!Array.isArray(this.scheduleData)) {
        return false; // Ensure scheduleData is defined and is an array
      }

      return this.scheduleData.some((block) => {
        if (!block || !Array.isArray(block.periods)) {
          return false; // Ensure block and periods are valid
        }

        if (block.time !== timeSlot) return false;

        return block.periods.some((period) => {

          // Additional filters
          if (
            this.weeklyScheduleFilter.section !== "all" &&
            period.section &&
            !period.section.includes(this.weeklyScheduleFilter.section)
          ) {
            return false;
          }

          if (
            this.weeklyScheduleFilter.lab !== "all" &&
            period.room !== this.weeklyScheduleFilter.lab
          ) {
            return false;
          }

          return true;
        });
      });
    },

    getScheduleForTimeSlotAndDay(timeSlot, day) {
      if (!Array.isArray(this.filteredSchedulesForDay)) {
        console.error("filteredSchedulesForDay is not an array or is undefined");
        return [];
      }

      console.log("Checking schedules for timeSlot:", timeSlot, "and day:", day);

      // Filter schedules for the given time slot
      const filteredSchedules = this.filteredSchedulesForDay.filter((schedule) => {
        console.log("Raw time values:", {
          timeSlotValue: timeSlot.value,
          scheduleStartTime: schedule.start_time,
          scheduleEndTime: schedule.end_time,
        });

        // Convert times to minutes for comparison
        const scheduleStart = this.convertTimeToMinutes(schedule.start_time);
        const scheduleEnd = this.convertTimeToMinutes(schedule.end_time);
        const slotStart = this.convertTimeToMinutes(timeSlot.value);

        // Check if the time slot falls within the schedule's time range
        const isTimeMatch = slotStart >= scheduleStart && slotStart < scheduleEnd;

        console.log("Time comparison:", {
          slotStart,
          scheduleStart,
          scheduleEnd,
          isTimeMatch,
        });

        return isTimeMatch;
      });
      
      // Filter pending bookings for the given time slot and day
      const pendingBookingsForSlot = [];
      
      if (Array.isArray(this.pendingBookings) && this.pendingBookings.length > 0) {
        // Filter pending bookings for this day
        const dayPendingBookings = this.pendingBookings.filter(booking => booking.day === day);
        
        // Filter by time slot
        for (const booking of dayPendingBookings) {
          const bookingStart = this.convertTimeToMinutes(booking.start_time);
          const bookingEnd = this.convertTimeToMinutes(booking.end_time);
          const slotStart = this.convertTimeToMinutes(timeSlot.value);
          
          // Check if the time slot falls within the booking's time range
          if (slotStart >= bookingStart && slotStart < bookingEnd) {
            pendingBookingsForSlot.push(booking);
          }
        }
      }
      
      // Combine regular schedules and pending bookings
      const combinedSchedules = [...filteredSchedules, ...pendingBookingsForSlot];

      console.log("Combined schedules for timeSlot and day:", {
        timeSlot,
        day,
        regularSchedules: filteredSchedules,
        pendingBookings: pendingBookingsForSlot,
        combinedSchedules
      });

      return combinedSchedules;
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
        const previousSchedules = this.getScheduleForTimeSlotAndDay(
          previousTimeSlot,
          day
        );

        for (const schedule of previousSchedules) {
          // If a previous schedule spans to this time slot, this cell is part of a merged cell
          if (
            this.doesScheduleSpanToTimeSlot(
              schedule,
              previousTimeSlot,
              timeSlot
            )
          ) {
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
          if (
            this.doesScheduleSpanToTimeSlot(schedule, timeSlot, nextTimeSlot)
          ) {
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
      const fromSchedules = this.scheduleData.find(
        (block) => block.time === fromTimeSlot
      );
      const toSchedules = this.scheduleData.find(
        (block) => block.time === toTimeSlot
      );

      if (!fromSchedules || !toSchedules) return false;

      // Check if there's a class that spans these time slots
      // This is just a placeholder logic - you'll need to update it based on your actual data structure
      return false; // For now, return false to avoid errors
    },

    // Original methods
    hasClassOnDay(block, day) {
      if (this.selectedLabFilter === "all") {
        return block.periods.some(
          (period) => period.day === day && period.isClass
        );
      } else {
        return block.periods.some(
          (period) =>
            period.day === day &&
            period.isClass &&
            period.room === this.selectedLabFilter
        );
      }
    },

    isFilteredOut(block, day) {
      if (this.selectedLabFilter === "all") return false;

      const classForDay = this.getClassForDayAndTime(block, day);
      return classForDay && classForDay.room !== this.selectedLabFilter;
    },

    isLabRoom(room) {
      const labRooms = [
        "L201",
        "L202",
        "L203",
        "L204",
        "L205",
        "IOT",
        "Open Laboratory",
      ];
      return labRooms.includes(room);
    },

    // Check if a time block is a lunch period
    isLunchTime(timeRange) {
      if (!timeRange || typeof timeRange !== "string") return false;

      // Check if this is a designated lunch period
      return (
        timeRange.toLowerCase().includes("lunch") ||
        (timeRange.toLowerCase().includes("12:00 pm") &&
          timeRange.toLowerCase().includes("1:00 pm"))
      );
    },

    // Get all classes for a specific day and time block
    getClassesForDayAndTime(block, day) {
      if (!block.periods) return [];
      return block.periods.filter(
        (period) => period.day === day && period.isClass
      );
    },

    getClassForDayAndTime(block, day) {
      if (!block.periods) return null;
      return block.periods.find(
        (period) => period.day === day && period.isClass
      );
    },

    isTimeBlockSelected(block, day) {
      return this.selectedTimeBlock === block.time && this.selectedDay === day;
    },

    selectTimeBlock(block, day) {
      // Don't select lunch time blocks
      console.log("Clicked block:", block);
      console.log("Clicked day:", day);
      if (this.isLunchTime(block.time)) return;

      // Don't select blocks that already have a class
      if (this.hasClassOnDay(block, day)) return;

      this.selectedTimeBlock = block.time;
      this.selectedDay = day;

      // Extract start and end times from the block time range
      const [startTime, endTime] = block.time.split(" - ");
      this.startTime = startTime;
      this.endTime = endTime;

      // Find the corresponding room based on the day
      const roomMapping = {
        Monday: "L201",
        Tuesday: "L202",
        Wednesday: "L203",
        Thursday: "L204",
        Friday: "L205",
        Saturday: "openlab",
      };

      // Set the selected room and ensure it's reflected in the dropdown
      this.selectedRoom = roomMapping[day] || "";
    },

    selectDate(day) {
      console.log("Day clicked:", day);

      if (day.isPastDate) {
        this.errorMessage = "Cannot book past dates";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
        return;
      }

      if (day.date) {
        this.requestDate = day.date;

        // Check if the selected date is outside the current semester range
        this.checkSemesterDateRange();

        // Get the day of the week from the selected date
        const date = new Date(day.date);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        this.selectedDayOfWeek = daysOfWeek[date.getDay()];
        
        console.log("Selected Day of Week:", this.selectedDayOfWeek);

        // Trigger filtering of schedules
        this.updateRoomAvailability();
      }
    },

    // Check if the selected date is outside the semester range and show a tooltip
    // Handle date change from the date input field
    handleDateChange() {
      // Update the selected day of week
      this.updateSelectedDay();
      
      // Filter available rooms based on the new date
      this.filterAvailableRooms();
      
      // Check if the date is outside semester range and show tooltip if needed
      this.checkSemesterDateRange();
    },
    
    checkSemesterDateRange() {
      if (!this.requestDate) return;
      
      const selectedDate = new Date(this.requestDate);
      const semesterStart = new Date(this.currentSemesterStart);
      const semesterEnd = new Date(this.currentSemesterEnd);

      console.log("Checking date range:", {
        selectedDate,
        semesterStart,
        semesterEnd,
        isBeforeSemester: selectedDate < semesterStart,
        isAfterSemester: selectedDate > semesterEnd
      });

      if (selectedDate < semesterStart || selectedDate > semesterEnd) {
        this.dateRangeWarning = selectedDate < semesterStart
          ? "Note: Selected date is before the semester start date (" + this.formatDate(this.currentSemesterStart) + ")"
          : "Note: Selected date is after the semester end date (" + this.formatDate(this.currentSemesterEnd) + ")";
        
        console.log("Setting date range warning:", this.dateRangeWarning);
        
        // Clear the warning after 5 seconds
        setTimeout(() => {
          this.dateRangeWarning = "";
        }, 5000);
      } else {
        this.dateRangeWarning = "";
      }
    },

    async fetchSchedulesForDay(dayOfWeek, timeSlot = null) {
      try {
        // Build the query with filters
        let query = supabaseSchedules
          .from("schedules")
          .select("*")
          .eq("day", dayOfWeek); // Filter by the selected day

    // If a time slot is provided, add time range filters
    if (timeSlot) {
      const slotStart = this.convertTimeToMinutes(timeSlot.value);
      const slotEnd = slotStart + timeSlot.duration;

      query = query.or(
        `start_time.lte.${slotEnd},end_time.gte.${slotStart}`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    console.log("Fetched schedules for day:", dayOfWeek, "and timeSlot:", timeSlot, data);

    // Transform the fetched data to ensure `periods` is always an array
    this.scheduleData = data.map((item) => ({
      id: item.id,
      time: `${item.start_time} - ${item.end_time}`,
      startTime: item.start_time,
      endTime: item.end_time,
      periods: item.periods || [], // Ensure periods is always an array
    }));
  } catch (error) {
    console.error(
      `Error fetching schedules for ${dayOfWeek}:`,
      error.message
    );
    this.errorMessage = `Failed to fetch schedules for ${dayOfWeek}.`;
  }
},

    // Format time from 24-hour to 12-hour format
    formatTime(time24) {
      if (!time24) return "";

      // If already in 12-hour format, return as is
      if (time24.includes("AM") || time24.includes("PM")) {
        return time24;
      }

      const [hours, minutes] = time24.split(":");
      const hoursNum = parseInt(hours);
      const period = hoursNum >= 12 ? "PM" : "AM";
      const hours12 = hoursNum % 12 || 12;

      return `${hours12}:${minutes} ${period}`;
    },

    // Check room availability for the selected date
    updateRoomAvailability() {
      if (
        !this.requestDate ||
        !this.availableRooms ||
        !Array.isArray(this.availableRooms)
      ) {
        return;
      }

      this.availableRooms.forEach((room) => {
        room.isAvailable =
          Array.isArray(room.availableDates) &&
          room.availableDates.includes(this.requestDate);
      });

      this.filteredTimeSlots = this.weeklyTimeBlocks.filter((block) => {
        return (
          !this.hasClassOnDay(block, this.selectedDayOfWeek) ||
          (this.selectedLabFilter !== "all" &&
            !this.isFilteredOut(block, this.selectedDayOfWeek))
        );
      });
    },

    // Toggle between showing all days or just the selected day
    toggleDayView() {
      if (this.selectedDayOfWeek) {
        this.selectedDayOfWeek = null; // Show all days
      } else if (this.requestDate) {
        // Get the day of the week from the selected date
        const date = new Date(this.requestDate);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
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
    async handleBooking() {
      try {
        const bookingData = {

          department: this.department,
          club: this.club,
          person: this.person,
          contact: this.contact,
          event: this.event,
          attendance: parseInt(this.attendance, 10),
          requestDate: this.requestDate,
          startTime: this.startTime,
          endTime: this.endTime,
          facility: this.facility,
          notedBy: this.notedBy,
          dateFilled: this.dateFilled,
          selectedRoom: this.selectedRoom,
          status: "pending",
          notification_sent: false,
        };

        const { data, error } = await supabaseBookings
          .from("bookings")
          .insert([bookingData]);
        if (error) throw error;

        console.log("Booking submitted:", data);
        this.showSuccessModal = true;
        this.resetForm();
      } catch (error) {
        console.error("Error submitting booking:", error.message);
        this.errorMessage = "Failed to submit booking.";
      }
    },
    resetForm() {
      this.department = "";
      this.club = "";
      this.person = "";
      this.contact = "";
      this.event = "";
      this.attendance = "";
      this.requestDate = "";
      this.startTime = "";
      this.endTime = "";
      this.facility = "";
      this.notedBy = "";
      this.dateFilled = new Date().toISOString().substr(0, 10);
      this.selectedRoom = "";
      this.selectedTimeSlot = "";
      this.errorMessage = "";
      this.showSuccessModal = false;
      
      // Reset requester form
      this.resetRequesterForm();
      
      // Reset calendar selection
      this.generateCalendar();
    },
    
    // Open the requester info modal when Book Now button is clicked
    openBookingModal() {
      // Ensure we have a selected date before opening the modal
      if (!this.requestDate) {
        this.errorMessage = "Please select a date first";
        return;
      }
      
      // Set the date in the form to the selected date
      this.dateFilled = this.formatDate(this.requestDate);
      
      // Show the requester info modal first
      this.showRequesterModal = true;
    },
    
    // Close the requester info modal
    closeRequesterModal() {
      this.showRequesterModal = false;
      this.requesterErrorMessage = "";
      this.resetRequesterForm();
    },
    
    // Reset the requester form fields
    resetRequesterForm() {
      this.requesterType = "student";
      this.studentName = "";
      this.studentEmail = "";
      this.studentDepartment = "";
      this.studentSection = "";
      this.instructorName = "";
    },
    
    // Validate requester info and proceed to booking form if valid
    async validateRequesterInfo() {
      try {
        this.requesterErrorMessage = "";
        
        if (this.requesterType === "student") {
          // Validate student fields
          if (!this.studentName || !this.studentEmail || !this.studentDepartment || !this.studentSection) {
            this.requesterErrorMessage = "Please fill in all required fields";
            return;
          }
          
          // Check if email is a valid UIC email (must be @uic.edu.ph domain)
          const emailRegex = /^[^\s@]+@uic\.edu\.ph$/;
          if (!emailRegex.test(this.studentEmail)) {
            this.requesterErrorMessage = "Please enter a valid UIC email address (@uic.edu.ph)";
            return;
          }
          
          // Set the department and person fields for the booking form
          this.department = this.studentDepartment;
          this.person = this.studentName;
          this.contact = this.studentEmail;
          
        } else if (this.requesterType === "instructor") {
          // Validate instructor fields
          if (!this.instructorName) {
            this.requesterErrorMessage = "Please enter your name";
            return;
          }
          
          // Check if instructor exists in the 'user' table
          const { data, error } = await supabase
            .from('user')
            .select('fullname, usertype, email')
            .eq('usertype', 'Instructor')
            .ilike('fullname', `%${this.instructorName}%`)
            .limit(1);
          
          if (error) {
            console.error('Error checking instructor:', error.message);
            this.requesterErrorMessage = "An error occurred while validating your information. Please try again.";
            return;
          }
          
          if (data && data.length > 0) {
            // Instructor found in database
            this.department = "Faculty";
            this.person = data[0].fullname; // Use the exact name from the database
            this.contact = data[0].email || ""; // Use email from database if available
            console.log("Instructor found in database:", data[0]);
          } else {
            // Instructor not found
            this.requesterErrorMessage = "Instructor name not found in our records. Please check your name or contact the administrator.";
            return;
          }
        }
        
        // Close requester modal and open booking modal
        this.showRequesterModal = false;
        this.showBookingModal = true;
      } catch (error) {
        console.error("Error validating requester info:", error.message);
        this.requesterErrorMessage = "An error occurred while validating your information. Please try again.";
      }
    },
    
    // Close the booking modal
    closeBookingModal() {
      this.showBookingModal = false;
      this.errorMessage = ""; // Clear any error messages
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
      const formattedToday = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Generate calendar days array
      this.calendarDays = [];

      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        this.calendarDays.push({ date: null });
      }

      // Add actual days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        // Format date manually to avoid timezone issues
        const formattedDate = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(i).padStart(2, "0")}`;

        // Check if date is within the current semester period
        const isWithinSemester =
          formattedDate >= this.currentSemesterStart &&
          formattedDate <= this.currentSemesterEnd;

        // Check if date is in the past
        const isPastDate = formattedDate < formattedToday;

        // Determine if this date is before the semester start or after the semester end
        const isBeforeSemester = !isWithinSemester && formattedDate < this.currentSemesterStart;
        const isAfterSemester = !isWithinSemester && formattedDate > this.currentSemesterEnd;

        // Create tooltip messages for dates outside the semester
        let semesterMessage = "";
        if (isBeforeSemester) {
          semesterMessage = `Date is before semester start (${this.formatDate(this.currentSemesterStart)})`;
        } else if (isAfterSemester) {
          semesterMessage = `Date is after semester end (${this.formatDate(this.currentSemesterEnd)})`;
        }

        // Check if any room is available on this date
        const isAvailable =
          !isPastDate &&
          this.availableRooms.some(
            (room) =>
              Array.isArray(room.availableDates) &&
              room.availableDates.includes(formattedDate)
          );

        this.calendarDays.push({
          date: formattedDate,
          dayNumber: i,
          isToday: formattedDate === formattedToday,
          available: isAvailable,
          isBeforeSemester: isBeforeSemester,
          isAfterSemester: isAfterSemester,
          isPastDate: isPastDate,
          semesterMessage: semesterMessage
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
  },
};
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
  appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Custom class to remove any spinner buttons */
.no-spinner {
  -webkit-appearance: none;
  appearance: none;
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
  font-family: "Poppins", sans-serif;
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
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
}

.header h1 {
  color: #dd3859;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.schedule-wrapper {
  width: 100%;
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
  left: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-button:hover {
  transform: translateX(-5px);
}

/* Booking Form */
.booking-form {
  padding: 1.5rem;
}

/* Direct Modal Styles */
.direct-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.direct-modal-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: modal-appear 0.3s ease-out forwards;
}

.direct-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.direct-modal-header h3 {
  margin: 0;
  color: #dd3859;
  font-weight: 600;
  font-size: 1.25rem;
}

.direct-close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.direct-close-button:hover {
  transform: scale(1.1);
}

.direct-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.direct-modal-footer {
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #eee;
}

.booking-form-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  color: #e9256e;
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
  font-family: "Poppins", sans-serif;
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
  color: #dd3859;
}

.option-button.view-bookings:hover {
  border-color: #dd3859;
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
  font-family: "Poppins", sans-serif;
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
.schedule-block {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  color: #333;
  font-size: 0.8rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.schedule-block:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.schedule-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.schedule-class {
  font-weight: bold;
}

.schedule-section {
  display: block;
  font-size: 0.8rem;
  color: #fff;
}

.schedule-room {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.2rem;
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
    pointer-events: auto;
    cursor: pointer;
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
  text-align: center;
  vertical-align: middle;
  padding: 0.5rem;
  border-radius: 4px;
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
  content: "LUNCH";
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
.day-cell.has-class {
  background-color: #ffecd1; /* Light orange for scheduled classes */
  color: #333;
}

.day-cell.lunch-time {
  background-color: #f5f5f5; /* Light gray for lunch periods */
  color: #777;
}

.day-cell.selected {
  background-color: rgba(221, 56, 89, 0.1); /* Light red for selected cells */
  border: 2px solid #dd3859;
}

.class-info {
  background-color: #ffd580; /* Yellow for class details */
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.class-code {
  font-weight: 700;
  color: #33465e;
  margin-bottom: 0.25rem;
  letter-spacing: 0.03em;
}

.class-details {
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.class-room {
  font-weight: 500;
  margin-top: 0.35rem;
  font-size: 0.7rem;
  color: #5a7089;
  display: flex;
  align-items: center;
}

.class-room:before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4ade80;
  margin-right: 0.4rem;
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

.calendar-cell.before-semester {
  background-color: rgba(234, 179, 8, 0.1);
  color: #854d0e;
  cursor: pointer;
  position: relative;
}

.calendar-cell.after-semester {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  cursor: pointer;
  position: relative;
}

/* Removed warning icons */

.after-semester,
.past-date {
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  max-height: 65vh;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: white;
}

.weekly-schedule-display {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.schedule-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
  background-color: #f8f9fc;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

.filter-group label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  font-size: 0.95rem;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23555' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 12px) center;
  padding-right: 2.5rem;
}

.filter-group select:focus {
  border-color: #dd3859;
  outline: none;
  box-shadow: 0 0 0 3px rgba(221, 56, 89, 0.15);
}

.weekly-schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: "Poppins", sans-serif;
  font-size: 0.9rem;
}

.weekly-schedule-table th {
  background-color: #f2f6fc;
  padding: 1rem 0.75rem;
  text-align: center;
  border-bottom: 2px solid #e0e7ff;
  position: sticky;
  top: 0;
  z-index: 10;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.weekly-schedule-table .time-column {
  width: 130px;
  background-color: #f2f6fc;
  position: sticky;
  left: 0;
  z-index: 20;
  box-shadow: 4px 0 8px -4px rgba(0, 0, 0, 0.1);
}

.weekly-schedule-table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-right: 1px solid rgba(0, 0, 0, 0.03);
  padding: 0.75rem;
  vertical-align: top;
  height: 70px;
  transition: all 0.2s ease;
}

.weekly-schedule-table tr:hover td {
  background-color: rgba(242, 246, 252, 0.5);
}

.weekly-schedule-table .time-cell {
  background-color: #f5f9ff;
  font-weight: 500;
  text-align: center;
  position: sticky;
  left: 0;
  z-index: 5;
  box-shadow: 4px 0 8px -4px rgba(0, 0, 0, 0.1);
  color: #3a4555;
  font-size: 0.85rem;
}

.weekly-schedule-table .has-class {
  background-color: rgba(252, 240, 227, 0.7);
}

.weekly-schedule-table .lunch-row td {
  background-color: #f0f7ff;
  color: #5a6a7e;
  font-style: italic;
  text-align: center;
  font-size: 0.85rem;
  height: 40px;
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
  background-color: rgba(255, 166, 102, 0.15);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid #ff9c54;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.class-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.class-code {
  font-weight: 700;
  color: #33465e;
  margin-bottom: 0.25rem;
  letter-spacing: 0.03em;
}

.class-section {
  font-size: 0.7rem;
  background-color: rgba(221, 56, 89, 0.1);
  color: #dd3859;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  font-weight: 600;
  margin-right: 0.5rem;
}

.class-instructor {
  font-size: 0.75rem;
  font-style: italic;
}

.class-room {
  font-weight: 500;
  margin-top: 0.35rem;
  font-size: 0.7rem;
  color: #5a7089;
  display: flex;
  align-items: center;
}

.class-room:before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4ade80;
  margin-right: 0.4rem;
}

/* New styles for the updated layout */
.date-selection-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 2rem;
}

/* Requester modal styles */
.requester-modal {
  max-width: 500px;
}

.requester-type-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
}

.requester-type-selector {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

.requester-type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.requester-type-option:hover {
  border-color: #dd3859;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.requester-type-option.selected {
  border-color: #dd3859;
  background-color: rgba(221, 56, 89, 0.05);
  box-shadow: 0 4px 8px rgba(221, 56, 89, 0.15);
}

.requester-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.requester-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  background-color: #f3f4f6;
  padding: 0.5rem;
  transition: all 0.2s ease;
  color: #6b7280;
}

.requester-type-option.selected .requester-icon {
  background-color: rgba(221, 56, 89, 0.15);
  color: #dd3859;
}

.requester-type-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: #4b5563;
  transition: color 0.2s ease;
}

.requester-type-option.selected .requester-type-text {
  color: #dd3859;
}

.date-selection-section h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.weekly-schedule-section {
  margin-top: 2rem;
}

.schedule-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.schedule-section-header h3 {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.book-now-btn {
  background-color: #dd3859;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(221, 56, 89, 0.15);
}

.book-now-btn:hover {
  background-color: #c62c4c;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(221, 56, 89, 0.2);
}

.weekly-schedule-table-container {
  overflow-x: auto;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

/* Booking Modal Styles */
.booking-modal {
  max-width: 800px;
}

.booking-modal-content {
  padding: 1.5rem;
}

.booking-form-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 0;
}

.booking-modal .modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.booking-modal .cancel-btn,
.booking-modal .submit-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.submit-btn {
  background-color: #dd3859;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(221, 56, 89, 0.15);
}

.submit-btn:hover {
  background-color: #c62c4c;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(221, 56, 89, 0.2);
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


.date-input-container {
  position: relative;
}

.date-tooltip {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 3px solid #ffeeba;
  animation: fadeIn 0.3s ease-in-out;
}

.pending-booking {
  background-color: #fff3cd;
  border-left: 3px solid #ffc107;
  animation: pulse 2s infinite;
}

.pending-label {
  color: #856404;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
