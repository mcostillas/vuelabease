/* eslint-disable */
<template>
  <DashboardLayout>
    <AdminHeader pageTitle="User Management" />
    <div class="users-container">
      <div class="users-section">
        <!-- Filters -->
        <div class="filters">
          <div class="filter-group">
            <label for="status-filter">Status:</label>
            <select id="status-filter" v-model="selectedStatus" @change="applyFilters">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="search-group">
            <label for="search">Search:</label>
            <div class="search-input-container">
              <input 
                type="text" 
                id="search" 
                v-model="searchQuery" 
                placeholder="Search by name or email"
                @input="applyFilters"
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <button class="add-user-btn" @click="showAddUserModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Add User
          </button>
        </div>
        
        <!-- Users Content -->
        <div class="users-content">
          <div class="users-header">
            <div class="header-item">Name</div>
            <div class="header-item">Email</div>
            <div class="header-item">Role</div>
            <div class="header-item">Department</div>
            <div class="header-item">Status</div>
            <div class="header-item">Actions</div>
          </div>
          
          <div class="users-cards">
            <div 
              v-for="user in paginatedUsers" 
              :key="user.id" 
              class="user-card"
            >
              <div class="user-item">
                <div class="user-name">
                  <span>{{ user.fullname }}</span>
                </div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ capitalizeFirstLetter(user.usertype) }}</div>
                <div class="user-department">{{ user.department }}</div>
                <div class="user-status">
                  <span class="status-badge" :class="user.status">
                    {{ capitalizeFirstLetter(user.status) }}
                  </span>
                </div>
                <div class="actions">
                  <button class="action-btn edit-btn" @click="editUser(user)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn toggle-btn" @click="toggleUserStatus(user)">
                    <svg v-if="user.status === 'active'" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" @click="confirmDeleteUser(user)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-if="filteredUsers.length === 0" class="empty-users">
              <p>No users found.</p>
            </div>
          </div>
        </div>
        
        <!-- Pagination Controls -->
        <div class="pagination" v-if="filteredUsers.length > 0">
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
    
    <!-- Add/Edit User Modal -->
    <Modal 
      :show="showAddUserModal || showEditUserModal" 
      :title="showEditUserModal ? 'Edit User' : 'Add New User'" 
      @close="closeUserModal"
      :showFooter="false"
    >
      <form @submit.prevent="showEditUserModal ? updateUser() : addUser()" class="user-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" v-model="userForm.fullname" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userForm.email" required />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" v-model="userForm.usertype" required>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <div class="form-group">
          <label for="department">Department</label>
          <select id="department" v-model="userForm.department" required>
            <option value="College of Accounting and Business Education">College of Accounting and Business Education</option>
            <option value="College of Arts and Humanities">College of Arts and Humanities</option>
            <option value="College of Computer Studies">College of Computer Studies</option>
            <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
            <option value="College of Human Environmental Science and Food Studies">College of Human Environmental Science and Food Studies</option>
            <option value="College of Medical and Biological Sciences">College of Medical and Biological Sciences</option>
            <option value="College of Music">College of Music</option>
            <option value="College of Nursing">College of Nursing</option>
            <option value="College of Pharmacy and Chemistry">College of Pharmacy and Chemistry</option>
            <option value="College of Teacher Education">College of Teacher Education</option>
          </select>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="userForm.password" :required="!showEditUserModal" />
          <small v-if="showEditUserModal">Leave blank to keep current password</small>
        </div>
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="userForm.status" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">{{ showEditUserModal ? 'Update' : 'Add' }} User</button>
        </div>
      </form>
    </Modal>
    
    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="Confirm Delete" 
      @close="showDeleteModal = false"
      :showFooter="false"
    >
      <div class="confirm-delete">
        <p>Are you sure you want to delete the user <strong>{{ userToDelete?.fullname }}</strong>?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
          <button type="button" class="delete-btn" @click="deleteUser">Delete</button>
        </div>
      </div>
    </Modal>
    
    <!-- Update Success Modal -->
    <Modal 
      :show="showUpdateSuccessModal" 
      title="Update Successful" 
      @close="showUpdateSuccessModal = false"
      :showFooter="false"
      :close-on-overlay-click="false"
    >
      <div class="success-message">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="success-icon">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="checkmark" d="M22 4L12 14.01L9 11.01" stroke="#DD3859" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>User information has been successfully updated.</p>
        <p>Thank you for using LabEase.</p>
      </div>
    </Modal>
  </DashboardLayout>
</template>

<script>
import { ref, reactive, computed } from "vue"; // Import Composition API functions
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import Modal from "@/components/ui/Modal.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

