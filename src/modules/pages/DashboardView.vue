<template>
  <div class="dashboard-page">
    <div class="ambient-overlay" aria-hidden="true"></div>

    <DashboardHeader
      :user-name="userName"
      @create="handleCreate"
      @download="downloadReport"
      @search="handleNotify(t('common.searchComing'))"
      @notifications="handleNotify(t('common.noNotifications'))"
      @profile="handleNotify(t('common.profileDetails'))"
    />

    <main class="dashboard-grid">
      <section class="grid-column">
        <DashboardStats :stats="store.state.stats" @share="shareReport" @more="handleNotify(t('common.moreDetails'))" @navigate="handleNavigation" />
        <DashboardChart :work-data="store.state.week.work" :med-data="store.state.week.meditation" @randomize="randomizeWeek" />
      </section>

      <section class="grid-column">
        <DashboardMonthProgress :progress="store.state.monthProgress" @analytics="handleNotify(t('common.analyticsView'))" @share="shareReport" @download="downloadReport" />
        <DashboardGoals :goals="store.state.goals" @toggle="store.toggleGoal" @edit="handleNotify(t('common.goalEditComing'))" />
      </section>

      <section class="grid-full">
        <DashboardTasks :tasks="topTasks" @add="handleCreate('task')" @edit="handleEditTask" @delete="handleDeleteTask" @note="handleAddNote" />
      </section>

      <section class="grid-full">
        <DashboardProjects :projects="lastProjects" @archive="handleNotify(t('common.archiveViewed'))" />
      </section>
    </main>

    <DashboardModal :is-open="modal.isOpen" :type="modal.type" :mode="modal.mode" :initial-data="modal.form" @close="closeModal" @submit="handleModalSubmit" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
import DashboardHeader from '@/features/dashboard/DashboardHeader.vue'
import DashboardStats from '@/features/dashboard/DashboardStats.vue'
import DashboardChart from '@/features/dashboard/DashboardChart.vue'
import DashboardMonthProgress from '@/features/dashboard/DashboardMonthProgress.vue'
import DashboardGoals from '@/features/dashboard/DashboardGoals.vue'
import DashboardTasks from '@/features/dashboard/DashboardTasks.vue'
import DashboardProjects from '@/features/dashboard/DashboardProjects.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'

const store = useDashboardStore()
const { success, notify } = useNotification()
const { t } = useI18n()

const userName = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.name || 'Investor'
  } catch {
    return 'Investor'
  }
})

const projectStatusLabel = (status) => t(`projects.status.${status === 'inprogress' ? 'inProgress' : status}`)

onMounted(() => {
  store.load()
})

const topTasks = computed(() => store.state.tasks.slice(0, 3).map((task) => ({
  ...task,
  titleLabel: task.titleKey ? t(task.titleKey) : task.title,
  whenLabel: task.whenKey ? t(task.whenKey) : task.when,
  typeLabel: t(`dashboard.modal.options.${task.type}`)
})))

const lastProjects = computed(() => store.state.projects.slice(0, 3).map((project) => ({
  ...project,
  titleLabel: project.titleKey ? t(project.titleKey) : project.title,
  descLabel: project.descKey ? t(project.descKey) : project.desc,
  statusLabel: projectStatusLabel(project.status),
  tagLabel: projectStatusLabel(project.status)
})))

const modal = reactive({ isOpen: false, type: 'task', mode: 'create', editingId: null, form: {} })

function handleCreate(type) {
  modal.isOpen = true
  modal.type = type
  modal.mode = 'create'
  modal.editingId = null
  modal.form = {}
}

function handleEditTask(id) {
  const task = store.state.tasks.find((item) => item.id === id)
  if (!task) return
  modal.isOpen = true
  modal.type = 'task'
  modal.mode = 'edit'
  modal.editingId = id
  modal.form = {
    title: task.titleKey ? t(task.titleKey) : task.title,
    when: task.whenKey ? t(task.whenKey) : task.when,
    type: task.type,
    note: task.note || ''
  }
}

function handleModalSubmit(formData) {
  if (modal.mode === 'create') {
    if (modal.type === 'task') store.addTask(formData)
    else store.addProject(formData)
    success(t('common.created', { type: modal.type }))
  } else if (modal.type === 'task') {
    const index = store.state.tasks.findIndex((item) => item.id === modal.editingId)
    if (index !== -1) {
      store.state.tasks[index] = { ...store.state.tasks[index], ...formData, titleKey: '', whenKey: '' }
      store.persist()
    }
    success(t('common.changesSaved'))
  }
  closeModal()
}

function closeModal() {
  modal.isOpen = false
}

function handleDeleteTask(id) {
  store.state.tasks = store.state.tasks.filter((task) => task.id !== id)
  store.persist()
  success(t('common.removed'))
}

function handleAddNote(id) {
  const note = prompt(t('common.addNote'))
  if (note === null) return
  const task = store.state.tasks.find((item) => item.id === id)
  if (task) {
    task.note = note
    store.persist()
    success(t('common.noteAdded'))
  }
}

function randomizeWeek() {
  store.state.week.work = store.state.week.work.map(() => Math.floor(Math.random() * 40) + 10)
  store.state.week.meditation = store.state.week.meditation.map(() => Math.floor(Math.random() * 20) + 5)
  store.persist()
  notify(t('common.statsRandomized'), 'info')
}

function handleNotify(message) {
  notify(message, 'info')
}

function handleNavigation(area) {
  notify(`${t('common.navigate')}: ${area}`, 'info')
}

function downloadReport() {
  const data = JSON.stringify(store.state, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'investor-dashboard-report.json'
  link.click()
  URL.revokeObjectURL(url)
  success(t('common.reportExported'))
}

async function shareReport() {
  const text = `${t('dashboard.stats.title')}: ${store.state.stats.completed} ${t('projects.status.completed').toLowerCase()}`
  try {
    if (navigator.share) {
      await navigator.share({ title: t('system.titles.app'), text })
    } else {
      await navigator.clipboard.writeText(text)
      success(t('common.linkCopied'))
    }
  } catch {
    notify(t('common.shareNotSupported'), 'error')
  }
}
</script>

<style scoped>
.dashboard-page { position: relative; min-height: 100vh; padding: var(--space-lg); background-color: var(--bg-main); overflow-x: hidden; }
.ambient-overlay { position: absolute; inset: 0; background: var(--grad-ambient); opacity: 0.4; pointer-events: none; z-index: 0; }
.dashboard-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); max-width: 1400px; margin: 0 auto; }
.grid-column { display: flex; flex-direction: column; gap: var(--space-lg); }
.grid-full { grid-column: 1 / -1; }
@media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; } }
</style>
