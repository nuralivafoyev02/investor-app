/**
 * Base service class to standardize data access and simulation logic
 */
export class BaseService {
    constructor(storageKey) {
        this.storageKey = storageKey
        this.delay = 400
    }

    async simulate() {
        return new Promise(resolve => setTimeout(resolve, this.delay))
    }

    getAll() {
        const data = localStorage.getItem(this.storageKey)
        return data ? JSON.parse(data) : []
    }

    save(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data))
    }

    async findMany() {
        await this.simulate()
        return this.getAll()
    }

    async create(item) {
        await this.simulate()
        const all = this.getAll()
        const newItem = {
            ...item,
            id: `${this.storageKey.slice(0, 3)}_${Date.now()}`,
            createdAt: new Date().toISOString()
        }
        all.unshift(newItem)
        this.save(all)
        return newItem
    }

    async update(id, data) {
        await this.simulate()
        const all = this.getAll()
        const index = all.findIndex(i => i.id === id)
        if (index !== -1) {
            all[index] = { ...all[index], ...data, updatedAt: new Date().toISOString() }
            this.save(all)
            return all[index]
        }
        throw new Error(`${this.storageKey} not found with ID: ${id}`)
    }

    async delete(id) {
        await this.simulate()
        const all = this.getAll()
        const filtered = all.filter(i => i.id !== id)
        this.save(filtered)
        return true
    }
}
