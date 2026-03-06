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
        const newProj = await api.create(project)
        projects.value.unshift(newProj)
    }

    const updateProject = async (id, updatedData) => {
        const updated = await api.update(id, updatedData)
        const index = projects.value.findIndex(p => p.id === id)
        if (index !== -1) {
            projects.value[index] = updated
        }
    }

    const deleteProject = async (id) => {
        await api.delete(id)
        projects.value = projects.value.filter(p => p.id !== id)
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
