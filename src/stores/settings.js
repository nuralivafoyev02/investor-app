import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'app-settings'

const defaultSettings = {
  profile: {
    fullName: '',
    email: 'admin@example.com',
    phone: '+998 90 123 45 67',
    avatar: 'AD'
  },
  notifications: {
    email: true,
    sms: false,
    browser: true
  },
  system: {
    language: 'uz',
    theme: 'light',
    currency: 'UZS'
  }
}

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaultSettings))
}

function mergeWithDefaults(value) {
  const fresh = cloneDefaults()
  if (!value || typeof value !== 'object') return fresh

  return {
    profile: { ...fresh.profile, ...(value.profile || {}) },
    notifications: { ...fresh.notifications, ...(value.notifications || {}) },
    system: { ...fresh.system, ...(value.system || {}) }
  }
}

function safeReadLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return mergeWithDefaults(raw ? JSON.parse(raw) : null)
  } catch {
    return cloneDefaults()
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive(safeReadLocalStorage())

  const saveToLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  const hydrate = () => {
    const fresh = safeReadLocalStorage()
    Object.assign(settings.profile, fresh.profile)
    Object.assign(settings.notifications, fresh.notifications)
    Object.assign(settings.system, fresh.system)
  }

  const updateProfile = (profileData) => {
    Object.assign(settings.profile, profileData)
    saveToLocal()
  }

  const updateNotifications = (notifData) => {
    Object.assign(settings.notifications, notifData)
    saveToLocal()
  }

  const updateSystem = (systemData) => {
    Object.assign(settings.system, systemData)
    saveToLocal()
  }

  const resetAll = () => {
    const fresh = cloneDefaults()
    Object.assign(settings.profile, fresh.profile)
    Object.assign(settings.notifications, fresh.notifications)
    Object.assign(settings.system, fresh.system)
    saveToLocal()
  }

  const currentLanguage = computed(() => settings.system.language || 'en')
  const currentTheme = computed(() => settings.system.theme || 'light')

  return {
    settings,
    currentLanguage,
    currentTheme,
    hydrate,
    saveToLocal,
    updateProfile,
    updateNotifications,
    updateSystem,
    resetAll
  }
})
