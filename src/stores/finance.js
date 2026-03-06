import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useFinanceStore = defineStore('finance', () => {
  const { finance: api, isLoading } = useApi()

  const cashboxes = ref([])
  const expenses = ref([])

  const fetchCashboxes = async () => {
    cashboxes.value = await api.getCashboxes()
  }

  const addCashbox = async (cashbox) => {
    const newCashbox = await api.createCashbox(cashbox)
    cashboxes.value.unshift(newCashbox)
  }

  const deleteCashbox = async (id) => {
    await api.deleteCashbox(id)
    cashboxes.value = cashboxes.value.filter((item) => String(item.id) !== String(id))
  }

  const addTransaction = async (cashboxId, transaction) => {
    const updatedCashbox = await api.addTransaction(cashboxId, transaction)
    const index = cashboxes.value.findIndex((item) => String(item.id) === String(cashboxId))
    if (index !== -1) {
      cashboxes.value[index] = updatedCashbox
    }
  }

  const fetchExpenses = async () => {
    expenses.value = await api.getExpenses()
  }

  const addExpense = async (expense) => {
    const newExpense = await api.createExpense(expense)
    expenses.value.unshift(newExpense)
  }

  const deleteExpense = async (id) => {
    await api.deleteExpense(id)
    expenses.value = expenses.value.filter((item) => String(item.id) !== String(id))
  }

  const getAllTransactions = () => cashboxes.value
    .flatMap((cashbox) => (cashbox.transactions || []).map((transaction) => ({
      ...transaction,
      cashboxName: cashbox.name
    })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return {
    cashboxes,
    expenses,
    loading: isLoading,
    fetchCashboxes,
    addCashbox,
    deleteCashbox,
    addTransaction,
    fetchExpenses,
    addExpense,
    deleteExpense,
    getAllTransactions
  }
})
