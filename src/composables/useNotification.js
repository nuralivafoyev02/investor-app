import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  function notify(message, type = 'info', title = '', duration = 3000) {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type, // success, error, warning, info
      title,
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
      }, duration)
    }

    return id
  }

  function success(message, title = '') {
    return notify(message, 'success', title)
  }

  function error(message, title = 'Xatolik') {
    return notify(message, 'error', title)
  }

  function warning(message, title = '') {
    return notify(message, 'warning', title)
  }

  function info(message, title = '') {
    return notify(message, 'info', title)
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function clear() {
    notifications.value = []
  }

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    remove,
    clear,
  }
}
