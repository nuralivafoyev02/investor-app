<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Loyihalar</h1>
        <p class="page-subtitle">{{ projects.length }} ta loyiha</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <span>+</span> Yangi loyiha
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Qidiruv..."
        class="search-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="">Barcha statuslar</option>
        <option value="active">Faol</option>
        <option value="completed">Yakunlangan</option>
        <option value="paused">To'xtatilgan</option>
      </select>
    </div>

    <div v-if="filteredProjects.length === 0" class="empty-state">
      <p>Loyihalar topilmadi</p>
    </div>

    <div v-else class="projects-list">
      <div v-for="project in filteredProjects" :key="project.id" class="project-item">
        <div class="project-left">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-meta">
            <span class="meta-item">👤 {{ project.leader }}</span>
            <span class="meta-item">💰 {{ project.budget }} so'm</span>
            <span class="meta-item">📅 {{ project.startDate }}</span>
          </div>
        </div>
        <div class="project-right">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ project.progress }}% yakunlandi</div>
          <span class="badge" :class="project.status">
            {{ getStatusLabel(project.status) }}
          </span>
          <button @click="deleteProject(project.id)" class="btn-small btn-danger">O'chirish</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" @click.self="closeModal" class="modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ editingId ? 'Loyihani tahrirlash' : 'Yangi loyiha qo\'shish' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveProject" class="form">
          <div class="form-group">
            <label>Loyiha nomi</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Tavsif</label>
            <textarea v-model="formData.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Rahbari</label>
            <input v-model="formData.leader" type="text" required />
          </div>
          <div class="form-group">
            <label>Byudjet (so'm)</label>
            <input v-model.number="formData.budget" type="number" required />
          </div>
          <div class="form-group">
            <label>Boshlanish sanasi</label>
            <input v-model="formData.startDate" type="date" required />
          </div>
          <div class="form-group">
            <label>Progress (%)</label>
            <input v-model.number="formData.progress" type="range" min="0" max="100" />
            <div class="slider-value">{{ formData.progress }}%</div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status">
              <option value="active">Faol</option>
              <option value="completed">Yakunlangan</option>
              <option value="paused">To'xtatilgan</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Bekor qilish</button>
            <button type="submit" class="btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const projects = ref([
  { id: '1', name: 'E-commerce Platform', description: 'Onlayn sotish platformasi', leader: 'Alisher', budget: 50000000, startDate: '2024-01-15', progress: 75, status: 'active' },
  { id: '2', name: 'Mobile App', description: 'Mobil ilova', leader: 'Fatima', budget: 30000000, startDate: '2024-02-01', progress: 45, status: 'active' },
  { id: '3', name: 'Web Design', description: 'Veb-sayt dizayni', leader: 'Ahmad', budget: 15000000, startDate: '2023-12-01', progress: 100, status: 'completed' },
])

const showModal = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')

const formData = reactive({
  name: '',
  description: '',
  leader: '',
  budget: 0,
  startDate: '',
  progress: 0,
  status: 'active',
})

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchSearch = project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value === '' || project.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function getStatusLabel(status) {
  const labels = {
    active: 'Faol',
    completed: 'Yakunlangan',
    paused: 'To\'xtatilgan'
  }
  return labels[status] || status
}

function openAddModal() {
  editingId.value = null
  formData.name = ''
  formData.description = ''
  formData.leader = ''
  formData.budget = 0
  formData.startDate = ''
  formData.progress = 0
  formData.status = 'active'
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveProject() {
  if (editingId.value) {
    const index = projects.value.findIndex(p => p.id === editingId.value)
    if (index !== -1) {
      projects.value[index] = { ...formData, id: editingId.value }
    }
  } else {
    projects.value.push({
      id: 'proj_' + Date.now(),
      ...formData,
    })
  }
  closeModal()
}

function deleteProject(id) {
  projects.value = projects.value.filter(p => p.id !== id)
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px;
}

.page-subtitle {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.btn-primary {
  padding: 10px 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  background: #333;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input,
.filter-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.search-input {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  transition: all 0.2s;
}

.project-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.project-left {
  flex: 1;
}

.project-name {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
}

.project-desc {
  margin: 0 0 10px;
  font-size: 12px;
  color: #666;
}

.project-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.project-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 150px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #22c55e;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #f0f0f0;
}

.badge.active {
  background: #dbeafe;
  color: #0c4a6e;
}

.badge.completed {
  background: #d1f5e0;
  color: #15803d;
}

.badge.paused {
  background: #ffe5e5;
  color: #b42318;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  background: #f5f5f5;
}

.btn-danger {
  color: #b42318;
}

.btn-danger:hover {
  background: #ffe5e5 !important;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 999;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
  font-size: 12px;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #111;
}

.slider-value {
  margin-top: 6px;
  text-align: center;
  font-weight: 700;
  color: #666;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 10px;
}

.btn-secondary {
  padding: 10px 16px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .project-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-right {
    width: 100%;
    align-items: flex-start;
  }

  .progress-bar {
    width: 100%;
  }

  .modal-card {
    width: 95%;
  }
}
</style>