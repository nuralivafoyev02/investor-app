import './styles/main.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router/index.js'
import { useSettingsStore } from '@/stores/settings'

  ; (function bootstrapAppearance() {
    try {
      const settings = JSON.parse(localStorage.getItem('app-settings') || '{}')
      const theme = settings?.system?.theme || 'light'
      const language = settings?.system?.language || 'en'
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.lang = language
    } catch {
      document.documentElement.setAttribute('data-theme', 'light')
      document.documentElement.lang = 'en'
    }
  })()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const settingsStore = useSettingsStore()
settingsStore.hydrate()

document.documentElement.setAttribute('data-theme', settingsStore.currentTheme)
document.documentElement.lang = settingsStore.currentLanguage

watch(
  () => settingsStore.currentTheme,
  (theme) => {
    document.documentElement.setAttribute('data-theme', theme || 'light')
  },
  { immediate: true }
)

watch(
  () => settingsStore.currentLanguage,
  (language) => {
    document.documentElement.lang = language || 'en'
  },
  { immediate: true }
)

app.use(router)
app.mount('#app')
