import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export const useFinanceStore = defineStore('finance', () => {
    const { finance: api, isLoading } = useApi()

    const cashboxes = ref([])

    const fetchCashboxes = async () => {
        cashboxes.value = await api.getCashboxes()
    }

    const addCashbox = async (cashbox) => {
        const newCb = await api.createCashbox(cashbox)
        cashboxes.value.push(newCb)
    }

    const deleteCashbox = async (id) => {
        await api.deleteCashbox(id)
        cashboxes.value = cashboxes.value.filter(cb => cb.id !== id)
    }

    const addTransaction = async (cashboxId, transaction) => {
        const updatedCb = await api.addTransaction(cashboxId, transaction)
        const index = cashboxes.value.findIndex(cb => cb.id === cashboxId)
        if (index !== -1) {
            cashboxes.value[index] = updatedCb
        }
    }

    const getAllTransactions = () => {
        return cashboxes.value.flatMap(cb =>
            (cb.transactions || []).map(t => ({ ...t, cashboxName: cb.name }))
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    return {
        cashboxes,
        loading: isLoading,
        fetchCashboxes,
        addCashbox,
        deleteCashbox,
        addTransaction,
        getAllTransactions
    }
})
