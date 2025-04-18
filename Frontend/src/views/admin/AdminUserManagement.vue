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
                  <span>{{ user.name }}</span>
                </div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-role">{{ capitalizeFirstLetter(user.role) }}</div>
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
    >
      <form @submit.prevent="showEditUserModal ? updateUser() : addUser()" class="user-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" v-model="userForm.name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="userForm.email" required />
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" v-model="userForm.role" required>
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
          <button type="button" class="cancel-btn" @click="closeUserModal">Cancel</button>
          <button type="submit" class="submit-btn">{{ showEditUserModal ? 'Update' : 'Add' }} User</button>
        </div>
      </form>
    </Modal>
    
    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="showDeleteModal" 
      title="Confirm Delete" 
      @close="showDeleteModal = false"
    >
      <div class="confirm-delete">
        <p>Are you sure you want to delete the user <strong>{{ userToDelete?.name }}</strong>?</p>
        <p class="warning">This action cannot be undone.</p>
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
          <button type="button" class="delete-btn" @click="deleteUser">Delete</button>
        </div>
      </div>
    </Modal>
  </DashboardLayout>
</template>

<script>
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Modal from '@/components/ui/Modal.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';

export default {
  name: 'AdminUserManagement',
  components: {
    DashboardLayout,
    Modal,
    AdminHeader
  },
  data() {
    return {
      // Filters
      selectedRole: '',
      selectedStatus: '',
      searchQuery: '',
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // Modals
      showAddUserModal: false,
      showEditUserModal: false,
      showDeleteModal: false,
      
      // Form data
      userForm: {
        id: null,
        name: '',
        email: '',
        role: 'student',
        department: 'College of Accounting and Business Education',
        status: 'active',
        password: ''
      },
      
      userToDelete: null,
      
      // Sample user data (would come from API in real app)
      users: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          department: 'College of Accounting and Business Education',
          status: 'active'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'instructor',
          department: 'College of Arts and Humanities',
          status: 'active'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'student',
          department: 'College of Computer Studies',
          status: 'active'
        },
        {
          id: 4,
          name: 'Alice Williams',
          email: 'alice.williams@example.com',
          role: 'staff',
          department: 'College of Engineering and Architecture',
          status: 'inactive'
        },
        {
          id: 5,
          name: 'Charlie Brown',
          email: 'charlie.brown@example.com',
          role: 'student',
          department: 'College of Human Environmental Science and Food Studies',
          status: 'active'
        },
        {
          id: 6,
          name: 'Diana Prince',
          email: 'diana.prince@example.com',
          role: 'instructor',
          department: 'College of Medical and Biological Sciences',
          status: 'active'
        },
        {
          id: 7,
          name: 'Edward Clark',
          email: 'edward.clark@example.com',
          role: 'student',
          department: 'College of Music',
          status: 'inactive'
        },
        {
          id: 8,
          name: 'Fiona Green',
          email: 'fiona.green@example.com',
          role: 'admin',
          department: 'College of Nursing',
          status: 'active'
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      let filtered = [...this.users];
      
      // Filter by role
      if (this.selectedRole) {
        filtered = filtered.filter(user => user.role === this.selectedRole);
      }
      
      // Filter by status
      if (this.selectedStatus) {
        filtered = filtered.filter(user => user.status === this.selectedStatus);
      }
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  methods: {
    applyFilters() {
      this.currentPage = 1;
    },
    getInitials(name) {
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    editUser(user) {
      this.userForm = { ...user, password: '' };
      this.showEditUserModal = true;
    },
    closeUserModal() {
      this.showAddUserModal = false;
      this.showEditUserModal = false;
      this.resetForm();
    },
    resetForm() {
      this.userForm = {
        id: null,
        name: '',
        email: '',
        role: 'student',
        department: 'College of Accounting and Business Education',
        status: 'active',
        password: ''
      };
    },
    addUser() {
      // In a real app, this would be an API call
      const newUser = {
        ...this.userForm,
        id: this.users.length + 1
      };
      
      this.users.push(newUser);
      this.closeUserModal();
      // Show success message or notification
    },
    updateUser() {
      // In a real app, this would be an API call
      const index = this.users.findIndex(user => user.id === this.userForm.id);
      if (index !== -1) {
        // If password is empty, don't update it
        const updatedUser = { ...this.userForm };
        if (!updatedUser.password) {
          delete updatedUser.password;
        }
        
        this.users.splice(index, 1, updatedUser);
        this.closeUserModal();
        // Show success message or notification
      }
    },
    toggleUserStatus(user) {
      // In a real app, this would be an API call
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        const updatedUser = { ...user };
        updatedUser.status = user.status === 'active' ? 'inactive' : 'active';
        this.users.splice(index, 1, updatedUser);
        // Show success message or notification
      }
    },
    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    deleteUser() {
      // In a real app, this would be an API call
      if (this.userToDelete) {
        this.users = this.users.filter(user => user.id !== this.userToDelete.id);
        this.showDeleteModal = false;
        this.userToDelete = null;
        // Show success message or notification
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 32px;
  min-height: calc(100vh - 80px);
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
