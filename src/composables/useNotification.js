import { reactive } from 'vue'

const state = reactive({
  notifications: []
})

export const useNotification = () => {
  const add = (type, message, title = '') => {
    const id = Date.now()
    state.notifications.push({ id, type, message, title })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      remove(id)
    }, 5000)
  }

  const success = (message, title = 'Success') => add('success', message, title)
  const error = (message, title = 'Error') => add('error', message, title)
  const warning = (message, title = 'Warning') => add('warning', message, title)
  const info = (message, title = 'Info') => add('info', message, title)

  const remove = (id) => {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      state.notifications.splice(index, 1)
    }
  }

  return {
    notifications: state.notifications,
    success,
    error,
    warning,
    info,
    remove
  }
}
