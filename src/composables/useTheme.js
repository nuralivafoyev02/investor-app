import { ref, watchEffect } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useTheme() {
    const settingsStore = useSettingsStore()
    const theme = ref(settingsStore.settings.system.theme || 'light')

    // Apply theme to document
    const applyTheme = (newTheme) => {
        document.documentElement.setAttribute('data-theme', newTheme)
        theme.value = newTheme

        // Sync with store
        settingsStore.updateSystem({ theme: newTheme })
    }

    // Initial load logic is usually in main.js or App.vue for flash prevention
    // but we can expose a toggle here
    const toggleTheme = () => {
        const nextTheme = theme.value === 'light' ? 'dark' : 'light'
        applyTheme(nextTheme)
    }

    return {
        theme,
        toggleTheme,
        applyTheme
    }
}
