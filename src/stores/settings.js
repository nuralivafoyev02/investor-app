import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const settings = reactive(JSON.parse(localStorage.getItem('app-settings')) || {
        profile: {
            fullName: 'Admin Portfolio Manager',
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
            language: 'en',
            theme: 'light',
            currency: 'UZS'
        }
    })

    const saveToLocal = () => {
        localStorage.setItem('app-settings', JSON.stringify(settings))
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

    return {
        settings,
        updateProfile,
        updateNotifications,
        updateSystem
    }
})
