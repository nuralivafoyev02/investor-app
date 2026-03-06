<template>
  <div class="main-layout">
    <button v-if="isMobile" class="mobile-toggle" type="button" @click="sidebarOpen = true">☰</button>
    <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="closeSidebar"></div>

    <aside class="sidebar glass" :class="{ open: sidebarOpen || !isMobile }">
      <div class="logo-wrap">
        <span class="logo-text">{{ t('system.titles.app') }}</span>
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
            <span>{{ t('integrations.click.title') }}</span>
          </RouterLink>
          <RouterLink to="/uyqur" class="nav-link" @click="closeSidebar">
            <IconPlug class="nav-icon" />
            <span>{{ t('integrations.uyqur.title') }}</span>
          </RouterLink>
          <RouterLink to="/monetary" class="nav-link" @click="closeSidebar">
            <IconPlug class="nav-icon" />
            <span>{{ t('integrations.monetary.title') }}</span>
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
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import IconDashboard from '@/ui/icons/IconDashboard.vue'
import IconInvestors from '@/ui/icons/IconInvestors.vue'
import IconBriefcase from '@/ui/icons/IconBriefcase.vue'
import IconWallet from '@/ui/icons/IconWallet.vue'
import IconCurrency from '@/ui/icons/IconCurrency.vue'
import IconChart from '@/ui/icons/IconChart.vue'
import IconPlug from '@/ui/icons/IconPlug.vue'
import IconSettings from '@/ui/icons/IconSettings.vue'

const { t } = useI18n()
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
.main-layout { display: flex; min-height: 100vh; background-color: var(--bg-main); }
.mobile-toggle { display: none; }
.sidebar { width: 280px; background: var(--bg-card); border-right: 1px solid var(--border-light); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 100; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.logo-wrap { text-align: center; width: 100%; color: var(--primary); padding: 20px 40px; }
.logo-text { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
.sidebar-nav { flex: 1; padding: 0 var(--space-md) var(--space-lg); overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
.nav-section { display: flex; flex-direction: column; gap: 4px; }
.nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-md); color: var(--text-muted); font-weight: 600; font-size: 14px; transition: var(--trans-fast); text-decoration: none; }
.nav-link:hover { background: var(--bg-main); color: var(--primary); }
.nav-link.router-link-exact-active { background: var(--primary); color: var(--text-on-primary); box-shadow: var(--shadow-sm); }
.nav-icon { width: 20px; height: 20px; }
.nav-divider { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; padding: 24px 16px 8px; opacity: 0.5; }
.page-wrapper { flex: 1; min-width: 0; }
.main-content { min-height: 100vh; }
@media (max-width: 1024px) {
  .mobile-toggle { display: grid; place-items: center; position: fixed; top: 16px; left: 16px; width: 42px; height: 42px; border: 1px solid var(--border-light); background: var(--bg-card); border-radius: 50%; z-index: 120; box-shadow: var(--shadow-md); }
  .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.35); z-index: 90; }
  .sidebar { position: fixed; left: 0; transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
}
</style>
