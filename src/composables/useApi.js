import { ref } from 'vue'
import { investorService } from '@/services/investor.service'
import { projectService } from '@/services/project.service'
import { expenseService, financeService } from '@/services/finance.service'
import { useNotification } from './useNotification'

export function useApi() {
  const isLoading = ref(false)
  const notification = useNotification()

  const handleRequest = async (promise) => {
    isLoading.value = true
    try {
      return await promise
    } catch (error) {
      notification.error(error.message || 'Operation failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    investors: {
      getAll: () => handleRequest(investorService.findMany()),
      create: (data) => handleRequest(investorService.create(data)),
      update: (id, data) => handleRequest(investorService.update(id, data)),
      delete: (id) => handleRequest(investorService.delete(id))
    },
    projects: {
      getAll: () => handleRequest(projectService.findMany()),
      create: (data) => handleRequest(projectService.create(data)),
      update: (id, data) => handleRequest(projectService.update(id, data)),
      delete: (id) => handleRequest(projectService.delete(id))
    },
    finance: {
      getCashboxes: () => handleRequest(financeService.findMany()),
      createCashbox: (data) => handleRequest(financeService.create(data)),
      deleteCashbox: (id) => handleRequest(financeService.delete(id)),
      addTransaction: (id, data) => handleRequest(financeService.addTransaction(id, data)),
      getExpenses: () => handleRequest(expenseService.findMany()),
      createExpense: (data) => handleRequest(expenseService.create(data)),
      deleteExpense: (id) => handleRequest(expenseService.delete(id))
    }
  }
}
