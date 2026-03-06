import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import en from '@/locales/en.json'
import uz from '@/locales/uz.json'

const messages = { en, uz }

export function useI18n() {
    const settingsStore = useSettingsStore()
    const locale = ref(settingsStore.settings.system.language || 'en')

    const t = (key) => {
        const keys = key.split('.')
        let value = messages[locale.value]

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k]
            } else {
                return key // Fallback to key if not found
            }
        }
        return value
    }

    const setLocale = (newLocale) => {
        if (messages[newLocale]) {
            locale.value = newLocale
            settingsStore.updateSystem({ language: newLocale })
        }
    }

    return {
        t,
        locale,
        setLocale,
        availableLocales: ['en', 'uz']
    }
}
