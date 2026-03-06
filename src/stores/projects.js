import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'

export const useProjectStore = defineStore('projects', () => {
  const { projects: api, isLoading } = useApi()
  const projects = ref([])

  const fetchProjects = async () => {
    projects.value = await api.getAll()
  }

  const addProject = async (project) => {
    const newProject = await api.create(project)
    projects.value.unshift(newProject)
  }

  const updateProject = async (id, updatedData) => {
    const updated = await api.update(id, updatedData)
    const index = projects.value.findIndex((item) => String(item.id) === String(id))
    if (index !== -1) {
      projects.value[index] = updated
    }
  }

  const deleteProject = async (id) => {
    await api.delete(id)
    projects.value = projects.value.filter((item) => String(item.id) !== String(id))
  }

  return {
    projects,
    loading: isLoading,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  }
})
