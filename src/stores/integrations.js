import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useIntegrationsStore = defineStore('integrations', () => {
    const connections = reactive(JSON.parse(localStorage.getItem('integrations-status')) || {
        click: { connected: false, lastSync: null },
        uyqur: { connected: false, lastSync: null },
        monetary: { connected: false, lastSync: null }
    })

    const saveToLocal = () => {
        localStorage.setItem('integrations-status', JSON.stringify(connections))
    }

    const updateStatus = (key, connected) => {
        if (connections[key]) {
            connections[key].connected = connected
            connections[key].lastSync = new Date().toISOString()
            saveToLocal()
        }
    }

    return {
        connections,
        updateStatus
    }
})
