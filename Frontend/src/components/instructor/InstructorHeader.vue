<template>
  <div class="dashboard-header">
    <div class="header-content">
      <div class="welcome-section">
        <h1>{{ pageTitle }}</h1>
        <div class="header-date">
          <span>{{ formattedDate }}</span>
          <span class="date-separator">•</span>
          <span>{{ formattedTime }}</span>
        </div>
      </div>
      <div class="user-section">
        <div class="user-dropdown">
          <div class="user-info" @click="toggleDropdown">
            <div class="user-avatar">
              <img v-if="profileImage" :src="profileImage" alt="User Avatar" class="avatar-image">
              <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#DD3859" />
                <path d="M16 16C18.2091 16 20 14.2091 20 12C20 9.79086 18.2091 8 16 8C13.7909 8 12 9.79086 12 12C12 14.2091 13.7909 16 16 16Z" fill="white" />
                <path d="M16 17C12.6863 17 10 19.6863 10 23C10 23.5523 10.4477 24 11 24H21C21.5523 24 22 23.5523 22 23C22 19.6863 19.3137 17 16 17Z" fill="white" />
              </svg>
            </div>
            <div class="user-name">{{ firstName }}</div>
            <div class="dropdown-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <transition name="fade">
            <div class="dropdown-menu" v-show="isDropdownOpen">
              <router-link to="/instructor/account" class="dropdown-item" @click="isDropdownOpen = false">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13 14C13 11.7909 10.7614 10 8 10C5.23858 10 3 11.7909 3 14" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Account</span>
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstructorHeader',
  props: {
    pageTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isDropdownOpen: false,
      userName: 'Instructor',
      profileImage: null,
      currentDate: '',
      currentTime: '',
      firstName: '',
      dateTimeInterval: null
    }
  },
  computed: {
    formattedDate() {
      return this.currentDate
    },
    formattedTime() {
      return this.currentTime
    }
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      this.currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    loadUserData() {
  try {
    const userData = localStorage.getItem('labease_user_data');
    const storedFirstName = localStorage.getItem('firstName');

    console.log('Retrieved firstName from localStorage:', storedFirstName);

    // Assign firstName directly from localStorage or fallback to 'User'
    this.firstName = storedFirstName?.trim() || 'User';

    // Parse userData for additional properties like profileImage
    if (userData) {
      const parsedData = JSON.parse(userData);

      // Assign profileImage if available
      this.profileImage = parsedData.profileImage || parsedData.photoUrl || null;
    }

    console.log('Set firstName in component:', this.firstName);
  } catch (error) {
    console.error('Error loading user data:', error);
    this.firstName = 'User'; // Fallback in case of error
  }
},
    startDateTimeUpdates() {
      // Initial update
      this.updateDateTime()
      // Set up interval
      this.dateTimeInterval = setInterval(this.updateDateTime, 60000)
    },
    closeDropdownOnOutsideClick(event) {
      // Safely check if dropdown should be closed
      if (!this.isDropdownOpen || !event || !event.target) return
      
      try {
        const isClickOutside = !event.target.closest('.user-dropdown')
        if (isClickOutside) {
          this.isDropdownOpen = false
        }
      } catch (error) {
        console.error('Error in dropdown click handler:', error)
        // Safely close dropdown if there's an error
        this.isDropdownOpen = false
      }
    },
    setupEventListeners() {
      // Add event listener for outside clicks
      document.addEventListener('click', this.closeDropdownOnOutsideClick)
    },
    removeEventListeners() {
      // Remove event listener
      document.removeEventListener('click', this.closeDropdownOnOutsideClick)
    }
  },
  created() {
    this.loadUserData()
    this.startDateTimeUpdates()
  },
  mounted() {
    // Setup event listeners after the component is mounted
    this.$nextTick(() => {
      this.setupEventListeners()
    })
  },
  beforeUnmount() {
    // Clear the interval when the component is destroyed
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval)
    }
    
    // Remove event listeners
    this.removeEventListeners()
  },
  watch: {
    // Watch for changes to localStorage (when profile is updated)
    '$route'() {
      this.loadUserData()
    }
  }
}
</script>

<style scoped>
/* Dashboard Header */
.dashboard-header {
  background-color: #FFFFFF;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  margin: 24px;
  padding: 24px;
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.welcome-section h1 {
  color: #99183A;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748B;
  font-size: 14px;
}

.date-separator {
  color: #DD3859;
  font-weight: 600;
}

.user-section {
  position: relative;
}

.user-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(221, 56, 89, 0.05);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.dropdown-icon {
  margin-left: 4px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  min-width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  color: #1E293B;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #F8F9FA;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .user-section {
    align-self: flex-end;
  }
}
</style>
