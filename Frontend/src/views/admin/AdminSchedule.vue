<template>
  <DashboardLayout>
    <AdminHeader pageTitle="Semester Schedule" />
    <div class="schedule-container">
      <div class="schedule-section">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button 
            class="toggle-btn" 
            :class="{ 'active': currentView === 'list' }" 
            @click="currentView = 'list'"
          >
            List View
          </button>
          <button 
            class="toggle-btn" 
            :class="{ 'active': currentView === 'weekly' }" 
            @click="currentView = 'weekly'"
          >
            Weekly Schedule
          </button>
        </div>
        <div class="filters">
          <div class="filter-group">
  <label for="search-filter">Search:</label>
  <input 
    id="search-filter" 
    type="text" 
    v-model="searchQuery" 
    @input="applyFilters" 
    placeholder="Search by course name, instructor, or section" 
    class="search-input"
  />
</div>
          
          <div class="filter-group">
            <label for="section-filter">Section:</label>
            <select id="section-filter" v-model="selectedSection" @change="applyFilters">
              <option value="">All Sections</option>
              <option v-for="section in availableSections" :key="section" :value="section">
                {{ section }}
              </option>
            </select>
          </div>
          <!-- Day filter removed as requested -->
          
        
          <div class="filter-group" v-if="dateFilter === 'semester'">
            <label for="semester-filter">Select Semester:</label>
            <select id="semester-filter" v-model="selectedSemester" @change="applyFilters">
              <option value="current">Current Semester</option>
              <option value="2024-2">2nd Semester 2024-2025</option>
              <option value="2024-1">1st Semester 2024-2025</option>
              <option value="2023-2">2nd Semester 2023-2024</option>
              <option value="2023-1">1st Semester 2023-2024</option>
            </select>
          </div>
        </div>
        
        <!-- List View Schedule Content -->
        <div v-if="currentView === 'list'" class="schedule-content">
          <div class="schedule-header">
            <div class="header-item">Day</div>
            <div class="header-item">Time Slot</div>
            <div class="header-item">Subject</div>
            <div class="header-item">Section</div>
            <div class="header-item">Room</div>
            <div class="header-item">Instructor</div>
          </div>
          
          <div class="schedule-cards">
            <div 
              v-for="event in paginatedEvents" 
              :key="event.id" 
              class="schedule-card"
            >
            <div class="schedule-item">
              <div class="day">{{ event.day }}{{ event.secondDay ? ` / ${event.secondDay}` : '' }}</div>
              <div class="time-slot">{{ formatEventTime(event.startTime, event.endTime) }}</div>
              <div class="purpose">{{ event.courseName }}</div>
              <div class="section">{{ event.section }}</div>
              <div class="room">{{ event.labRoom }}</div>
              <div class="instructor">{{ event.instructorName }}</div>
            </div>
            </div>
            
            <div v-if="filteredEvents.length === 0" class="empty-schedule">
              <p>No scheduled events.</p>
            </div>
          </div>
        </div>
        
        <!-- Weekly Schedule View -->
        <div v-if="currentView === 'weekly'" class="weekly-schedule-section">
          <!-- Day Filters -->
          <div class="day-filters">
            <div class="filter-label">Filter by Day:</div>
            <div class="day-filter-buttons">
              <button 
                v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']" 
                :key="day" 
                class="day-filter-btn" 
                :class="{ 'active': selectedDayFilter === day }"
                @click="selectDayFilter(day)"
              >
                {{ day }}
              </button>
            </div>
          </div>
          
          <!-- Weekly Schedule Table (by Room) -->
          <div class="weekly-schedule-table-container">
            <table class="weekly-schedule-table">
              <thead>
                <tr>
                  <th class="time-column">Time</th>
                  <th v-for="room in ['L201', 'L202', 'L203', 'L204', 'L205', 'IOT', 'Open Lab']" :key="room">{{ room }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="timeSlot in timeSlots"
                  :key="timeSlot.value"
                  :class="{ 'lunch-row': timeSlot.isLunch }"
                >
                  <td class="time-cell">{{ timeSlot.time }}</td>
                  <td
                    v-for="room in ['L201', 'L202', 'L203', 'L204', 'L205', 'IOT', 'Open Lab']"
                    :key="`${timeSlot.value}-${room}`"
                    :class="{
                      'has-class': getScheduleForTimeSlotAndRoom(timeSlot, room).length > 0
                    }"
                  >
                    <div
                      v-for="schedule in getScheduleForTimeSlotAndRoom(timeSlot, room)"
                      :key="schedule.id"
                      class="class-info regular-schedule"
                    >
                      <!-- Header section with course code -->
                      <div class="booking-header">
                        <div class="status-header course-header">{{ schedule.course_code || schedule.courseCode }}</div>
                      </div>
                      
                      <!-- Section info -->
                      <div class="event-name">{{ schedule.section }}</div>
                      
                      <!-- Other details -->
                      <div class="class-instructor">{{ schedule.instructor || schedule.instructorName }}</div>
                      <div class="day-info">{{ schedule.day }}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Pagination Controls -->
        <div class="pagination" v-if="filteredEvents.length > 0">
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
  </DashboardLayout>
