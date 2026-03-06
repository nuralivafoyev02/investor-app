import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export const useInvestorStore = defineStore('investors', () => {
  const { investors: api, isLoading } = useApi()
  const investors = ref([])

  const fetchInvestors = async () => {
    investors.value = await api.getAll()
  }

  const addInvestor = async (investor) => {
    const newInv = await api.create(investor)
    investors.value.unshift(newInv)
  }

  const updateInvestor = async (id, updatedData) => {
    const updated = await api.update(id, updatedData)
    const index = investors.value.findIndex((item) => String(item.id) === String(id))
    if (index !== -1) {
      investors.value[index] = updated
    }
  }

  const deleteInvestor = async (id) => {
    await api.delete(id)
    investors.value = investors.value.filter((item) => String(item.id) !== String(id))
  }

  const getInvestorById = (id) => investors.value.find((item) => String(item.id) === String(id))

  return {
    investors,
    loading: isLoading,
    fetchInvestors,
    addInvestor,
    updateInvestor,
    deleteInvestor,
    getInvestorById
  }
})
