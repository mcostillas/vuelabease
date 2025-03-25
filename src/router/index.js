import { createRouter, createWebHistory } from 'vue-router'

// Import views
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import SignupPage from '../views/SignupPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import InstructorDashboard from '../views/instructor/InstructorDashboard.vue'
import InstructorNotifications from '../views/instructor/InstructorNotifications.vue'
import InstructorSchedule from '../views/instructor/InstructorSchedule.vue'
import InstructorHistory from '../views/instructor/InstructorHistory.vue'
import AccountPage from '../views/instructor/AccountPage.vue'
// Admin imports
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminNotifications from '../views/admin/AdminNotifications.vue'
import AdminLogbook from '../views/admin/AdminLogbook.vue'
import AdminSchedule from '../views/admin/AdminSchedule.vue'
import AdminBookings from '../views/admin/AdminBookings.vue'
import AdminUserManagement from '../views/admin/AdminUserManagement.vue'
import AdminAccountPage from '../views/admin/AdminAccountPage.vue'
import AdminReports from '../views/admin/AdminReports.vue'
import BookingForm from '../views/BookingForm.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'SignupPage',
    component: SignupPage
  },
  {
    path: '/forgot-password',
    name: 'ForgotPasswordPage',
    component: ForgotPasswordPage
  },
  {
    path: '/booking',
    name: 'BookingForm',
    component: BookingForm
  },
  {
    path: '/instructor/dashboard',
    name: 'InstructorDashboard',
    component: InstructorDashboard,
    meta: { requiresAuth: true, role: 'instructor' }
  },
  {
    path: '/instructor/notifications',
    name: 'InstructorNotifications',
    component: InstructorNotifications,
    meta: { requiresAuth: true, role: 'instructor' }
  },
  {
    path: '/instructor/schedule',
    name: 'InstructorSchedule',
    component: InstructorSchedule,
    meta: { requiresAuth: true, role: 'instructor' }
  },
  {
    path: '/instructor/history',
    name: 'InstructorHistory',
    component: InstructorHistory,
    meta: { requiresAuth: true, role: 'instructor' }
  },
  {
    path: '/instructor/account',
    name: 'InstructorAccount',
    component: AccountPage,
    meta: { requiresAuth: true, role: 'instructor' }
  },
  // Admin routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/notifications',
    name: 'AdminNotifications',
    component: AdminNotifications,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/logbook',
    name: 'AdminLogbook',
    component: AdminLogbook,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/schedule',
    name: 'AdminSchedule',
    component: AdminSchedule,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: AdminBookings,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'AdminUserManagement',
    component: AdminUserManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: AdminReports,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/account',
    name: 'AdminAccount',
    component: AdminAccountPage,
    meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    const token = localStorage.getItem('labease_auth_token')
    
    if (!token) {
      // Not authenticated, redirect to login
      next({ name: 'LoginPage' })
      return
    }
    
    // Check user role if specified in route meta
    if (to.meta.role) {
      try {
        const userData = JSON.parse(atob(token))
        if (userData.role !== to.meta.role) {
          // Incorrect role, redirect to login
          next({ name: 'LoginPage' })
          return
        }
      } catch (e) {
        // Invalid token, redirect to login
        localStorage.removeItem('labease_auth_token')
        localStorage.removeItem('labease_user_data')
        next({ name: 'LoginPage' })
        return
      }
    }
    
    // Authentication and role check passed
    next()
  } else {
    // Route doesn't require authentication
    next()
  }
})

export default router
