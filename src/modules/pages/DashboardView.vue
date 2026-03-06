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
      <!-- Left Column: Summary & Chart -->
      <section class="grid-column">
        <DashboardStats 
          :stats="store.state.stats"
          @share="shareReport"
          @more="handleNotify(t('common.moreDetails'))"
          @navigate="handleNavigation"
        />
        
        <DashboardChart 
          :work-data="store.state.week.work"
          :med-data="store.state.week.meditation"
          @randomize="randomizeWeek"
        />
      </section>

      <!-- Right Column: Goals & Progress -->
      <section class="grid-column">
        <DashboardMonthProgress 
          :progress="store.state.monthProgress"
          @analytics="handleNotify(t('common.analyticsView'))"
          @share="shareReport"
          @download="downloadReport"
        />

        <DashboardGoals 
          :goals="store.state.goals"
          @toggle="store.toggleGoal"
          @edit="handleNotify(t('common.goalEditComing'))"
        />
      </section>

      <!-- Bottom Span: Tasks & Projects -->
      <section class="grid-full">
        <DashboardTasks 
          :tasks="topTasks"
          @add="handleCreate('task')"
          @edit="handleEditTask"
          @delete="handleDeleteTask"
          @note="handleAddNote"
        />
      </section>

      <section class="grid-full">
        <DashboardProjects 
          :projects="lastProjects"
          @archive="handleNotify(t('common.archiveViewed'))"
        />
      </section>
    </main>

    <!-- Global Dashboard Modal -->
    <DashboardModal 
      :is-open="modal.isOpen"
      :type="modal.type"
      :mode="modal.mode"
      :initial-data="modal.form"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()

// Components
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

const userName = 'Alexander' // Usually from a user store

onMounted(() => {
  store.load()
})

// Derived Data
const topTasks = computed(() => {
  return store.state.tasks.slice(0, 2).map(t => ({
    ...t,
    typeLabel: t.type.charAt(0).toUpperCase() + t.type.slice(1)
  }))
})

const lastProjects = computed(() => {
  return store.state.projects.slice(0, 3).map(p => ({
    ...p,
    statusLabel: p.status === 'completed' ? t('projects.status.completed') : t('projects.status.inProgress')
  }))
})

// Modal Logic
const modal = reactive({
  isOpen: false,
  type: 'task',
  mode: 'create',
  editingId: null,
  form: {}
})

function handleCreate(type) {
  modal.isOpen = true
  modal.type = type
  modal.mode = 'create'
  modal.form = {}
}

function handleEditTask(id) {
  const task = store.state.tasks.find(t => t.id === id)
  if (task) {
    modal.isOpen = true
    modal.type = 'task'
    modal.mode = 'edit'
    modal.editingId = id
    modal.form = { ...task }
  }
}

function handleModalSubmit(formData) {
  if (modal.mode === 'create') {
    if (modal.type === 'task') {
      store.addTask(formData)
    } else {
      store.addProject(formData)
    }
    success(t('common.created', { type: modal.type }))
  } else {
    // Update logic
    if (modal.type === 'task') {
      const idx = store.state.tasks.findIndex(t => t.id === modal.editingId)
      if (idx !== -1) {
        store.state.tasks[idx] = { ...store.state.tasks[idx], ...formData }
        store.persist()
      }
    }
    success(t('common.changesSaved'))
  }
  closeModal()
}

function closeModal() {
  modal.isOpen = false
}

// Handlers
function handleDeleteTask(id) {
  store.state.tasks = store.state.tasks.filter(t => t.id !== id)
  store.persist()
  success(t('common.removed'))
}

function handleAddNote(id) {
  const note = prompt(t('common.addNote'))
  if (note !== null) {
    const task = store.state.tasks.find(t => t.id === id)
    if (task) {
      task.note = note
      store.persist()
      success(t('common.noteAdded'))
    }
  }
}

function randomizeWeek() {
  store.state.week.work = store.state.week.work.map(() => Math.floor(Math.random() * 40) + 10)
  store.state.week.meditation = store.state.week.meditation.map(() => Math.floor(Math.random() * 20) + 5)
  store.persist()
  notify(t('common.statsRandomized'), 'info')
}

function handleNotify(msg) { notify(msg, 'info') }

function handleNavigation(area) {
  notify(`Navigating to ${area}...`, 'info')
}

function downloadReport() {
  const data = JSON.stringify(store.state, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'investor-report.json'
  a.click()
  success(t('common.reportExported'))
}

async function shareReport() {
  const text = `Dashboard Overview: ${store.state.stats.completed} projects completed!`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Dashboard Report', text })
    } else {
      await navigator.clipboard.writeText(text)
      success(t('common.linkCopied'))
    }
  } catch (err) {
    notify(t('common.shareNotSupported'), 'error')
  }
}
</script>

<style scoped>
.dashboard-page {
  position: relative;
  min-height: 100vh;
  padding: var(--space-lg);
  background-color: var(--bg-main);
  overflow-x: hidden;
}

.ambient-overlay {
  position: absolute;
  inset: 0;
  background: var(--grad-ambient);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

.dashboard-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.grid-full {
  grid-column: 1 / -1;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-page {
    padding: var(--space-md);
  }
}
</style>
