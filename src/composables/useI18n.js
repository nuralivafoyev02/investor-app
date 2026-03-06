import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import en from '@/locales/en.json'
import uz from '@/locales/uz.json'

const messages = { en, uz }

function resolveMessage(locale, key) {
  const keys = key.split('.')
  let value = messages[locale] || messages.en

  for (const segment of keys) {
    if (value && typeof value === 'object' && segment in value) {
      value = value[segment]
    } else {
      const fallback = keys.reduce((acc, current) => {
        if (acc && typeof acc === 'object' && current in acc) return acc[current]
        return null
      }, messages.en)
      return fallback ?? key
    }
  }

  return value
}

function interpolate(template, params = {}) {
  if (typeof template !== 'string') return template

  return template.replace(/\{(\w+)\}/g, (_, token) => {
    const value = params[token]
    return value === undefined || value === null ? `{${token}}` : String(value)
  })
}

export function useI18n() {
  const settingsStore = useSettingsStore()

  const locale = computed({
    get: () => settingsStore.currentLanguage,
    set: (newLocale) => {
      if (messages[newLocale]) {
        settingsStore.updateSystem({ language: newLocale })
      }
    }
  })

  const t = (key, params = {}) => {
    const value = resolveMessage(locale.value, key)
    return interpolate(value, params)
  }

  const setLocale = (newLocale) => {
    locale.value = newLocale
  }

  return {
    t,
    locale,
    setLocale,
    availableLocales: Object.keys(messages)
  }
}
