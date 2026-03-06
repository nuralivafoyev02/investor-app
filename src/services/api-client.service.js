import { appConfig } from '@/config/app.config'

class ApiClient {
  async request(path, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), appConfig.apiTimeoutMs)

    const headers = {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(appConfig.apiToken ? { Authorization: `Bearer ${appConfig.apiToken}` } : {}),
      ...(appConfig.apiKey ? { 'x-api-key': appConfig.apiKey } : {}),
      ...(options.headers || {})
    }

    try {
      const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
        ...options,
        headers,
        signal: controller.signal
      })

      const contentType = response.headers.get('content-type') || ''
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      if (!response.ok) {
        const message = typeof payload === 'object' && payload?.message
          ? payload.message
          : `API request failed with status ${response.status}`
        throw new Error(message)
      }

      return payload
    } finally {
      clearTimeout(timeoutId)
    }
  }

  get(path) {
    return this.request(path, { method: 'GET' })
  }

  post(path, body) {
    return this.request(path, { method: 'POST', body: JSON.stringify(body) })
  }

  put(path, body) {
    return this.request(path, { method: 'PUT', body: JSON.stringify(body) })
  }

  delete(path) {
    return this.request(path, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
