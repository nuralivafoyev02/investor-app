<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Xarajatlar</h1>
        <p class="page-subtitle">Jami: {{ totalExpenses.toLocaleString('uz-UZ') }} so'm</p>
      </div>
      <button @click="showAddModal = true" class="btn-primary">
        <span>+</span> Yangi xarajat
      </button>
    </div>

    <div class="filters">
      <input v-model="searchQuery" type="text" placeholder="Qidiruv..." class="search-input" />
      <select v-model="selectedCategory" class="filter-select">
        <option value="">Barcha toifalar</option>
        <option value="salary">Ish haqi</option>
        <option value="utility">Kommunal</option>
        <option value="travel">Transport</option>
        <option value="food">Taom</option>
        <option value="other">Boshqa</option>
      </select>
    </div>

    <div class="expenses-list">
      <div v-if="filteredExpenses.length === 0" class="empty-state">
        <p>Xarajatlar topilmadi</p>
      </div>

      <div v-for="expense in filteredExpenses" :key="expense.id" class="expense-item">
        <div class="expense-left">
          <span class="expense-icon">{{ getCategoryIcon(expense.category) }}</span>
          <div class="expense-info">
            <div class="expense-title">{{ expense.title }}</div>
            <div class="expense-date">{{ new Date(expense.date).toLocaleDateString('uz-UZ') }}</div>
          </div>
        </div>
        <div class="expense-right">
          <div class="expense-amount">-{{ expense.amount.toLocaleString('uz-UZ') }} so'm</div>
          <button @click="deleteExpense(expense.id)" class="btn-delete">🗑️</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showAddModal" @click.self="showAddModal = false" class="modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Yangi xarajat qo'shish</h2>
          <button @click="showAddModal = false" class="btn-close">×</button>
        </div>
        <form @submit.prevent="addExpense" class="form">
          <div class="form-group">
            <label>Xarajat nomi</label>
            <input v-model="newExpense.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Toifasi</label>
            <select v-model="newExpense.category" required>
              <option value="salary">Ish haqi</option>
              <option value="utility">Kommunal</option>
              <option value="travel">Transport</option>
              <option value="food">Taom</option>
              <option value="other">Boshqa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Miqdori (so'm)</label>
            <input v-model.number="newExpense.amount" type="number" required />
          </div>
          <div class="form-group">
            <label>Sana</label>
            <input v-model="newExpense.date" type="date" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-secondary">Bekor</button>
            <button type="submit" class="btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const expenses = ref([
  { id: '1', title: 'Elektr',category: 'utility', amount: 250000, date: '2024-03-01' },
  { id: '2', title: 'Taxi', category: 'travel', amount: 80000, date: '2024-03-02' },
  { id: '3', title: 'Restoran', category: 'food', amount: 150000, date: '2024-03-03' },
])

const showAddModal = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')

const newExpense = reactive({
  title: '',
  category: 'other',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
})

const filteredExpenses = computed(() => {
  return expenses.value.filter(exp => {
    const matchSearch = exp.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = selectedCategory.value === '' || exp.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

function getCategoryIcon(category) {
  const icons = {
    salary: '💰',
    utility: '💡',
    travel: '🚗',
    food: '🍔',
    other: '📌'
  }
  return icons[category] || '📌'
}

function addExpense() {
  expenses.value.unshift({
    id: 'exp_' + Date.now(),
    ...newExpense,
  })
  newExpense.title = ''
  newExpense.category = 'other'
  newExpense.amount = 0
  newExpense.date = new Date().toISOString().split('T')[0]
  showAddModal.value = false
}

function deleteExpense(id) {
  expenses.value = expenses.value.filter(e => e.id !== id)
}
</script>

<style scoped>
.page-container {
  max-width: 900px;
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
  display: flex;
  align-items: center;
  gap: 6px;
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

.expenses-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: all 0.2s;
}

.expense-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.expense-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.expense-icon {
  font-size: 24px;
}

.expense-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.expense-title {
  font-weight: 700;
  font-size: 14px;
}

.expense-date {
  font-size: 12px;
  color: #999;
}

.expense-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expense-amount {
  font-weight: 700;
  color: #ef4444;
  font-size: 13px;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-delete:hover {
  opacity: 1;
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
  max-width: 450px;
  width: 90%;
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

@media (max-width: 640px) {
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

  .expense-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .expense-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>