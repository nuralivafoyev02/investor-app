import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../../modules/pages/DashboardView.vue'),
        meta: { requiresAuth: true, title: 'Dashboard' },
      },
      {
        path: 'investors',
        name: 'investors',
        component: () => import('../../modules/pages/InvestorsListView.vue'),
        meta: { requiresAuth: true, title: 'Investorlar' },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../../modules/pages/ProjectsListView.vue'),
        meta: { requiresAuth: true, title: 'Loyihalar' },
      },
      {
        path: 'cashboxes',
        name: 'cashboxes',
        component: () => import('../../modules/pages/CashboxesListView.vue'),
        meta: { requiresAuth: true, title: 'Kassalar' },
      },
      {
        path: 'expenses',
        name: 'expenses',
        component: () => import('../../modules/pages/ExpensesListView.vue'),
        meta: { requiresAuth: true, title: 'Xarajatlar' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../../modules/pages/ReportsView.vue'),
        meta: { requiresAuth: true, title: 'Hisobotlar' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../../modules/settings/SettingsView.vue'),
        meta: { requiresAuth: true, title: 'Sozlamalar' },
      },
      {
        path: 'click-uzbekistan',
        name: 'click-uzbekistan',
        component: () => import('../../modules/integraions/ClickUzbekistan.vue'),
        meta: { requiresAuth: true, title: 'Click Uzbekistan' },
      },
      {
        path: 'uyqur',
        name: 'uyqur',
        component: () => import('../../modules/integraions/UyqurApp.vue'),
        meta: { requiresAuth: true, title: 'Uyqur App' },
      },
      {
        path: 'monetary',
        name: 'monetary',
        component: () => import('../../modules/integraions/Monetary.vue'),
        meta: { requiresAuth: true, title: 'Monetary' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../../modules/settings/SettingsView.vue'),
        meta: { requiresAuth: true, title: 'Sozlamalar' },
      },
    ],
  },

  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../../modules/auth/LoginView.vue'),
        meta: { guestOnly: true, title: 'Kirish' },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../../modules/auth/ForgotPasswordView.vue'),
        meta: { guestOnly: true, title: 'Parolni tiklash' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    component: () => import('../../modules/system/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'dashboard' }
  }

  if (to.meta.title) {
    document.title = `${to.meta.title} | Investor App`
  } else {
    document.title = 'Investor App'
  }
})

export default router