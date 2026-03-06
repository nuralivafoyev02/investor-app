import { reactive } from 'vue'

const state = reactive({
  notifications: []
})

export const useNotification = () => {
  const add = (type, message, title = '') => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    state.notifications.push({ id, type, message, title })

    setTimeout(() => {
      remove(id)
    }, 5000)
  }

  const success = (message, title = 'Success') => add('success', message, title)
  const error = (message, title = 'Error') => add('error', message, title)
  const warning = (message, title = 'Warning') => add('warning', message, title)
  const info = (message, title = 'Info') => add('info', message, title)
  const notify = (message, type = 'info', title = '') => add(type, message, title)

  const remove = (id) => {
    const index = state.notifications.findIndex((notification) => notification.id === id)
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
    notify,
    remove
  }
}