</template>

<script>
import { createClient } from '@supabase/supabase-js';
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const supabaseSchedules = createClient(
  'https://yfiyhsazgjsxjmybsyar.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmaXloc2F6Z2pzeGpteWJzeWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE5MzEsImV4cCI6MjA1ODQ1NzkzMX0.j7oFwaqYvJq45jhPuQBPEtNU-itU-CRleOJcqm1fOOo'
);

export default {
  name: 'AdminSchedule',
  components: {
    DashboardLayout,
    AdminHeader
  },
  data() {
    return {
      searchQuery: '',
      selectedProgram: '',
      selectedYear: '',
      selectedSection: '',
      selectedDay: '',
      selectedTimeOfDay: '',
      dateFilter: 'all',
      selectedSemester: 'current',
      currentPage: 1,
      itemsPerPage: 10,
      scheduleEvents: [], // Dynamically fetched data will be stored here
      isLoading: false,
      currentView: 'list', // Default view is list view
      selectedDayFilter: '', // Default day filter for weekly view
      // Time slots for weekly schedule
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
          isLunch: true,
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
      ]
    }
  },
  
  computed: {
    availableSections() {
      const sections = new Set()
      
      // Filter sections based on program and year if selected
      this.scheduleEvents.forEach(event => {
        if (event.section) {
          const sectionParts = event.section.split('-')
          const program = sectionParts[0]
          const yearSection = sectionParts[1]
          const year = yearSection ? yearSection.charAt(0) : null
          
          // Apply program filter
          if (this.selectedProgram && program !== this.selectedProgram) {
            return
          }
          
          // Apply year filter
          if (this.selectedYear && year !== this.selectedYear) {
            return
          }
          
          sections.add(event.section)
        }
      })
      
      return Array.from(sections).sort()
    },
    filteredEvents() {
  let filtered = [...this.scheduleEvents];

  // Filter by search query
  if (this.searchQuery) {
    const query = this.searchQuery.toLowerCase();
    filtered = filtered.filter(event => {
      return (
        (event.courseName && event.courseName.toLowerCase().includes(query)) ||
        (event.instructorName && event.instructorName.toLowerCase().includes(query)) ||
        (event.section && event.section.toLowerCase().includes(query))
      );
    });
  }

  // Filter by year
  if (this.selectedYear) {
    filtered = filtered.filter(event => {
      if (!event.section) return false;
      const sectionParts = event.section.split('-');
      const yearSection = sectionParts[1];
      return yearSection && yearSection.charAt(0) === this.selectedYear;
    });
  }

  // Filter by section
  if (this.selectedSection) {
    filtered = filtered.filter(event => event.section === this.selectedSection);
  }

  // Filter by day
  if (this.selectedDay) {
    filtered = filtered.filter(event => event.day === this.selectedDay);
  }

  // Filter by time of day
  if (this.selectedTimeOfDay) {
    filtered = filtered.filter(event => {
      const startHour = parseInt(event.startTime.split(':')[0]);

      if (this.selectedTimeOfDay === 'morning') {
        return startHour >= 7 && startHour < 12;
      } else if (this.selectedTimeOfDay === 'afternoon') {
        return startHour >= 12 && startHour < 16;
      }

      return true;
    });
  }

  // Filter by date range
  if (this.dateFilter !== 'all') {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate start of week (Sunday)
    const startOfWeek = new Date(currentYear, currentMonth, currentDate - currentDay);

    // Calculate start of month
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    // Filter based on selected date range
    if (this.dateFilter === 'week') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek;
      });
    } else if (this.dateFilter === 'month') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfMonth;
      });
    } else if (this.dateFilter === 'semester') {
      // Implement semester filtering based on academic calendar
      if (this.selectedSemester === 'current') {
        const semesterStart = new Date('2025-01-01');
        const semesterEnd = new Date('2025-05-31');

        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= semesterStart && eventDate <= semesterEnd;
        });
      }
    }
  }

  // Sort by date and time
  filtered.sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.startTime);
    const dateB = new Date(b.date + 'T' + b.startTime);
    return dateA - dateB;
  });

  return filtered;
},
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredEvents.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage)
    }
  },
  methods: {
    async fetchScheduleEvents() {
    try {
      const { data, error } = await supabaseSchedules
        .from('schedules')
        .select('*'); // Fetch all columns from the schedules table

      if (error) throw error;

      // Map the fetched data to the scheduleEvents array
      this.scheduleEvents = data.map(event => ({
        id: event.id,
        status: event.status,
        classType: event.class_type,
        createdAt: event.created_at,
        updatedAt: event.updated_at,
        day: event.day,
        secondDay: event.second_day,
        labRoom: event.lab_room,
        lab_room: event.lab_room, // Added for compatibility with weekly view
        instructorName: event.instructor_name,
        instructor: event.instructor_name, // Added for compatibility with weekly view
        startTime: event.start_time,
        endTime: event.end_time,
        scheduleTypes: event.schedule_types,
        createdBy: event.created_by,
        semester: event.semester,
        section: event.section,
        courseCode: event.course_code,
        course_code: event.course_code, // Added for compatibility with weekly view
        courseName: event.course_name,
      }));

      console.log('Fetched schedule events:', this.scheduleEvents);
    } catch (error) {
      console.error('Error fetching schedule events:', error.message);
    }
  },
    
    // Method to select day filter for weekly schedule view
    selectDayFilter(day) {
      this.selectedDayFilter = day;
    },
    
    // Method to get schedules for a specific time slot and room in weekly view
    getScheduleForTimeSlotAndRoom(timeSlot, room) {
      if (!Array.isArray(this.scheduleEvents)) {
        return [];
      }
      
      // Filter events for the selected day (if a day filter is applied)
      let filteredEvents = this.scheduleEvents;
      if (this.selectedDayFilter) {
        filteredEvents = filteredEvents.filter(event => event.day === this.selectedDayFilter);
      }
      
      // Filter events for the given room
      const roomEvents = filteredEvents.filter(event => {
        return event.labRoom === room || event.lab_room === room;
      });
      
      // Filter events by time slot
      const eventsInTimeSlot = roomEvents.filter(event => {
        // Ensure we have valid time values
        if (!event.startTime || !event.endTime) {
          return false;
        }
        
        const eventStart = this.convertTimeToMinutes(event.startTime);
        const eventEnd = this.convertTimeToMinutes(event.endTime);
        const slotStart = this.convertTimeToMinutes(timeSlot.value);
        const slotEnd = slotStart + timeSlot.duration;
        
        // Check if the event overlaps with the time slot
        return (eventStart < slotEnd && eventEnd > slotStart);
      });
      
      return eventsInTimeSlot;
    },
    
    
    // Helper method to convert time string to minutes for comparison
    convertTimeToMinutes(timeStr) {
      if (!timeStr) return 0;
      
      // Log the input time string for debugging
      console.log('Converting time:', timeStr);
      
      // Handle different time formats
      let hours, minutes;
      
      // Handle AM/PM format
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
        const isPM = timeStr.toLowerCase().includes('pm');
        // Remove AM/PM and trim
        const cleanTime = timeStr.toLowerCase().replace(/(am|pm)/g, '').trim();
        
        if (cleanTime.includes(':')) {
          [hours, minutes] = cleanTime.split(':').map(Number);
        } else {
          hours = parseInt(cleanTime);
          minutes = 0;
        }
        
        // Adjust for PM
        if (isPM && hours < 12) hours += 12;
        // Adjust for 12 AM
        if (!isPM && hours === 12) hours = 0;
      }
      // Handle 24-hour format with colon
      else if (timeStr.includes(':')) {
        [hours, minutes] = timeStr.split(':').map(Number);
      } 
      // Handle 24-hour format without colon
      else {
        const paddedTime = timeStr.padStart(4, '0');
        hours = parseInt(paddedTime.substring(0, 2));
        minutes = parseInt(paddedTime.substring(2, 4));
      }
      
      const totalMinutes = hours * 60 + minutes;
      console.log(`Converted ${timeStr} to ${totalMinutes} minutes (${hours}h:${minutes}m)`);
      return totalMinutes;
    },
    getDayAbbreviation(dateString) {
      const date = new Date(dateString)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' })
      return day
    },
    
    // Set the day filter to the current day of the week
    setCurrentDayFilter() {
      const today = new Date();
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = daysOfWeek[today.getDay()];
      
      console.log('Setting day filter to current day:', currentDay);
      // Skip Sunday as it's not in our filter options
      if (currentDay !== 'Sunday') {
        this.selectedDayFilter = currentDay;
      } else {
        // Default to Monday if it's Sunday
        this.selectedDayFilter = 'Monday';
      }
    },
    formatEventTime(start, end) {
  // Format time from 24-hour to 12-hour format
  const formatTime = (timeStr) => {
    if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
      // If the time already includes AM/PM, return it as is
      return timeStr;
    }

    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
},
    applyFilters() {
      this.currentPage = 1
    },
    viewEventDetails(event) {
      // Implement view details functionality
      console.log('View details for event:', event)
    }
  },
  mounted() {
    // Fetch data when the component is mounted
    this.fetchScheduleEvents()
      .then(() => {
        console.log('Schedule events loaded:', this.scheduleEvents);
        // Set the day filter to the current day of the week after data is loaded
        this.setCurrentDayFilter();
        // Set the view to weekly schedule when data is loaded
        this.currentView = 'weekly';
      });
  }
}
</script>

