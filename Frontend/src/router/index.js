import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('@/views/LandingPage.vue'),
  },
  {
    path: '/confirm',
    name: 'ConfirmEmail',
    component: () => import('@/views/ConfirmEmail.vue'),
  },
  {
    path: '/login',
    name: 'LoginPage',
    redirect: '/', // Redirect to landing page since login is now integrated there
  },
  {
    path: '/signup',
    name: 'SignupPage',
    component: () => import('@/views/SignupPage.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPasswordPage',
    component: () => import('@/views/ForgotPasswordPage.vue'),
  },
  {
    path: '/booking',
    name: 'BookingForm',
    component: () => import('@/views/BookingForm.vue'),
  },
  {
    path: '/instructor/dashboard',
    name: 'InstructorDashboard',
    component: () => import('@/views/instructor/InstructorDashboard.vue'),
    meta: { requiresAuth: true, role: 'instructor' },
  },
  {
    path: '/instructor/notifications',
    name: 'InstructorNotifications',
    component: () => import('@/views/instructor/InstructorNotifications.vue'),
    meta: { requiresAuth: true, role: 'Instructor' },
  },
  {
    path: '/instructor/schedule',
    name: 'InstructorSchedule',
    component: () => import('@/views/instructor/InstructorSchedule.vue'),
    meta: { requiresAuth: true, role: 'instructor' },
  },
  {
    path: '/instructor/history',
    name: 'InstructorHistory',
    component: () => import('@/views/instructor/InstructorHistory.vue'),
    meta: { requiresAuth: true, role: 'Instructor' },
  },
  {
    path: '/instructor/account',
    name: 'InstructorAccount',
    component: () => import('@/views/instructor/AccountPage.vue'),
    meta: { requiresAuth: true, role: 'Instructor' },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'Admin' },
  },
  {
    path: '/admin/notifications',
    name: 'AdminNotifications',
    component: () => import('@/views/admin/AdminNotifications.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/logbook',
    name: 'AdminLogbook',
    component: () => import('@/views/admin/AdminLogbook.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/schedule',
    name: 'AdminSchedule',
    component: () => import('@/views/admin/AdminSchedule.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: () => import('@/views/admin/AdminBookings.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/history',
    name: 'AdminHistory',
    component: () => import('@/views/admin/AdminHistory.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/users',
    name: 'AdminUserManagement',
    component: () => import('@/views/admin/AdminUserManagement.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: () => import('@/views/admin/AdminReports.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/account',
    name: 'AdminAccount',
    component: () => import('@/views/admin/AdminAccountPage.vue'),
    meta: { requiresAuth: true, role: 'admin' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;