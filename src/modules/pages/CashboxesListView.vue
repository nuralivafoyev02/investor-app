<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1 class="page-title">Kassalar</h1>
        <p class="page-subtitle">{{ cashboxes.length }} ta kassa</p>
      </div>
      <button @click="openAddModal" class="btn-primary">
        <span>+</span> Yangi kassa
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Umumiy balans</div>
        <div class="stat-value">{{ totalBalance.toLocaleString('uz-UZ') }} so'm</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Umumiy kirim</div>
        <div class="stat-value income">{{ totalIncome.toLocaleString('uz-UZ') }} so'm</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Umumiy xarajat</div>
        <div class="stat-value expense">{{ totalExpense.toLocaleString('uz-UZ') }} so'm</div>
      </div>
    </div>

    <div v-if="cashboxes.length === 0" class="empty-state">
      <p>Kassalar topilmadi</p>
    </div>

    <div v-else class="cashboxes-grid">
      <div v-for="cashbox in cashboxes" :key="cashbox.id" class="cashbox-card">
        <div class="card-header">
          <div>
            <h3 class="cashbox-name">{{ cashbox.name }}</h3>
            <p class="cashbox-type">{{ getCashboxType(cashbox.type) }}</p>
          </div>
          <button @click="deleteCard(cashbox.id)" class="btn-menu">×</button>
        </div>

        <div class="balance-display">
          <span class="label">Balans:</span>
          <span class="amount">{{ cashbox.balance.toLocaleString('uz-UZ') }} so'm</span>
        </div>

        <div class="action-buttons">
          <button @click="openTransaction(cashbox.id, 'income')" class="btn-action btn-income">
            ⬇ Kirim
          </button>
          <button @click="openTransaction(cashbox.id, 'expense')" class="btn-action btn-expense">
            ⬆ Xarajat
          </button>
        </div>

        <div v-if="cashbox.transactions && cashbox.transactions.length > 0" class="transactions">
          <div class="trans-header">So'ngi 3 ta operatsiya:</div>
          <div v-for="trans in cashbox.transactions.slice(0, 3)" :key="trans.id" class="trans-item" :class="trans.type">
            <span class="trans-desc">{{ trans.description }}</span>
            <span class="trans-amount">{{ trans.type === 'income' ? '+' : '-' }}{{ trans.amount.toLocaleString('uz-UZ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Yangi kassa -->
    <div v-if="showCashboxModal" @click.self="closeCashboxModal" class="modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Yangi kassa qo'shish</h2>
          <button @click="closeCashboxModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveCashbox" class="form">
          <div class="form-group">
            <label>Kassa nomi</label>
            <input v-model="newCashbox.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Turi</label>
            <select v-model="newCashbox.type">
              <option value="cash">Naqd pul</option>
              <option value="bank">Bank hisob</option>
              <option value="card">Karta</option>
            </select>
          </div>
          <div class="form-group">
            <label>Boshlang'ich balans</label>
            <input v-model.number="newCashbox.balance" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeCashboxModal" class="btn-secondary">Bekor qilish</button>
            <button type="submit" class="btn-primary">Yaratish</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Operatsiya -->
    <div v-if="showTransactionModal" @click.self="closeTransactionModal" class="modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>{{ transactionType === 'income' ? 'Kirim' : 'Xarajat' }} qo'shish</h2>
          <button @click="closeTransactionModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="saveTransaction" class="form">
          <div class="form-group">
            <label>Tavsifi</label>
            <input v-model="newTransaction.description" type="text" required />
          </div>
          <div class="form-group">
            <label>Miqdori (so'm)</label>
            <input v-model.number="newTransaction.amount" type="number" required />
          </div>
          <div class="form-group">
            <label>Sana</label>
            <input v-model="newTransaction.date" type="date" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeTransactionModal" class="btn-secondary">Bekor qilish</button>
            <button type="submit" class="btn-primary">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const cashboxes = ref([
  { id: '1', name: 'Asosiy kassa', type: 'cash', balance: 10000000, transactions: [] },
  { id: '2', name: 'Bank hisob', type: 'bank', balance: 50000000, transactions: [] },
  { id: '3', name: 'Visa karta', type: 'card', balance: 5000000, transactions: [] },
])

const showCashboxModal = ref(false)
const showTransactionModal = ref(false)
const transactionType = ref('income')
const selectedCashboxId = ref(null)

const newCashbox = reactive({
  name: '',
  type: 'cash',
  balance: 0,
})

const newTransaction = reactive({
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
})

const totalBalance = computed(() => {
  return cashboxes.value.reduce((sum, cb) => sum + cb.balance, 0)
})

const totalIncome = computed(() => {
  let total = 0
  cashboxes.value.forEach(cb => {
    if (cb.transactions) {
      cb.transactions.forEach(trans => {
        if (trans.type === 'income') total += trans.amount
      })
    }
  })
  return total
})

const totalExpense = computed(() => {
  let total = 0
  cashboxes.value.forEach(cb => {
    if (cb.transactions) {
      cb.transactions.forEach(trans => {
        if (trans.type === 'expense') total += trans.amount
      })
    }
  })
  return total
})

function getCashboxType(type) {
  const types = { cash: 'Naqd pul', bank: 'Bank hisob', card: 'Karta' }
  return types[type] || type
}

function openAddModal() {
  newCashbox.name = ''
  newCashbox.type = 'cash'
  newCashbox.balance = 0
  showCashboxModal.value = true
}

function closeCashboxModal() {
  showCashboxModal.value = false
}

function saveCashbox() {
  cashboxes.value.push({
    id: 'cb_' + Date.now(),
    ...newCashbox,
    transactions: []
  })
  closeCashboxModal()
}

function deleteCard(id) {
  cashboxes.value = cashboxes.value.filter(cb => cb.id !== id)
}

function openTransaction(cashboxId, type) {
  selectedCashboxId.value = cashboxId
  transactionType.value = type
  newTransaction.description = ''
  newTransaction.amount = 0
  newTransaction.date = new Date().toISOString().split('T')[0]
  showTransactionModal.value = true
}

function closeTransactionModal() {
  showTransactionModal.value = false
}

function saveTransaction() {
  const cashbox = cashboxes.value.find(cb => cb.id === selectedCashboxId.value)
  if (!cashbox) return

  if (!cashbox.transactions) cashbox.transactions = []

  cashbox.transactions.unshift({
    id: 'trans_' + Date.now(),
    type: transactionType.value,
    ...newTransaction
  })

  if (transactionType.value === 'income') {
    cashbox.balance += newTransaction.amount
  } else {
    cashbox.balance -= newTransaction.amount
  }

  closeTransactionModal()
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 900;
  color: #111;
}

.stat-value.income {
  color: #22c55e;
}

.stat-value.expense {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.cashboxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.cashbox-card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.cashbox-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.cashbox-type {
  margin: 4px 0 0;
  font-size: 12px;
  color: #999;
}

.btn-menu {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.balance-display {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.balance-display .label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.balance-display .amount {
  font-size: 18px;
  font-weight: 900;
  color: #111;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.btn-action {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-income {
  background: #d1f5e0;
  color: #15803d;
}

.btn-income:hover {
  background: #bbf0d8;
}

.btn-expense {
  background: #ffe5e5;
  color: #b42318;
}

.btn-expense:hover {
  background: #ffcccc;
}

.transactions {
  padding-top: 12px;
  border-top: 1px solid #eee;
  font-size: 12px;
}

.trans-header {
  font-weight: 700;
  color: #666;
  margin-bottom: 8px;
}

.trans-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #666;
}

.trans-item.income {
  color: #22c55e;
}

.trans-item.expense {
  color: #ef4444;
}

.trans-amount {
  font-weight: 700;
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

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .cashboxes-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    width: 95%;
  }
}
</style>