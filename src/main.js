import './styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './app/router/index.js'

    // Simple immediate script to prevent theme flash
    ; (function () {
        const settings = JSON.parse(localStorage.getItem('app-settings'))
        const theme = settings?.system?.theme || 'light'
        document.documentElement.setAttribute('data-theme', theme)
    })()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')