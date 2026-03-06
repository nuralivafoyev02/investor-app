import { appConfig } from '@/config/app.config'
import { apiClient } from './api-client.service'

export class BaseService {
  constructor({ storageKey, endpoint, collectionKey, mapRemoteItem, fallbackFactory }) {
    this.storageKey = storageKey
    this.endpoint = endpoint
    this.collectionKey = collectionKey
    this.mapRemoteItem = mapRemoteItem || ((item) => item)
    this.fallbackFactory = fallbackFactory || (() => [])
    this.delay = 250
  }

  async simulate() {
    return new Promise((resolve) => setTimeout(resolve, this.delay))
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  save(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  getFallbackData() {
    return this.fallbackFactory()
  }

  normalizeRemoteCollection(payload) {
    const collection = this.collectionKey ? payload?.[this.collectionKey] : payload
    if (!Array.isArray(collection)) return []
    return collection.map((item) => this.mapRemoteItem(item)).filter(Boolean)
  }

  async fetchRemoteCollection() {
    if (!this.endpoint) return []
    const payload = await apiClient.get(this.endpoint)
    return this.normalizeRemoteCollection(payload)
  }

  ensureLocalSeed(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.save(data)
      return data
    }

    const fallback = this.getFallbackData()
    this.save(fallback)
    return fallback
  }

  async findMany() {
    const localData = this.getAll()

    if (appConfig.apiMode === 'local') {
      if (localData.length) return localData
      await this.simulate()
      return this.ensureLocalSeed(localData)
    }

    if (appConfig.apiMode === 'hybrid') {
      if (localData.length) return localData

      try {
        const remoteData = await this.fetchRemoteCollection()
        return this.ensureLocalSeed(remoteData)
      } catch {
        await this.simulate()
        return this.ensureLocalSeed(localData)
      }
    }

    try {
      const remoteData = await this.fetchRemoteCollection()
      const nextData = remoteData.length ? remoteData : this.getFallbackData()
      this.save(nextData)
      return nextData
    } catch {
      await this.simulate()
      const fallback = localData.length ? localData : this.getFallbackData()
      this.save(fallback)
      return fallback
    }
  }

  async create(item) {
    await this.simulate()

    const all = this.getAll()
    const newItem = {
      ...item,
      id: item.id || `${this.storageKey.slice(0, 3)}_${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString()
    }

    all.unshift(newItem)
    this.save(all)

    if (appConfig.apiMode === 'remote' && this.endpoint) {
      try {
        await apiClient.post(this.endpoint.replace(/\?.*$/, ''), newItem)
      } catch {
        // Keep app responsive even if test API doesn't persist data.
      }
    }

    return newItem
  }

  async update(id, data) {
    await this.simulate()

    const all = this.getAll()
    const index = all.findIndex((item) => String(item.id) === String(id))

    if (index === -1) {
      throw new Error(`${this.storageKey} not found with ID: ${id}`)
    }

    all[index] = {
      ...all[index],
      ...data,
      updatedAt: new Date().toISOString()
    }

    this.save(all)

    if (appConfig.apiMode === 'remote' && this.endpoint) {
      try {
        await apiClient.put(`${this.endpoint.replace(/\?.*$/, '')}/${id}`, all[index])
      } catch {
        // Ignore remote test API write mismatch, local cache stays source of truth.
      }
    }

    return all[index]
  }

  async delete(id) {
    await this.simulate()

    const all = this.getAll()
    const filtered = all.filter((item) => String(item.id) !== String(id))
    this.save(filtered)

    if (appConfig.apiMode === 'remote' && this.endpoint) {
      try {
        await apiClient.delete(`${this.endpoint.replace(/\?.*$/, '')}/${id}`)
      } catch {
        // Ignore remote test API delete mismatch, local cache stays source of truth.
      }
    }

    return true
  }
}
