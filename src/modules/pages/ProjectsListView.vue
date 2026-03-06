<template>
  <div class="projects-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('projects.title') }}</h1>
        <p class="page-subtitle">{{ t('projects.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="openAddModal">{{ t('projects.add') }}</BaseButton>
    </div>

    <div class="filters-bar glass">
      <div class="search-box">
        <BaseInput v-model="searchQuery" :placeholder="t('projects.searchPlaceholder')" class="search-input">
          <template #prefix><IconSearch class="icon-sm" /></template>
        </BaseInput>
      </div>
      <div class="filter-actions">
        <BaseSelect v-model="filterStatus" :options="filterOptions" class="status-select" />
      </div>
    </div>

    <div v-if="projectStore.loading" class="projects-grid">
      <BaseCard v-for="i in 6" :key="`skeleton-${i}`" class="project-card">
        <template #header>
          <div class="card-header-inner">
            <BaseSkeleton width="60%" height="20px" />
            <BaseSkeleton width="50px" height="20px" type="button" />
          </div>
        </template>
        <div class="project-content">
          <BaseSkeleton width="100%" height="40px" class="mb-4" />
          <div class="project-stats">
            <BaseSkeleton v-for="s in 2" :key="s" width="40%" height="30px" />
          </div>
          <BaseSkeleton width="100%" height="20px" />
        </div>
      </BaseCard>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <p>{{ t('projects.empty') }}</p>
      <BaseButton variant="secondary" size="sm" @click="clearFilters">{{ t('projects.clearFilters') }}</BaseButton>
    </div>

    <div v-else class="projects-grid">
      <BaseCard v-for="project in filteredProjects" :key="project.id" class="project-card" :interactive="true" @click="openEditModal(project)">
        <template #header>
          <div class="card-header-inner">
            <h3 class="project-name">{{ project.name }}</h3>
            <BaseBadge :type="getStatusType(project.status)">{{ getStatusLabel(project.status) }}</BaseBadge>
          </div>
        </template>

        <div class="project-content">
          <p class="project-description">{{ project.description || t('dashboard.projects.noDescription') }}</p>
          <div class="project-stats">
            <div class="stat-item">
              <span class="stat-label">{{ t('projects.stats.budget') }}</span>
              <span class="stat-value">{{ formatCurrency(project.budget) }}</span>
            </div>
            <div class="stat-item text-right">
              <span class="stat-label">{{ t('projects.stats.deadline') }}</span>
              <span class="stat-value">{{ project.deadline }}</span>
            </div>
          </div>
          <div class="progress-section">
            <div class="progress-info">
              <span class="progress-label">{{ t('projects.stats.completion') }}</span>
              <span class="progress-percent">{{ project.progress }}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: `${project.progress}%` }" :class="getStatusType(project.status)"></div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="card-footer-inner">
            <span class="footer-hint">{{ t('projects.footerHint') }}</span>
            <div class="mini-actions" @click.stop>
              <button class="mini-btn delete" type="button" @click="confirmDelete(project.id)"><IconTrash /></button>
            </div>
          </div>
        </template>
      </BaseCard>
    </div>

    <DashboardModal v-if="showModal" :title="editingId ? t('projects.modal.edit') : t('projects.modal.add')" @close="closeModal">
      <form @submit.prevent="handleSave" class="project-form">
        <div class="form-grid">
          <BaseInput v-model="formData.name" :label="t('projects.form.name')" placeholder="E.g. Smart City Infrastructure" required class="span-2" />
          <BaseTextarea v-model="formData.description" :label="t('projects.form.description')" placeholder="Detailed description of the project goals..." rows="3" class="span-2" />
          <BaseInput v-model="formData.budget" :label="t('projects.form.budget')" type="number" placeholder="0" required />
          <BaseInput v-model="formData.deadline" :label="t('projects.form.deadline')" type="date" required />
          <BaseSelect v-model="formData.status" :label="t('projects.form.status')" :options="projectStatusOptions" />
          <BaseInput v-model="formData.progress" :label="t('projects.form.progress')" type="number" min="0" max="100" />
        </div>
        <div class="modal-footer">
          <BaseButton variant="ghost" type="button" @click="closeModal">{{ t('common.cancel') }}</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSaving">{{ editingId ? t('projects.modal.update') : t('projects.modal.create') }}</BaseButton>
        </div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useProjectStore } from '@/stores/projects'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import BaseTextarea from '@/ui/base/BaseTextarea.vue'
import BaseSkeleton from '@/ui/base/BaseSkeleton.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'
import IconSearch from '@/ui/icons/IconSearch.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'

const projectStore = useProjectStore()
const { success } = useNotification()
const { t } = useI18n()

const filterOptions = computed(() => [
  { label: t('investors.allStatuses'), value: '' },
  { label: t('projects.status.inProgress'), value: 'inprogress' },
  { label: t('projects.status.planning'), value: 'planning' },
  { label: t('projects.status.completed'), value: 'completed' }
])

const projectStatusOptions = computed(() => [
  { label: t('projects.status.planning'), value: 'planning' },
  { label: t('projects.status.inProgress'), value: 'inprogress' },
  { label: t('projects.status.completed'), value: 'completed' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref(null)
const isSaving = ref(false)
const formData = reactive({ name: '', description: '', status: 'inprogress', progress: 0, budget: 0, deadline: '' })

const filteredProjects = computed(() => projectStore.projects.filter((project) => {
  const query = searchQuery.value.trim().toLowerCase()
  const name = String(project.name || '').toLowerCase()
  const description = String(project.description || '').toLowerCase()
  const matchesSearch = !query || name.includes(query) || description.includes(query)
  const matchesStatus = !filterStatus.value || project.status === filterStatus.value
  return matchesSearch && matchesStatus
}))

const statusTypeMap = {
  completed: 'success',
  inprogress: 'info',
  planning: 'warning'
}

const getStatusType = (status) => statusTypeMap[status] || 'default'
const getStatusLabel = (status) => t(`projects.status.${status === 'inprogress' ? 'inProgress' : status}`)
const formatCurrency = (value) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(Number(value) || 0)

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
}

const openAddModal = () => {
  editingId.value = null
  Object.assign(formData, { name: '', description: '', status: 'planning', progress: 0, budget: 0, deadline: '' })
  showModal.value = true
}

const openEditModal = (project) => {
  editingId.value = project.id
  Object.assign(formData, {
    ...project,
    description: project.description || '',
    progress: Number(project.progress) || 0,
    budget: Number(project.budget) || 0
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  isSaving.value = true
  try {
    const payload = {
      ...formData,
      budget: Number(formData.budget) || 0,
      progress: Math.max(0, Math.min(100, Number(formData.progress) || 0)),
      description: String(formData.description || '').trim()
    }

    if (editingId.value) {
      await projectStore.updateProject(editingId.value, payload)
      success(t('common.changesSaved'))
    } else {
      await projectStore.addProject(payload)
      success(t('common.created', { type: t('nav.projects').toLowerCase() }))
    }

    closeModal()
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  projectStore.fetchProjects()
})

const confirmDelete = async (id) => {
  if (!confirm(t('projects.modal.deleteConfirm'))) return
  await projectStore.deleteProject(id)
  success(t('common.removed'))
}
</script>

<style scoped>
.projects-page { padding: var(--space-xl); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
.page-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
.page-subtitle { color: var(--text-muted); font-weight: 600; }
.filters-bar { display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); padding: var(--space-md); border-radius: var(--radius-lg); }
.search-box { flex: 1; }
.status-select { width: 200px; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--space-xl); }
.project-card :deep(.card-body) { padding-top: var(--space-md); }
.card-header-inner { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; gap: 12px; }
.project-name { font-size: 18px; font-weight: 800; color: var(--text-main); }
.project-description { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: var(--space-lg); display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 44px; }
.project-stats { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); padding: var(--space-md); background: var(--bg-main); border-radius: var(--radius-md); margin-bottom: var(--space-lg); }
.stat-item { display: flex; flex-direction: column; }
.stat-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
.stat-value { font-size: 14px; font-weight: 800; color: var(--text-main); }
.progress-section { display: flex; flex-direction: column; gap: 8px; }
.progress-info { display: flex; justify-content: space-between; align-items: flex-end; }
.progress-label { font-size: 12px; font-weight: 700; color: var(--text-muted); }
.progress-percent { font-size: 15px; font-weight: 800; color: var(--primary); }
.progress-bar-bg { height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden; }
.progress-bar-fill { height: 100%; border-radius: inherit; transition: width 0.3s ease; }
.progress-bar-fill.success { background: var(--success); }
.progress-bar-fill.info { background: var(--primary); }
.progress-bar-fill.warning { background: var(--warning); }
.card-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.footer-hint { color: var(--text-muted); font-size: 12px; font-weight: 700; }
.mini-actions { display: flex; gap: 8px; }
.mini-btn { width: 32px; height: 32px; border: none; border-radius: var(--radius-sm); background: var(--bg-main); color: var(--text-muted); display: grid; place-items: center; cursor: pointer; }
.mini-btn.delete:hover { color: var(--danger); }
.project-form { padding: var(--space-lg); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }
.span-2 { grid-column: span 2; }
.modal-footer { display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-xl); }
.empty-state { text-align: center; padding: 80px 24px; color: var(--text-muted); }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
@media (max-width: 768px) { .page-header, .filters-bar { flex-direction: column; } .status-select, .form-grid { width: 100%; grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } }
</style>
