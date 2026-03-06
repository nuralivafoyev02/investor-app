<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Investorlar</h1>
        <p class="page-subtitle">{{ investors.length }} ta investor</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <span>+</span> Yangi investor
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
        <option value="inactive">Nofaol</option>
      </select>
    </div>

    <div v-if="filteredInvestors.length === 0" class="empty-state">
      <p>Investorlar topilmadi</p>
    </div>

    <div v-else class="investors-grid">
      <div v-for="investor in filteredInvestors" :key="investor.id" class="investor-card">
        <div class="card-header">
          <div class="investor-name">{{ investor.name }}</div>
          <button @click="openMenu($event, investor.id)" class="btn-menu">⋮</button>
          <div v-if="activeMenu === investor.id" class="menu-popup">
            <button @click="openEditModal(investor)">Tahrirlash</button>
            <button @click="deleteInvestor(investor.id)" class="btn-danger">O'chirish</button>
          </div>
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ investor.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">Telefon:</span>
            <span class="value">{{ investor.phone }}</span>
          </div>
          <div class="info-row">
            <span class="label">Investitsiya:</span>
            <span class="value amount">{{ investor.amount }} so'm</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="badge" :class="investor.status">
              {{ investor.status === 'active' ? 'Faol' : 'Nofaol' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" @click.self="closeModal" class="modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ editingId ? 'Investorni tahrirlash' : 'Yangi investor qo\'shish' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveInvestor" class="form">
          <div class="form-group">
            <label>Ism Familiya</label>
            <input v-model="formData.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Telefon</label>
            <input v-model="formData.phone" type="tel" required />
          </div>
          <div class="form-group">
            <label>Investitsiya miqdori (so'm)</label>
            <input v-model.number="formData.amount" type="number" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status">
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
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

const investors = ref([
  { id: '1', name: 'Ahmad Karim', email: 'ahmad@example.com', phone: '+998901234567', amount: 5000000, status: 'active' },
  { id: '2', name: 'Fatima Ahmadova', email: 'fatima@example.com', phone: '+998901234568', amount: 3000000, status: 'active' },
  { id: '3', name: 'Alisher Navoi', email: 'alisher@example.com', phone: '+998901234569', amount: 10000000, status: 'inactive' },
])

const showModal = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const activeMenu = ref(null)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  amount: 0,
  status: 'active',
})

const filteredInvestors = computed(() => {
  return investors.value.filter(investor => {
    const matchSearch = investor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                       investor.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = filterStatus.value === '' || investor.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

function openAddModal() {
  editingId.value = null
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.amount = 0
  formData.status = 'active'
  showModal.value = true
}

function openEditModal(investor) {
  editingId.value = investor.id
  formData.name = investor.name
  formData.email = investor.email
  formData.phone = investor.phone
  formData.amount = investor.amount
  formData.status = investor.status
  showModal.value = true
  activeMenu.value = null
}

function closeModal() {
  showModal.value = false
}

function saveInvestor() {
  if (editingId.value) {
    const index = investors.value.findIndex(i => i.id === editingId.value)
    if (index !== -1) {
      investors.value[index] = { ...formData, id: editingId.value }
    }
  } else {
    investors.value.push({
      id: 'inv_' + Date.now(),
      ...formData,
    })
  }
  closeModal()
}

function deleteInvestor(id) {
  investors.value = investors.value.filter(i => i.id !== id)
  activeMenu.value = null
}

function openMenu(event, id) {
  event.stopPropagation()
  activeMenu.value = activeMenu.value === id ? null : id
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

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.investor-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  transition: all 0.2s;
}

.investor-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
}

.investor-name {
  font-weight: 700;
  font-size: 15px;
}

.btn-menu {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.menu-popup {
  position: absolute;
  right: 0;
  top: 24px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 140px;
}

.menu-popup button {
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #111;
}

.menu-popup button:hover {
  background: #f5f5f5;
}

.btn-danger {
  color: #b42318 !important;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.label {
  color: #666;
  font-weight: 600;
}

.value {
  color: #111;
  font-weight: 700;
}

.amount {
  color: #22c55e;
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
  background: #d1f5e0;
  color: #15803d;
}

.badge.inactive {
  background: #ffe5e5;
  color: #b42318;
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
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #111;
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

  .investors-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    width: 95%;
  }
}
</style>