<template>
  <div class="settings-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('settings.title') }}</h1>
        <p class="page-subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="saveAll">{{ t('settings.actions.saveAll') }}</BaseButton>
    </div>

    <div class="settings-grid">
      <div class="settings-sidebar">
        <nav class="settings-nav glass">
          <button v-for="section in sections" :key="section.id" class="nav-tab"
            :class="{ active: activeSection === section.id }" @click="activeSection = section.id">
            {{ t(`settings.tabs.${section.id}`) }}
          </button>
        </nav>
      </div>

      <div class="settings-main">
        <transition name="fade-section" mode="out-in">
          <div :key="activeSection" class="section-content">
            <div v-if="activeSection === 'profile'" class="settings-card glass">
              <h2 class="card-title">{{ t('settings.sections.profileTitle') }}</h2>
              <div class="form-grid">
                <BaseInput v-model="store.settings.profile.fullName" :label="t('settings.sections.profileName')" />
                <BaseInput v-model="store.settings.profile.email" :label="t('settings.sections.profileEmail')"
                  type="email" />
                <BaseInput v-model="store.settings.profile.phone" :label="t('settings.sections.profilePhone')"
                  type="tel" />
              </div>
            </div>

            <div v-if="activeSection === 'preferences'" class="settings-card glass">
              <h2 class="card-title">{{ t('settings.preferences.title') }}</h2>
              <div class="preferences-list">
                <div class="preference-group">
                  <div class="pref-info">
                    <span class="pref-label">{{ t('settings.preferences.theme') }}</span>
                    <span class="pref-desc">{{ t('settings.preferences.themeDesc') }}</span>
                  </div>
                  <div class="theme-switch-pills">
                    <button class="pill-btn" :class="{ active: theme === 'light' }" @click="applyTheme('light')">{{
                      t('settings.preferences.light') }}</button>
                    <button class="pill-btn" :class="{ active: theme === 'dark' }" @click="applyTheme('dark')">{{
                      t('settings.preferences.dark') }}</button>
                  </div>
                </div>
                <div class="divider"></div>
                <div class="preference-group">
                  <div class="pref-info">
                    <span class="pref-label">{{ t('settings.preferences.language') }}</span>
                    <span class="pref-desc">{{ t('settings.preferences.languageDesc') }}</span>
                  </div>
                  <div class="lang-selector">
                    <button v-for="language in availableLocales" :key="language" class="lang-pill"
                      :class="{ active: locale === language }" @click="setLocale(language)">{{ language.toUpperCase()
                      }}</button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'notifications'" class="settings-card glass">
              <h2 class="card-title">{{ t('settings.sections.notificationsTitle') }}</h2>
              <div class="action-list">
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.emailNotifications')
                      }}</span><span class="action-desc">{{ t('settings.sections.emailNotificationsDesc') }}</span>
                  </div>
                  <BaseButton variant="secondary" size="sm">{{ t('settings.actions.configure') }}</BaseButton>
                </div>
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.pushNotifications')
                      }}</span><span class="action-desc">{{ t('settings.sections.pushNotificationsDesc') }}</span></div>
                  <BaseButton variant="secondary" size="sm">{{ t('settings.actions.configure') }}</BaseButton>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'security'" class="settings-card glass">
              <h2 class="card-title">{{ t('settings.sections.securityTitle') }}</h2>
              <div class="action-list">
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.multiFactor')
                      }}</span><span class="action-desc">{{ t('settings.sections.multiFactorDesc') }}</span></div>
                  <BaseButton variant="secondary" size="sm">{{ t('settings.actions.configure') }}</BaseButton>
                </div>
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.changePassword')
                      }}</span><span class="action-desc">{{ t('settings.sections.changePasswordDesc') }}</span></div>
                  <BaseButton variant="secondary" size="sm">{{ t('settings.actions.reset') }}</BaseButton>
                </div>
              </div>
            </div>

            <div v-if="activeSection === 'danger'" class="settings-card danger glass">
              <h2 class="card-title">{{ t('settings.sections.dangerTitle') }}</h2>
              <div class="action-list">
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.logout') }}</span><span
                      class="action-desc">{{ t('settings.sections.logoutDesc') }}</span></div>
                  <BaseButton variant="danger" size="sm" @click="handleLogout">{{ t('settings.actions.logout') }}
                  </BaseButton>
                </div>
                <div class="action-row">
                  <div class="action-info"><span class="action-label">{{ t('settings.sections.wipe') }}</span><span
                      class="action-desc">{{ t('settings.sections.wipeDesc') }}</span></div>
                  <BaseButton variant="danger" size="sm" @click="handleWipe">{{ t('settings.actions.wipe') }}
                  </BaseButton>
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
import { useI18n } from '@/composables/useI18n'
import { useTheme } from '@/composables/useTheme'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'

const router = useRouter()
const store = useSettingsStore()
const { success, warning } = useNotification()
const { t, locale, setLocale, availableLocales } = useI18n()
const { theme, applyTheme } = useTheme()

const activeSection = ref('profile')
const sections = [
  { id: 'profile' },
  { id: 'preferences' },
  { id: 'notifications' },
  { id: 'security' },
  { id: 'danger' },
]

const saveAll = () => {
  store.updateProfile(store.settings.profile)
  store.updateNotifications(store.settings.notifications)
  success(t('common.changesSaved'))
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
  warning(t('settings.actions.logout'))
}

const handleWipe = () => {
  if (!confirm(t('settings.actions.wipeConfirm'))) return
  localStorage.clear()
  store.resetAll()
  router.push('/auth/login')
  warning(t('settings.actions.wipe'))
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

.page-subtitle {
  color: var(--text-muted);
  font-weight: 600;
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
  border: 1px solid var(--border-light);
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
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.preferences-list,
.action-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.preference-group,
.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);
}

.pref-info,
.action-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pref-label,
.action-label {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
}

.pref-desc,
.action-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.theme-switch-pills,
.lang-selector {
  display: flex;
  gap: 8px;
}

.pill-btn,
.lang-pill {
  padding: 10px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: var(--bg-main);
  cursor: pointer;
  font-weight: 700;
}

.pill-btn.active,
.lang-pill.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.divider {
  height: 1px;
  background: var(--border-light);
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {

  .page-header,
  .preference-group,
  .action-row,
  .form-grid {
    flex-direction: column;
    align-items: flex-start;
    grid-template-columns: 1fr;
  }
}
</style>