export default {
  name: "AdminUserManagement",
  components: {
    DashboardLayout,
    Modal,
    AdminHeader,
  },
  setup() {
    // Reactive variables
    const users = ref([]); // Reactive array for users
    const userForm = reactive({
  userid: null, // Primary key
  fullname: "",
  email: "",
  password: "",
  department: "College of Accounting and Business Education",
  usertype: "student",
  status: "active",
});
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const showAddUserModal = ref(false);
    const showEditUserModal = ref(false);
    const showDeleteModal = ref(false);
    const showUpdateSuccessModal = ref(false);
    const userToDelete = ref(null);
    const selectedRole = ref("");
    const selectedStatus = ref("");
    const searchQuery = ref("");

    // Computed properties
    const filteredUsers = computed(() => {
      let filtered = [...users.value];

      // Filter by role
      if (selectedRole.value) {
        filtered = filtered.filter((user) => user.usertype === selectedRole.value);
      }

      // Filter by status
      if (selectedStatus.value) {
        filtered = filtered.filter((user) => user.status === selectedStatus.value);
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.fullname.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      return filtered;
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredUsers.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
    });

    // Methods
    const fetchUsers = async () => {
  try {
    const { data, error } = await supabase.from("user").select("*");
    if (error) throw error;
    users.value = data; // Assign the fetched data to the reactive `users` variable
  } catch (error) {
    console.error("Error fetching users:", error.message);
  }
};

    const applyFilters = () => {
      currentPage.value = 1;
    };

    const capitalizeFirstLetter = (string) => {
      if (!string || typeof string !== "string") {
        return ""; // Return an empty string if the input is undefined or not a string
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const editUser = (user) => {
      Object.assign(userForm, { ...user, password: "" }); // Load user data into the form
      showEditUserModal.value = true;
    };

    const closeUserModal = () => {
      showAddUserModal.value = false;
      showEditUserModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      Object.assign(userForm, {
        id: null,
        fullname: "",
        email: "",
        usertype: "student",
        department: "College of Accounting and Business Education",
        status: "active",
        password: "",
      });
    };

    const addUser = async () => {
  try {
    const { data, error } = await supabase.from("user").insert([
      {
        fullname: userForm.fullname,
        email: userForm.email,
        password: userForm.password,
        department: userForm.department,
        usertype: userForm.usertype,
        status: userForm.status,
      },
    ]);
    if (error) throw error;

    users.value.push(data[0]); // Add the new user to the local array
    closeUserModal();
  } catch (error) {
    console.error("Error adding user:", error.message);
  }
};

const updateUser = async () => {
  try {
    const updatedUser = { ...userForm };

    // Capitalize the first letter of usertype
    updatedUser.usertype = updatedUser.usertype.charAt(0).toUpperCase() + updatedUser.usertype.slice(1).toLowerCase();

    // Check if password is being updated
    const isPasswordUpdate = !!updatedUser.password;
    
    // If password is not being updated, remove it from the update object
    if (!isPasswordUpdate) {
      delete updatedUser.password;
    }

    // Update user in the custom user table
    const { error } = await supabase
      .from("user")
      .update({
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        password: updatedUser.password, // This will be undefined if not updating
        department: updatedUser.department,
        usertype: updatedUser.usertype, // Ensure this is capitalized
        status: updatedUser.status,
      })
      .eq("userid", updatedUser.userid); // Use 'userid' as the primary key
    
    if (error) throw error;

    // If password is being updated, we need to handle it differently
    // since we can't directly update auth passwords from client-side
    if (isPasswordUpdate) {
      // Create a notification for the admin to know that the auth password needs to be reset
      const passwordUpdateNotification = {
        type: 'password_update',
        userid: updatedUser.userid,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        timestamp: new Date().toISOString(),
        status: 'pending',
        message: `Password for user ${updatedUser.fullname} has been updated in the user table. The user will need to use the 'Forgot Password' feature to reset their Supabase auth password.`
      };
      
      // Get existing notifications
      let notifications = [];
      try {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          notifications = JSON.parse(storedNotifications);
        }
      } catch (e) {
        console.error('Error parsing notifications from localStorage:', e);
      }
      
      // Add the new notification
      notifications.push(passwordUpdateNotification);
      
      // Save back to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (e) {
        console.error('Error saving notifications to localStorage:', e);
      }
    }

    // Update the local users array
    const index = users.value.findIndex((user) => user.userid === updatedUser.userid);
    if (index !== -1) {
      users.value.splice(index, 1, updatedUser); // Use updatedUser directly
    }
    closeUserModal();
    
    // Show success modal after update
    showUpdateSuccessModal.value = true;
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

const deleteUser = async () => {
  try {
    if (userToDelete.value) {
      const { error } = await supabase
        .from("user")
        .delete()
        .eq("userid", userToDelete.value.userid); // Use 'userid' as the primary key
      if (error) throw error;

      // Remove the user from the local array
      users.value = users.value.filter((user) => user.userid !== userToDelete.value.userid);
      showDeleteModal.value = false;
      userToDelete.value = null;
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
  }
};

    const confirmDeleteUser = (user) => {
      userToDelete.value = user;
      showDeleteModal.value = true;
    };

    const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("user")
      .update({ status: newStatus })
      .eq("userid", user.userid); // Use 'userid' as the primary key
    if (error) throw error;

    // Update the local users array
    const index = users.value.findIndex((u) => u.userid === user.userid);
    if (index !== -1) {
      users.value[index].status = newStatus;
    }
  } catch (error) {
    console.error("Error toggling user status:", error.message);
  }
};

    // Fetch users on component creation
    fetchUsers();

    return {
      users,
      userForm,
      currentPage,
      itemsPerPage,
      showAddUserModal,
      showEditUserModal,
      showDeleteModal,
      showUpdateSuccessModal,
      userToDelete,
      selectedRole,
      selectedStatus,
      searchQuery,
      filteredUsers,
      paginatedUsers,
      totalPages,
      fetchUsers,
      applyFilters,
      capitalizeFirstLetter,
      editUser,
      closeUserModal,
      resetForm,
      addUser,
      updateUser,
      deleteUser,
      confirmDeleteUser,
      toggleUserStatus,
    };
  },
};
</script>

<style scoped>
.users-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
}

.success-icon {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.success-message {
  text-align: center;
}

.form-actions.center {
  justify-content: center;
}

.ok-btn {
  background-color: #22c55e;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ok-btn:hover {
  background-color: #16a34a;
}

.users-section {
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
  align-items: flex-end;
}

.filter-group, .search-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
}

.filter-group label, .search-group label {
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

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-container input {
  padding: 8px 12px 8px 36px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

.search-input-container input:focus {
  outline: none;
  border-color: #DD3859;
}

.search-input-container svg {
  position: absolute;
  left: 12px;
  color: #64748B;
}

.add-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  font-family: 'Poppins', sans-serif;
}

.add-user-btn:hover {
  background-color: #C8314F;
}

.users-content {
  margin-top: 24px;
}

.users-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1.5fr 1fr 1fr;
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

.users-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.user-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.user-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1.5fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #1E293B;
}

.user-email, .user-role, .user-department {
  color: #64748B;
  font-size: 14px;
}

.user-status {
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

.status-badge.active {
  background-color: #10B981;
}

.status-badge.inactive {
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

.edit-btn {
  color: #3B82F6;
  border-color: #3B82F6;
}

.edit-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.toggle-btn {
  color: #10B981;
  border-color: #10B981;
}

.toggle-btn:hover {
  background-color: rgba(16, 185, 129, 0.1);
}

.delete-btn {
  color: #EF4444;
  border-color: #EF4444;
}

.delete-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.empty-users {
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

/* Modal Form Styles */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
}

.form-group input, .form-group select {
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  color: #1E293B;
  font-family: 'Poppins', sans-serif;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #DD3859;
}

.form-group small {
  font-size: 12px;
  color: #64748B;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: white;
  color: #64748B;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.cancel-btn:hover {
  background-color: #F8FAFC;
  color: #1E293B;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #DD3859;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.submit-btn:hover {
  background-color: #C8314F;
}

.confirm-delete {
  padding: 16px 0;
  text-align: center;
}

.confirm-delete p {
  margin-bottom: 16px;
  color: #1E293B;
}

.confirm-delete .warning {
  color: #EF4444;
  font-weight: 500;
  margin-bottom: 24px;
}

.confirm-delete .form-actions {
  justify-content: center;
}

.confirm-delete .delete-btn {
  background-color: #EF4444;
  color: white;
  border: none;
  width: auto;
  height: auto;
  padding: 8px 16px;
}

.confirm-delete .delete-btn:hover {
  background-color: #DC2626;
}

@media (max-width: 1024px) {
  .users-header, .user-item {
    grid-template-columns: 2fr 2fr 1fr 1.5fr 1fr 1fr;
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
  margin: 0 auto 1rem auto;
  display: block;
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

/* Responsive Styles */
@media (max-width: 768px) {
  .users-container {
    padding: 16px;
  }
  
  .users-section {
    padding: 16px;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group, .search-group {
    width: 100%;
  }
  
  .add-user-btn {
    margin-left: 0;
    justify-content: center;
  }
  
  .users-header {
    display: none;
  }
  
  .user-item {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .user-name {
    font-size: 16px;
  }
  
  .user-email, .user-role, .user-department {
    padding-left: 48px;
  }
  
  .user-status {
    padding-left: 48px;
  }
  
  .actions {
    padding-left: 48px;
  }
}
</style>
