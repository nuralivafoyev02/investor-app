import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useTheme() {
  const settingsStore = useSettingsStore()

  const applyTheme = (newTheme) => {
    const normalizedTheme = newTheme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', normalizedTheme)
    settingsStore.updateSystem({ theme: normalizedTheme })
  }

  const theme = computed({
    get: () => settingsStore.currentTheme,
    set: (newTheme) => applyTheme(newTheme)
  })

  const toggleTheme = () => {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    toggleTheme,
    applyTheme
  }
}
