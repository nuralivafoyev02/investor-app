const parseNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const appConfig = {
  appName: 'Investor App',
  apiMode: import.meta.env.VITE_API_MODE || 'hybrid',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com').replace(/\/$/, ''),
  apiTimeoutMs: parseNumber(import.meta.env.VITE_API_TIMEOUT_MS, 10000),
  apiToken: import.meta.env.VITE_API_TOKEN || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
}