<style scoped>
.schedule-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.schedule-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 32px;
  height: 100%;
}

/* View Toggle Styles */
.view-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.toggle-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background-color: #DD3859;
  color: white;
  border-color: #DD3859;
}

.toggle-btn:hover:not(.active) {
  border-color: #DD3859;
  color: #DD3859;
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
  grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 16px;
  background-color:#DD3859;
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
  grid-template-columns: 0.5fr 1fr 2fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.day {
  font-weight: 600;
  color: #DD3859;
}

.time-slot {
  color: #1E293B;
  font-size: 14px;
}

.purpose {
  font-weight: 500;
  color: #1E293B;
}

.section, .room, .instructor {
  color: #64748B;
  font-size: 14px;
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
.search-input {
  padding: 8px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  background-color: white;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 200px;
}

.search-input::placeholder {
  color: #94A3B8; /* Light gray for placeholder text */
}

.search-input:focus {
  outline: none;
  border-color: #DD3859; /* Highlight border on focus */
  box-shadow: 0 0 0 3px rgba(221, 56, 89, 0.2); /* Subtle shadow effect */
  
}

.search-input:hover {
  border-color: #DD3859; /* Highlight border on hover */
}

.page-info {
  font-size: 14px;
  color: #64748B;
}

@media (max-width: 1024px) {
  .schedule-header, .schedule-item {
    grid-template-columns: 0.5fr 1fr 1.5fr 1fr 1fr 1.5fr;
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
  
  .view-toggle {
    flex-direction: column;
  }
}

/* Weekly Schedule View Styles */
.weekly-schedule-section {
  margin-top: 20px;
}

.day-filters {
  margin-bottom: 20px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  margin-bottom: 8px;
}

.day-filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.day-filter-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #E2E8F0;
  background-color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-filter-btn.active {
  background-color: #DD3859;
  color: white;
  border-color: #DD3859;
}

.day-filter-btn:hover:not(.active) {
  border-color: #DD3859;
  color: #DD3859;
}

.weekly-schedule-table-container {
  overflow-x: auto;
  margin-top: 16px;
}

.weekly-schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 4px;
  min-width: 900px;
}

.weekly-schedule-table th {
  background-color: #DD3859;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: 600;
  border-radius: 6px;
}

.weekly-schedule-table .time-column {
  width: 140px;
}

.weekly-schedule-table td {
  height: 80px;
  vertical-align: top;
  border-radius: 6px;
  padding: 6px;
  border: 1px solid #E2E8F0;
  position: relative;
}

.weekly-schedule-table .time-cell {
  background-color: #f8f9fa;
  color: #555;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
}

.weekly-schedule-table td.has-class {
  background-color: #f9f9f9;
}

.weekly-schedule-table tr.lunch-row td {
  background-color: #f5f5f5;
  color: #777;
  font-style: italic;
}

.class-info {
  padding: 6px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
}

.regular-schedule {
  background-color: rgba(221, 56, 89, 0.15);
  color: #333;
  border-left: 4px solid #dd3859;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.regular-schedule:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.booking-header {
  margin-bottom: 0.5rem;
  text-align: center;
}

.status-header {
  font-size: 0.85rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.course-header {
  color: white;
  background-color: #dd3859;
}

.event-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  text-align: center;
}

.class-instructor {
  font-size: 0.75rem;
  opacity: 0.9;
}

.class-room {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 2px;
}
</style>
