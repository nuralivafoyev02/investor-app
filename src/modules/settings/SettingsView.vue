<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Sozlamalar</h1>
    </div>

    <div class="settings-content">
      <div class="settings-section">
        <h2 class="section-title">Profil</h2>
        <div class="settings-item">
          <label>To'liq ismi</label>
          <input v-model="settings.fullName" type="text" />
        </div>
        <div class="settings-item">
          <label>Email</label>
          <input v-model="settings.email" type="email" />
        </div>
        <div class="settings-item">
          <label>Telefon</label>
          <input v-model="settings.phone" type="tel" />
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">Bildirishnomalar</h2>
        <div class="settings-item toggle">
          <label>Email orqali bildirishnoma</label>
          <input v-model="settings.emailNotification" type="checkbox" />
        </div>
        <div class="settings-item toggle">
          <label>SMS orqali bildirishnoma</label>
          <input v-model="settings.smsNotification" type="checkbox" />
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">Xavfsizlik</h2>
        <div class="settings-item">
          <button @click="changePassword" class="btn-action">Parolni o'zgartirish</button>
        </div>
        <div class="settings-item">
          <button @click="enableTwoFactor" class="btn-action">Ikki faktorli autentifikatsiya</button>
        </div>
      </div>

      <div class="settings-section">
        <h2 class="section-title">Tilni tanlang</h2>
        <div class="settings-item">
          <select v-model="settings.language">
            <option value="uz">O'zbek</option>
            <option value="ru">Rus</option>
            <option value="en">Ingliz</option>
          </select>
        </div>
      </div>

      <div class="settings-section danger">
        <h2 class="section-title">Xavfli zona</h2>
        <div class="settings-item">
          <button @click="logout" class="btn-danger">Chiqish</button>
        </div>
        <div class="settings-item">
          <button @click="deleteAccount" class="btn-danger">Hisobni o'chirish</button>
        </div>
      </div>
    </div>

    <div class="settings-footer">
      <button @click="saveSettings" class="btn-primary">O'zgarishlarni saqlash</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const settings = reactive({
  fullName: 'Admin User',
  email: 'admin@example.com',
  phone: '+998901234567',
  emailNotification: true,
  smsNotification: false,
  language: 'uz',
})

function changePassword() {
  alert('Parol o\'zgartirish formasi ochiladi')
}

function enableTwoFactor() {
  alert('Ikki faktorli autentifikatsiya yoqiladi')
}

function saveSettings() {
  localStorage.setItem('settings', JSON.stringify(settings))
  alert('Sozlamalar saqlandi')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
}

function deleteAccount() {
  if (confirm('Hisobni o\'chirishni tasdiqlaysizmi? Bu amalni qaytara olmaysiz!')) {
    localStorage.clear()
    router.push('/auth/login')
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
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.settings-section {
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.settings-section.danger {
  border-color: #ffcccc;
  background: #fff9f9;
}

.section-title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 900;
  color: #111;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item label {
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.settings-item input[type='text'],
.settings-item input[type='email'],
.settings-item input[type='tel'],
.settings-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  width: 250px;
}

.settings-item input:focus,
.settings-item select:focus {
  outline: none;
  border-color: #111;
}

.settings-item.toggle input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn-action {
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #eee;
}

.btn-danger {
  padding: 10px 16px;
  background: #ffe5e5;
  border: 1px solid #ffcccc;
  color: #b42318;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #ffcccc;
}

.btn-primary {
  padding: 12px 24px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #333;
}

.settings-footer {
  text-align: center;
}

@media (max-width: 640px) {
  .settings-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .settings-item input[type='text'],
  .settings-item input[type='email'],
  .settings-item input[type='tel'],
  .settings-item select {
    width: 100%;
  }

  .settings-item input[type='checkbox'] {
    align-self: flex-end;
  }

  .btn-primary,
  .btn-action,
  .btn-danger {
    width: 100%;
  }
}
</style>