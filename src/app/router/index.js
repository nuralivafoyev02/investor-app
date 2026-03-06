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
        meta: { requiresAuth: true, title: 'nav.dashboard' }
      },
      {
        path: 'investors',
        name: 'investors',
        component: () => import('../../modules/pages/InvestorsListView.vue'),
        meta: { requiresAuth: true, title: 'investors.title' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../../modules/pages/ProjectsListView.vue'),
        meta: { requiresAuth: true, title: 'projects.title' }
      },
      {
        path: 'cashboxes',
        name: 'cashboxes',
        component: () => import('../../modules/pages/CashboxesListView.vue'),
        meta: { requiresAuth: true, title: 'finance.vaults.title' }
      },
      {
        path: 'expenses',
        name: 'expenses',
        component: () => import('../../modules/pages/ExpensesListView.vue'),
        meta: { requiresAuth: true, title: 'finance.expenses.title' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../../modules/pages/ReportsView.vue'),
        meta: { requiresAuth: true, title: 'reports.title' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../../modules/settings/SettingsView.vue'),
        meta: { requiresAuth: true, title: 'settings.title' }
      },
      {
        path: 'click-uzbekistan',
        name: 'click-uzbekistan',
        component: () => import('../../modules/integrations/ClickUzbekistan.vue'),
        meta: { requiresAuth: true, title: 'integrations.click.title' }
      },
      {
        path: 'uyqur',
        name: 'uyqur',
        component: () => import('../../modules/integrations/UyqurApp.vue'),
        meta: { requiresAuth: true, title: 'integrations.uyqur.title' }
      },
      {
        path: 'monetary',
        name: 'monetary',
        component: () => import('../../modules/integrations/Monetary.vue'),
        meta: { requiresAuth: true, title: 'integrations.monetary.title' }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../../modules/auth/LoginView.vue'),
        meta: { guestOnly: true, title: 'auth.login.title' }
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../../modules/auth/ForgotPasswordView.vue'),
        meta: { guestOnly: true, title: 'auth.forgot.title' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../../modules/system/NotFoundView.vue'),
    meta: { title: 'system.notFound.title' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token)

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
