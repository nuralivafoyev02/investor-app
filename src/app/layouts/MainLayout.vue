<template>
  <div class="main-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar glass" :class="{ collapsed: isSidebarCollapsed }">
      <div class="logo-wrap">
        <span class="logo-text">Investor App</span>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <RouterLink to="/" class="nav-link" @click="closeSidebar">
            <IconDashboard class="nav-icon" />
            <span>{{ t('nav.dashboard') }}</span>
          </RouterLink>
          <RouterLink to="/investors" class="nav-link" @click="closeSidebar">
            <IconInvestors class="nav-icon" />
            <span>{{ t('nav.investors') }}</span>
          </RouterLink>
          <RouterLink to="/projects" class="nav-link" @click="closeSidebar">
            <IconBriefcase class="nav-icon" />
            <span>{{ t('nav.projects') }}</span>
          </RouterLink>
          <RouterLink to="/cashboxes" class="nav-link" @click="closeSidebar">
            <IconWallet class="nav-icon" />
            <span>{{ t('nav.vaults') }}</span>
          </RouterLink>
          <RouterLink to="/expenses" class="nav-link" @click="closeSidebar">
            <IconCurrency class="nav-icon" />
            <span>{{ t('nav.expenses') }}</span>
          </RouterLink>
          <RouterLink to="/reports" class="nav-link" @click="closeSidebar">
            <IconChart class="nav-icon" />
            <span>{{ t('nav.reports') }}</span>
          </RouterLink>
        </div>

        <div class="nav-divider">{{ t('nav.integrations') }}</div>
        
        <div class="nav-section">
          <RouterLink to="/click-uzbekistan" class="nav-link" @click="closeSidebar">
            <IconPlug class="nav-icon" />
            <span>Click Uzbekistan</span>
          </RouterLink>
          <RouterLink to="/uyqur" class="nav-link" @click="closeSidebar">
            <IconPlug class="nav-icon" />
            <span>Uyqur App</span>
          </RouterLink>
          <RouterLink to="/monetary" class="nav-link" @click="closeSidebar">
            <IconPlug class="nav-icon" />
            <span>Monetary</span>
          </RouterLink>
        </div>

        <div class="nav-divider">{{ t('nav.systemTitle') }}</div>

        <div class="nav-section">
          <RouterLink to="/settings" class="nav-link" @click="closeSidebar">
            <IconSettings class="nav-icon" />
            <span>{{ t('nav.settings') }}</span>
          </RouterLink>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="page-wrapper">
      <main class="main-content">
        <RouterView v-slot="{ Component }">
          <transition name="fade-page" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()

// Icons
import IconClose from '@/ui/icons/IconClose.vue'
import IconDashboard from '@/ui/icons/IconDashboard.vue'
import IconInvestors from '@/ui/icons/IconInvestors.vue'
import IconBriefcase from '@/ui/icons/IconBriefcase.vue'
import IconWallet from '@/ui/icons/IconWallet.vue'
import IconCurrency from '@/ui/icons/IconCurrency.vue'
import IconChart from '@/ui/icons/IconChart.vue'
import IconPlug from '@/ui/icons/IconPlug.vue'
import IconSettings from '@/ui/icons/IconSettings.vue'

const sidebarOpen = ref(false)
const isMobile = ref(false)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 1024
  if (!isMobile.value) sidebarOpen.value = false
}

const closeSidebar = () => {
  if (isMobile.value) sidebarOpen.value = false
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-main);
}

.sidebar {
  width: 280px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrap {
  text-align: center;
  width: 100%;
  color: var(--primary);
  padding: 20px 40px;
}
.logo-text {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.close-sidebar-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.sidebar-nav {
  flex: 1;
  padding: 0 var(--space-md);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  transition: var(--trans-fast);
  text-decoration: none;
}

.nav-link:hover {
  background: var(--bg-main);
  color: var(--primary);
}

.nav-link.router-link-exact-active {
  background: var(--primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-sm);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-divider {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 24px 16px 8px;
  opacity: 0.5;
}

.sidebar-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--border-light);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-main);
  border-radius: var(--radius-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--text-on-primary);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.user-role {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
}

.page-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mobile-top-bar {
  height: 64px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  padding: 0 var(--space-md);
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 90;
}

.menu-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--primary);
}

.mobile-logo {
  font-weight: 800;
  font-size: 18px;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--shadow-color);
  backdrop-filter: blur(4px);
  z-index: 95;
}

.main-content {
  padding: 0;
  flex: 1;
}

/* Page Transitions */
.fade-page-enter-active,
.fade-page-leave-active {
  transition: all 0.3s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .close-sidebar-btn {
    display: grid;
    place-items: center;
  }
}
</style>