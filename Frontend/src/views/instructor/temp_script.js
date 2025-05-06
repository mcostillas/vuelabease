// Copy this script section into your InstructorBooking.vue file
// Replace the existing script tag with this complete script

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

export default {
  name: "InstructorBooking",
  components: {
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
      showSuccessModal: false,
      showWeeklyScheduleModal: false,
      
      // Instructor info (auto-filled from localStorage)
      department: "",
      club: "",
      person: "",
      contact: "",
      event: "",
      attendance: "",
      
      // Requester info fields
      requesterType: "instructor", // Default to instructor for this component
      instructorName: "",
      requesterErrorMessage: "",
      
      selectedSectionFilter: "all",
      selectedLabFilter: "all", // Default to showing all labs
      selectedTimeBlock: null,
      selectedDay: null,
      scheduleData: [], // Original schedule data
      pendingBookings: [], // Bookings that are pending approval
      approvedBookings: [], // Bookings that have been approved
      allBookings: [], // Combined pending and approved bookings
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
      
      // Define current semester date range based on actual academic calendar
      currentSemesterStart: "2024-12-10", // First day of current semester (Dec 10, 2024)
      currentSemesterEnd: "2025-04-25", // Last day of current semester (Apr 24, 2025)
      
      facility: "",
      selectedRoom: "",
      startTime: "",
      endTime: "",
      requestDate: null,
      errorMessage: "",
      dateRangeWarning: "",
      
      // Time slots for the weekly schedule
      timeSlots: [
        { time: "7:00 AM - 8:00 AM", value: "07:00", duration: 60, isLunch: false },
        { time: "8:00 AM - 9:00 AM", value: "08:00", duration: 60, isLunch: false },
        { time: "9:00 AM - 10:00 AM", value: "09:00", duration: 60, isLunch: false },
        { time: "10:00 AM - 11:00 AM", value: "10:00", duration: 60, isLunch: false },
        { time: "11:00 AM - 12:00 PM", value: "11:00", duration: 60, isLunch: false },
        { time: "12:00 PM - 1:00 PM", value: "12:00", duration: 60, isLunch: true },
        { time: "1:00 PM - 2:00 PM", value: "13:00", duration: 60, isLunch: false },
        { time: "2:00 PM - 3:00 PM", value: "14:00", duration: 60, isLunch: false },
        { time: "3:00 PM - 4:00 PM", value: "15:00", duration: 60, isLunch: false },
        { time: "4:00 PM - 5:00 PM", value: "16:00", duration: 60, isLunch: false },
        { time: "5:00 PM - 6:00 PM", value: "17:00", duration: 60, isLunch: false },
        { time: "6:00 PM - 7:00 PM", value: "18:00", duration: 60, isLunch: false },
        { time: "7:00 PM - 8:00 PM", value: "19:00", duration: 60, isLunch: false },
      ],
      
      // Available laboratory rooms
      availableRooms: [
        { name: "L201" },
        { name: "L202" },
        { name: "L203" },
        { name: "L204" },
        { name: "L205" },
        { name: "IOT" },
        { name: "Open Lab" },
      ],
      
      // Filtered rooms based on availability
      filteredRooms: [],
      
      // Current date for calendar
      currentDate: new Date(),
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarDays: [],
    };
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentDate).toLocaleString("default", {
        month: "long",
      });
    },
    currentYear() {
      return new Date(this.currentDate).getFullYear();
    },
    filteredWeekDays() {
      // Return Monday to Saturday (exclude Sunday)
      return this.weekDays.slice(1, 7);
    },
  },
  mounted() {
    // Initialize the calendar
    this.generateCalendar();
    // Fetch schedules
    this.fetchSchedules();
    // Fetch all bookings (both pending and approved)
    this.fetchAllBookings();
    // Auto-fill instructor information from localStorage
    this.loadInstructorInfo();
  },
  methods: {
    // Load instructor information from localStorage
    loadInstructorInfo() {
      // Get instructor information from localStorage
      const firstName = localStorage.getItem('firstName') || '';
      const lastName = localStorage.getItem('lastName') || '';
      const email = localStorage.getItem('email') || '';
      
      // Set the instructor information
      this.person = `${firstName} ${lastName}`.trim();
      this.contact = email;
      this.department = 'Faculty'; // Default department for instructors
    },
    
    // Generate the calendar for the current month
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
        const isBeforeSemester = formattedDate < this.currentSemesterStart;
        const isAfterSemester = formattedDate > this.currentSemesterEnd;
        const isPastDate = formattedDate < formattedToday;

        // Determine if the day is available for booking
        const available = !isPastDate && !isBeforeSemester && !isAfterSemester;

        // Create message for tooltip if date is outside semester
        let semesterMessage = "";
        if (isBeforeSemester) {
          semesterMessage = `This date is before the semester start (${this.currentSemesterStart})`;
        } else if (isAfterSemester) {
          semesterMessage = `This date is after the semester end (${this.currentSemesterEnd})`;
        } else if (isPastDate) {
          semesterMessage = "Cannot book past dates";
        }

        this.calendarDays.push({
          date: formattedDate,
          dayNumber: i,
          isToday: formattedDate === formattedToday,
          available,
          isBeforeSemester,
          isAfterSemester,
          isPastDate,
          semesterMessage,
        });
      }
    },
    
    // Navigate to previous month
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
      this.generateCalendar();
    },
    
    // Navigate to next month
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
      this.generateCalendar();
    },
    
    // Select a date from the calendar
    selectDate(day) {
      if (day.isPastDate) {
        this.errorMessage = "Cannot book past dates";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
        return;
      }

      if (day.date) {
        this.requestDate = day.date;

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
      }
    },
    
    // Format date for display
    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    
    // Format date for database comparison (YYYY-MM-DD)
    formatDateForDatabase(date) {
      if (!date) return "";
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    // Convert time to minutes for comparison
    convertTimeToMinutes(time) {
      if (typeof time !== "string") {
        console.error("Invalid time format:", time);
        return 0;
      }

      // Check if the time includes AM/PM
      if (time.includes("AM") || time.includes("PM")) {
        time = this.formatTo24Hour(time); // Convert to 24-hour format
      }

      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },
    
    // Format time to 24-hour format
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
    
    // Get schedules for a specific time slot and day
    getScheduleForTimeSlotAndDay(timeSlot, day) {
      // Initialize empty arrays for schedules and bookings
      const schedulesForSlot = [];
      const bookingsForSlot = [];
      
      // Handle regular schedules (classes)
      if (Array.isArray(this.scheduleData)) {
        // Filter schedules for the given day
        const daySchedules = this.scheduleData.filter(schedule => schedule.day === day);
        
        // Filter by time slot
        for (const schedule of daySchedules) {
          const scheduleStart = this.convertTimeToMinutes(schedule.start_time);
          const scheduleEnd = this.convertTimeToMinutes(schedule.end_time);
          const slotStart = this.convertTimeToMinutes(timeSlot.value);
          
          // Check if the time slot falls within the schedule's time range
          if (slotStart >= scheduleStart && slotStart < scheduleEnd) {
            schedulesForSlot.push(schedule);
          }
        }
      }
      
      // Handle bookings (both pending and approved)
      if (Array.isArray(this.allBookings) && this.allBookings.length > 0 && this.requestDate) {
        // Format the selected date to match the booking date format (YYYY-MM-DD)
        const selectedDateFormatted = this.formatDateForDatabase(this.requestDate);
        
        // Filter bookings for this day AND the specific date
        const dayBookings = this.allBookings.filter(booking => {
          return booking.day === day && booking.requestDate === selectedDateFormatted;
        });
        
        // Filter by time slot
        for (const booking of dayBookings) {
          const bookingStart = this.convertTimeToMinutes(booking.start_time);
          const bookingEnd = this.convertTimeToMinutes(booking.end_time);
          const slotStart = this.convertTimeToMinutes(timeSlot.value);
          
          // Check if the time slot falls within the booking's time range
          if (slotStart >= bookingStart && slotStart < bookingEnd) {
            bookingsForSlot.push(booking);
          }
        }
      }
      
      // Combine regular schedules and bookings
      return [...schedulesForSlot, ...bookingsForSlot];
    },
    
    // Open the booking modal
    openBookingModal() {
      // Ensure we have a selected date before opening the modal
      if (!this.requestDate) {
        this.errorMessage = "Please select a date first";
        return;
      }

      // Set the date in the form to the selected date
      this.dateFilled = this.formatDate(this.requestDate);

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

      // Filter the schedule data for the selected day
      this.filteredScheduleData = this.scheduleData.filter(
        (schedule) => schedule.day === this.selectedDayOfWeek
      );

      // For instructor booking, we don't need the requester modal
      // Just open the booking modal directly
      this.showBookingModal = true;
    },
    
    // Close the booking modal
    closeBookingModal() {
      this.showBookingModal = false;
      this.errorMessage = ""; // Clear any error messages
    },
    
    // Close the success modal
    closeModal() {
      this.showSuccessModal = false;
    },
    
    // Reset the form
    resetForm() {
      this.department = "Faculty"; // Default for instructors
      this.club = "";
      // Don't reset person and contact as they're auto-filled from localStorage
      this.event = "";
      this.attendance = "";
      this.requestDate = "";
      this.startTime = "";
      this.endTime = "";
      this.facility = "";
      this.selectedRoom = "";
      this.errorMessage = "";
      
      // Reset calendar selection
      this.generateCalendar();
      
      // Close modals
      this.showSuccessModal = false;
      this.showBookingModal = false;
    },
    
    // Filter available rooms based on selected date, start time, and end time
    async filterAvailableRooms() {
      if (!this.selectedDayOfWeek || !this.startTime || !this.endTime) {
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

        this.filteredRooms = this.availableRooms.filter((room) => {
          return !unavailableRooms.includes(room.name);
        });
      } catch (error) {
        console.error("Error fetching room schedules:", error.message);
        this.errorMessage = "Failed to fetch room availability.";
      }
    },
    
    // Fetch all schedules
    async fetchSchedules() {
      try {
        const { data, error } = await supabaseSchedules
          .from("schedules")
          .select("*");
        if (error) throw error;

        this.scheduleData = data.map((block) => ({
          ...block,
          day: block.day, // Ensure the day field is included
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
        }));
      } catch (error) {
        console.error("Error fetching schedules:", error.message);
        this.scheduleData = [];
        this.errorMessage = "Failed to fetch schedules.";
      }
    },
    
    // Fetch all bookings (both pending and approved)
    async fetchAllBookings() {
      try {
        // Fetch both pending and approved bookings
        const { data, error } = await supabaseBookings
          .from("bookings")
          .select("*")
          .or('status.eq.pending,status.eq.approved');
        
        if (error) throw error;
        
        // Process the bookings to match the schedule data format
        this.allBookings = data.map(booking => {
          // Convert the booking date to a day of the week
          const bookingDate = new Date(booking.requestDate);
          const daysOfWeek = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
          ];
          const dayOfWeek = daysOfWeek[bookingDate.getDay()];
          
          // Create a formatted booking object with status indicators
          return {
            id: booking.id,
            day: dayOfWeek,
            start_time: booking.startTime,
            end_time: booking.endTime,
            lab_room: booking.selectedRoom,
            section: booking.status === "pending" ? "Pending Review" : "Approved",
            course_code: booking.status === "pending" ? "PENDING" : "APPROVED",
            course_name: booking.event,
            isPending: booking.status === "pending",
            isApproved: booking.status === "approved",
            event: booking.event,
            department: booking.department,
            requestDate: booking.requestDate,
            status: booking.status
          };
        });
        
        // Separate into pending and approved for backward compatibility
        this.pendingBookings = this.allBookings.filter(booking => booking.isPending);
        this.approvedBookings = this.allBookings.filter(booking => booking.isApproved);
        
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
        this.errorMessage = "Failed to fetch bookings.";
      }
    },
    
    // Handle cell click in the weekly schedule
    handleCellClick(timeSlot, day) {
      const hasSchedule = this.getScheduleForTimeSlotAndDay(timeSlot, day).length > 0;

      if (hasSchedule) {
        console.log("This cell already has a schedule and cannot be clicked.");
        return;
      }

      // Set the selected time slot and day
      this.startTime = timeSlot.value;
      
      // Calculate end time (1 hour after start time)
      const startHour = parseInt(timeSlot.value.split(':')[0]);
      const endHour = startHour + 1;
      this.endTime = `${String(endHour).padStart(2, '0')}:00`;
      
      // Open the booking modal
      this.openBookingModal();
    },
    
    // Handle booking submission
    async handleBooking() {
      try {
        // Validate form
        if (!this.event || !this.attendance || !this.selectedRoom) {
          this.errorMessage = "Please fill in all required fields";
          return;
        }
        
        // Create booking data object
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
          dateFilled: new Date().toISOString().substr(0, 10),
          selectedRoom: this.selectedRoom,
          status: "pending",
          notification_sent: false,
        };
        
        // Store instructor information
        const instructorName = localStorage.getItem('firstName') || '';
        const instructorLastName = localStorage.getItem('lastName') || '';
        bookingData.instructor_name = `${instructorName} ${instructorLastName}`.trim();
        
        // Insert the booking into the database
        const { data, error } = await supabaseBookings
          .from("bookings")
          .insert([bookingData]);
          
        if (error) throw error;
        
        // Show success modal
        this.showSuccessModal = true;
        
        // Reset form
        this.resetForm();
      } catch (error) {
        console.error("Error submitting booking:", error.message);
        
        // Provide specific error message
        if (error.message.includes('duplicate key')) {
          this.errorMessage = "You already have a booking for this time slot.";
        } else {
          this.errorMessage = `Failed to submit booking: ${error.message}`;
        }
      }
    },
  }
}
