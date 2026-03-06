<template>
  <div class="settings-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Personalize your experience and security protocols</p>
      </div>
      <BaseButton variant="primary" size="md" @click="saveAll">
        Save All Changes
      </BaseButton>
    </div>

    <div class="settings-grid">
      <div class="settings-sidebar">
        <nav class="settings-nav glass">
          <button 
            v-for="s in sections" 
            :key="s.id"
            class="nav-tab"
            :class="{ active: activeSection === s.id }"
            @click="activeSection = s.id"
          >
            {{ t(`settings.tabs.${s.id}`) }}
          </button>
        </nav>
      </div>

      <div class="settings-main">
        <transition name="fade-section" mode="out-in">
          <div :key="activeSection" class="section-content">
            <!-- Profile Section -->
            <div v-if="activeSection === 'profile'" class="settings-card glass">
              <h2 class="card-title">Identity Credentials</h2>
              <div class="form-grid">
                <BaseInput v-model="store.settings.profile.fullName" label="Full Professional Name" />
                <BaseInput v-model="store.settings.profile.email" label="Verified Email Address" type="email" />
                <BaseInput v-model="store.settings.profile.phone" label="Contact Mobile" type="tel" />
              </div>
            </div>

            <!-- Preferences Section -->
            <div v-if="activeSection === 'preferences'" class="settings-card glass">
              <h2 class="card-title">{{ t('settings.preferences.title') }}</h2>
              <div class="preferences-list">
                <div class="preference-group">
                  <div class="pref-info">
                    <span class="pref-label">{{ t('settings.preferences.theme') }}</span>
                    <span class="pref-desc">{{ t('settings.preferences.themeDesc') }}</span>
                  </div>
                  <div class="theme-switch-pills">
                    <button 
                      class="pill-btn" 
                      :class="{ active: theme === 'light' }"
                      @click="applyTheme('light')"
                    >
                      {{ t('settings.preferences.light') }}
                    </button>
                    <button 
                      class="pill-btn" 
                      :class="{ active: theme === 'dark' }"
                      @click="applyTheme('dark')"
                    >
                      {{ t('settings.preferences.dark') }}
                    </button>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="preference-group">
                  <div class="pref-info">
                    <span class="pref-label">{{ t('settings.preferences.language') }}</span>
                    <span class="pref-desc">{{ t('settings.preferences.languageDesc') }}</span>
                  </div>
                  <div class="lang-selector">
                    <button 
                      v-for="l in availableLocales" 
                      :key="l" 
                      class="lang-pill"
                      :class="{ active: locale === l }"
                      @click="setLocale(l)"
                    >
                      {{ l.toUpperCase() }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Section -->

            <!-- Security Section -->
            <div v-if="activeSection === 'security'" class="settings-card glass">
              <h2 class="card-title">Security Governance</h2>
              <div class="action-list">
                <div class="action-row">
                  <div class="action-info">
                    <span class="action-label">Multi-Factor Authentication</span>
                    <span class="action-desc">Add an extra layer of security to your account.</span>
                  </div>
                  <BaseButton variant="secondary" size="sm">Configure</BaseButton>
                </div>
                <div class="action-row">
                  <div class="action-info">
                    <span class="action-label">Change Master Key</span>
                    <span class="action-desc">Update your authentication password.</span>
                  </div>
                  <BaseButton variant="secondary" size="sm">Reset</BaseButton>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div v-if="activeSection === 'danger'" class="settings-card danger glass">
              <h2 class="card-title">Terminal Actions</h2>
              <div class="action-list">
                <div class="action-row">
                  <div class="action-info">
                    <span class="action-label">De-authenticate</span>
                    <span class="action-desc">Immediately end your current session.</span>
                  </div>
                  <BaseButton variant="danger" size="sm" @click="handleLogout">Logout</BaseButton>
                </div>
                <div class="action-row">
                  <div class="action-info">
                    <span class="action-label">Wipe Local Storage</span>
                    <span class="action-desc">Clear all cached data and resets the app.</span>
                  </div>
                  <BaseButton variant="danger" size="sm" @click="handleWipe">Wipe Data</BaseButton>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useNotification } from '@/composables/useNotification'

// Components
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'

const router = useRouter()
const store = useSettingsStore()
const { success, warning } = useNotification()

const activeSection = ref('profile')
const sections = [
  { id: 'profile', label: 'Identity' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'notifications', label: 'Alerts' },
  { id: 'security', label: 'Security' },
  { id: 'danger', label: 'Governance' },
]

import { useI18n } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'

const { t, locale, setLocale, availableLocales } = useI18n()
const { theme, applyTheme } = useTheme()

const saveAll = () => {
  store.updateProfile(store.settings.profile)
  store.updateNotifications(store.settings.notifications)
  success('System configuration synchronized')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
  warning('Session terminated safely')
}

const handleWipe = () => {
  if (confirm('Irreversible Action: Are you sure you want to wipe all local data?')) {
    localStorage.clear()
    router.push('/auth/login')
    warning('Application environment reset')
  }
}
</script>

<style scoped>
.settings-page {
  padding: var(--space-xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xxl);
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.settings-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-xxl);
  align-items: flex-start;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-md);
  border-radius: var(--radius-lg);
}

.nav-tab {
  text-align: left;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: var(--trans-fast);
}

.nav-tab:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.nav-tab.active {
  background: var(--primary);
  color: #fff;
}

.settings-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
}

.settings-card.danger {
  border: 1px solid #fee2e2;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: var(--space-xl);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

.toggle-list, .action-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.toggle-item, .action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-info, .action-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-label, .action-label {
  font-weight: 800;
  font-size: 15px;
}

.toggle-desc, .action-desc {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.preference-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pref-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pref-label {
  font-weight: 800;
  font-size: 15px;
}

.pref-desc {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.theme-switch-pills, .lang-selector {
  display: flex;
  gap: 8px;
  background: var(--bg-soft);
  padding: 4px;
  border-radius: var(--radius-md);
}

.pill-btn, .lang-pill {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: var(--trans-fast);
}

.pill-btn.active, .lang-pill.active {
  background: var(--bg-card);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.divider {
  height: 1px;
  background: var(--border-light);
}

.base-toggle {
  width: 44px;
  height: 24px;
  cursor: pointer;
}

/* Transitions */
.fade-section-enter-active,
.fade-section-leave-active {
  transition: all 0.3s ease;
}

.fade-section-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-section-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
  }
  
  .page-header :deep(.btn-base) {
    width: 100%;
  }
}
</style>