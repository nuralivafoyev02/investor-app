<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Click Uzbekistan</h1>
      <p class="subtitle">To'lov tizimi integratsiyasi</p>
    </div>

    <div class="integration-card">
      <div class="status-badge" :class="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? '✓ Ulandirilgan' : '✗ Ulanmagan' }}
      </div>

      <div class="form-section">
        <h2>Sozlamalar</h2>
        <div class="form-group">
          <label>Merchant ID</label>
          <input v-model="settings.merchantId" type="text" placeholder="Merchant ID kiriting" />
        </div>
        <div class="form-group">
          <label>API Kalit</label>
          <input v-model="settings.apiKey" type="password" placeholder="API kalit kiriting" />
        </div>
        <div class="form-group">
          <label>Secret Kalit</label>
          <input v-model="settings.secretKey" type="password" placeholder="Secret kalit kiriting" />
        </div>
      </div>

      <div class="actions">
        <button @click="testConnection" class="btn-secondary">Ulanishni sinab ko'rish</button>
        <button @click="saveSettings" class="btn-primary">Saqlash</button>
      </div>

      <div v-if="connectionStatus" class="alert" :class="connectionStatus.type">
        {{ connectionStatus.message }}
      </div>

      <div class="info-section">
        <h3>So'ngi to'lovlar</h3>
        <div v-if="transactions.length === 0" class="empty-message">
          Hali to'lov yo'q
        </div>
        <div v-else class="transactions-list">
          <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
            <span class="tx-id">{{ tx.id }}</span>
            <span class="tx-amount">{{ tx.amount }} so'm</span>
            <span class="tx-status" :class="tx.status">{{ tx.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const isConnected = ref(false)
const connectionStatus = ref(null)
const transactions = ref([])

const settings = reactive({
  merchantId: '',
  apiKey: '',
  secretKey: '',
})

function testConnection() {
  connectionStatus.value = {
    type: 'loading',
    message: 'Ulanish sinab ko\'rilmoqda...'
  }

  setTimeout(() => {
    if (settings.merchantId && settings.apiKey && settings.secretKey) {
      isConnected.value = true
      connectionStatus.value = {
        type: 'success',
        message: 'Ulanaish muvaffaqiyatli!'
      }
      transactions.value = [
        { id: 'TX001', amount: 50000, status: 'success' },
        { id: 'TX002', amount: 100000, status: 'success' },
      ]
    } else {
      connectionStatus.value = {
        type: 'error',
        message: 'Barcha maydonlarni to\'ldiring'
      }
    }
  }, 1000)
}

function saveSettings() {
  localStorage.setItem('click_settings', JSON.stringify(settings))
  connectionStatus.value = {
    type: 'success',
    message: 'Sozlamalar saqlandi'
  }
}
</script>

<style scoped>
.page-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.integration-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  margin-bottom: 20px;
}

.status-badge.connected {
  background: #d1f5e0;
  color: #15803d;
}

.status-badge.disconnected {
  background: #ffe5e5;
  color: #b42318;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h2 {
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 16px;
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

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #111;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #f5f5f5;
  color: #111;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #eee;
}

.alert {
  padding: 12px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 20px;
}

.alert.success {
  background: #d1f5e0;
  color: #15803d;
  border: 1px solid #a0e0c9;
}

.alert.error {
  background: #ffe5e5;
  color: #b42318;
  border: 1px solid #ffcccc;
}

.alert.loading {
  background: #dbeafe;
  color: #0c4a6e;
  border: 1px solid #bfdbfe;
}

.info-section {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.info-section h3 {
  font-size: 14px;
  font-weight: 900;
  margin: 0 0 12px;
}

.empty-message {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 13px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.tx-id {
  color: #666;
}

.tx-amount {
  color: #111;
  font-weight: 700;
}

.tx-status {
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 11px;
}

.tx-status.success {
  background: #d1f5e0;
  color: #15803d;
}

@media (max-width: 640px) {
  .integration-card {
    padding: 16px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>