import { ref } from 'vue'

export function useApi() {
  const isLoading = ref(false)
  const error = ref(null)

  // Simulated API calls with localStorage fallback
  const api = {
    // Investors
    getInvestors: async () => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const data = localStorage.getItem('investors')
        return data ? JSON.parse(data) : []
      } catch (e) {
        error.value = e.message
        return []
      } finally {
        isLoading.value = false
      }
    },

    createInvestor: async (investor) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const investors = await api.getInvestors()
        const newInvestor = { ...investor, id: 'inv_' + Date.now() }
        investors.unshift(newInvestor)
        localStorage.setItem('investors', JSON.stringify(investors))
        return newInvestor
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    updateInvestor: async (id, investor) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const investors = await api.getInvestors()
        const index = investors.findIndex(i => i.id === id)
        if (index !== -1) {
          investors[index] = { ...investors[index], ...investor }
          localStorage.setItem('investors', JSON.stringify(investors))
          return investors[index]
        }
        throw new Error('Investor topilmadi')
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    deleteInvestor: async (id) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const investors = await api.getInvestors()
        const filtered = investors.filter(i => i.id !== id)
        localStorage.setItem('investors', JSON.stringify(filtered))
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    // Projects
    getProjects: async () => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const data = localStorage.getItem('projects')
        return data ? JSON.parse(data) : []
      } catch (e) {
        error.value = e.message
        return []
      } finally {
        isLoading.value = false
      }
    },

    createProject: async (project) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const projects = await api.getProjects()
        const newProject = { ...project, id: 'proj_' + Date.now() }
        projects.unshift(newProject)
        localStorage.setItem('projects', JSON.stringify(projects))
        return newProject
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    updateProject: async (id, project) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const projects = await api.getProjects()
        const index = projects.findIndex(p => p.id === id)
        if (index !== -1) {
          projects[index] = { ...projects[index], ...project }
          localStorage.setItem('projects', JSON.stringify(projects))
          return projects[index]
        }
        throw new Error('Loyiha topilmadi')
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    deleteProject: async (id) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const projects = await api.getProjects()
        const filtered = projects.filter(p => p.id !== id)
        localStorage.setItem('projects', JSON.stringify(filtered))
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    // Cashboxes
    getCashboxes: async () => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const data = localStorage.getItem('cashboxes')
        return data ? JSON.parse(data) : []
      } catch (e) {
        error.value = e.message
        return []
      } finally {
        isLoading.value = false
      }
    },

    createCashbox: async (cashbox) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const cashboxes = await api.getCashboxes()
        const newCashbox = { ...cashbox, id: 'cb_' + Date.now(), transactions: [] }
        cashboxes.push(newCashbox)
        localStorage.setItem('cashboxes', JSON.stringify(cashboxes))
        return newCashbox
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    deleteCashbox: async (id) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const cashboxes = await api.getCashboxes()
        const filtered = cashboxes.filter(cb => cb.id !== id)
        localStorage.setItem('cashboxes', JSON.stringify(filtered))
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },

    addTransaction: async (cashboxId, transaction) => {
      isLoading.value = true
      try {
        await new Promise(r => setTimeout(r, 300))
        const cashboxes = await api.getCashboxes()
        const cashbox = cashboxes.find(cb => cb.id === cashboxId)
        if (!cashbox) throw new Error('Kassa topilmadi')

        const newTrans = { ...transaction, id: 'trans_' + Date.now() }
        if (!cashbox.transactions) cashbox.transactions = []
        cashbox.transactions.unshift(newTrans)

        if (transaction.type === 'income') {
          cashbox.balance += transaction.amount
        } else {
          cashbox.balance -= transaction.amount
        }

        localStorage.setItem('cashboxes', JSON.stringify(cashboxes))
        return cashbox
      } catch (e) {
        error.value = e.message
        throw e
      } finally {
        isLoading.value = false
      }
    },
  }

  return { api, isLoading, error }
}
