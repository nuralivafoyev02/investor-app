import { investorService } from '@/services/investor.service'
import { projectService } from '@/services/project.service'
import { financeService } from '@/services/finance.service'

/**
 * useApi remains as a convenient aggregator and loading state manager
 * but delegates all logic to specialized services.
 */
import { ref } from 'vue'
import { useNotification } from './useNotification'

export function useApi() {
  const isLoading = ref(false)
  const notification = useNotification()

  const handleRequest = async (promise, successMsg = '') => {
    isLoading.value = true
    try {
      const result = await promise
      if (successMsg) notification.success(successMsg)
      return result
    } catch (err) {
      notification.error(err.message || 'Operation failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    investors: {
      getAll: () => handleRequest(investorService.findMany()),
      create: (data) => handleRequest(investorService.create(data), 'Investor registered'),
      update: (id, data) => handleRequest(investorService.update(id, data), 'Investor updated'),
      delete: (id) => handleRequest(investorService.delete(id), 'Investor removed'),
    },
    projects: {
      getAll: () => handleRequest(projectService.findMany()),
      create: (data) => handleRequest(projectService.create(data), 'Project created'),
      update: (id, data) => handleRequest(projectService.update(id, data), 'Project updated'),
      delete: (id) => handleRequest(projectService.delete(id), 'Project removed'),
    },
    finance: {
      getCashboxes: () => handleRequest(financeService.findMany()),
      createCashbox: (data) => handleRequest(financeService.create(data), 'Cashbox created'),
      deleteCashbox: (id) => handleRequest(financeService.delete(id), 'Cashbox removed'),
      addTransaction: (id, data) => handleRequest(financeService.addTransaction(id, data), 'Transaction logged'),
    }
  }
}
