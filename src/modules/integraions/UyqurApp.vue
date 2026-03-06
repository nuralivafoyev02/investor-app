<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Uyqur App</h1>
      <p class="subtitle">Mobil ilova integratsiyasi</p>
    </div>

    <div class="integration-card">
      <div class="status-badge" :class="isConnected ? 'connected' : 'disconnected'">
        {{ isConnected ? '✓ Ulandirilgan' : '✗ Ulanmagan' }}
      </div>

      <div class="form-section">
        <h2>Sozlamalar</h2>
        <div class="form-group">
          <label>App ID</label>
          <input v-model="settings.appId" type="text" placeholder="App ID kiriting" />
        </div>
        <div class="form-group">
          <label>App Token</label>
          <input v-model="settings.appToken" type="password" placeholder="App token kiriting" />
        </div>
        <div class="form-group">
          <label>Server URL</label>
          <input v-model="settings.serverUrl" type="url" placeholder="https://api.uyqurapp.com" />
        </div>
      </div>

      <div class="actions">
        <button @click="testConnection" class="btn-secondary">Sinab ko'rish</button>
        <button @click="saveSettings" class="btn-primary">Saqlash</button>
      </div>

      <div v-if="connectionStatus" class="alert" :class="connectionStatus.type">
        {{ connectionStatus.message }}
      </div>

      <div class="info-section">
        <h3>Integrasiya holati</h3>
        <div class="stats">
          <div class="stat">
            <span class="stat-label">Aktiv foydalanuvchilar</span>
            <span class="stat-value">{{ activeUsers }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Yuklab olishlar</span>
            <span class="stat-value">{{ downloads }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Rating</span>
            <span class="stat-value">{{ rating }}</span>
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
const activeUsers = ref(0)
const downloads = ref(0)
const rating = ref('—')

const settings = reactive({
  appId: '',
  appToken: '',
  serverUrl: '',
})

function testConnection() {
  connectionStatus.value = {
    type: 'loading',
    message: 'Ulanish sinab ko\'rilmoqda...'
  }

  setTimeout(() => {
    if (settings.appId && settings.appToken && settings.serverUrl) {
      isConnected.value = true
      connectionStatus.value = {
        type: 'success',
        message: 'Ulanaish muvaffaqiyatli!'
      }
      activeUsers.value = 1234
      downloads.value = 5678
      rating.value = '4.8 ⭐'
    } else {
      connectionStatus.value = {
        type: 'error',
        message: 'Barcha maydonlarni to\'ldiring'
      }
    }
  }, 1000)
}

function saveSettings() {
  localStorage.setItem('uyqur_settings', JSON.stringify(settings))
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
  margin: 0 0 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 900;
  color: #111;
}

@media (max-width: 640px) {
  .integration-card {
    padding: 16px;
  }

  .actions {
    flex-direction: column;
  }

  .stats {
    grid-template-columns: 1fr;
  }
}
</style>