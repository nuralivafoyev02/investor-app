<template>
  <div class="forgot-password">
    <RouterLink to="/auth/login" class="back-link">
      <span>&larr;</span> Orqaga
    </RouterLink>

    <div class="header-section">
      <h1 class="title">Parolni tiklash</h1>
      <p class="description">Hisobingizga kirish uchun parolingizni tiklang</p>
    </div>

    <div v-if="!resetSent" class="reset-form">
      <form @submit.prevent="sendResetCode" class="form">
        <div class="form-group">
          <label for="reset-email">Email manzili</label>
          <input
            id="reset-email"
            v-model.trim="resetEmail"
            type="email"
            placeholder="admin@example.com"
            required
            @blur="validateResetEmail"
            class="form-input"
            :class="{ 'error': emailError }"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Yuborilmoqda...' : 'Kod yuborish' }}
        </button>

        <div v-if="generalError" class="alert alert-error">
          {{ generalError }}
        </div>
      </form>
    </div>

    <div v-else-if="!passwordChanged" class="reset-form">
      <div class="success-message">
        ✓ Tiklash kodi {{ resetEmail }} manziliga yuborildi
      </div>

      <form @submit.prevent="resetPassword" class="form">
        <div class="form-group">
          <label for="reset-code">Tiklash kodi</label>
          <input
            id="reset-code"
            v-model="resetCode"
            type="text"
            placeholder="123456"
            maxlength="6"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="new-password">Yangi parol</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            placeholder="••••••••"
            required
            @blur="validateNewPassword"
            class="form-input"
            :class="{ 'error': passwordError }"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <div class="form-group">
          <label for="confirm-password">Parolni tasdiqlash</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            class="form-input"
            :class="{ 'error': confirmError }"
          />
          <span v-if="confirmError" class="error-message">{{ confirmError }}</span>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Saqlanmoqda...' : 'Parolni o\'zgartirish' }}
        </button>
      </form>

      <p class="resend-hint">
        Kod olmadingizmi? <button @click="resendCode" class="resend-btn">Qayta yuborish</button>
      </p>
    </div>

    <div v-else class="success-section">
      <div class="check-icon">✓</div>
      <h2>Parol o'zgartirildi</h2>
      <p>Parolingiz muvaffaqiyatli o'zgartirildi</p>
      <RouterLink to="/auth/login" class="btn-primary">Kirish sahifasiga qaytish</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const resetEmail = ref('')
const resetCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const resetSent = ref(false)
const passwordChanged = ref(false)
const isLoading = ref(false)

const emailError = ref('')
const passwordError = ref('')
const confirmError = ref('')
const generalError = ref('')

function validateResetEmail() {
  const email = resetEmail.value.trim()
  if (!email) {
    emailError.value = 'Email manzili talab qilinadi'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = 'Email manzili noto\'g\'ri'
    return false
  }
  emailError.value = ''
  return true
}

function validateNewPassword() {
  if (!newPassword.value) {
    passwordError.value = 'Parol talab qilinadi'
    return false
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'Parol kamita 6 ta belgidan iborat bo\'lishi kerak'
    return false
  }
  passwordError.value = ''
  return true
}

function validateConfirmPassword() {
  if (newPassword.value !== confirmPassword.value) {
    confirmError.value = 'Parollar mos kelmadi'
    return false
  }
  confirmError.value = ''
  return true
}

async function sendResetCode() {
  generalError.value = ''

  if (!validateResetEmail()) {
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  resetSent.value = true
  isLoading.value = false
}

async function resetPassword() {
  generalError.value = ''

  if (!resetCode.value) {
    generalError.value = 'Tiklash kodi talab qilinadi'
    return
  }

  if (!validateNewPassword() || !validateConfirmPassword()) {
    return
  }

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simulate API call
  if (resetCode.value === '123456') {
    passwordChanged.value = true
  } else {
    generalError.value = 'Noto\'g\'ri kod'
  }

  isLoading.value = false
}

async function resendCode() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
  generalError.value = ''
}
</script>

<style scoped>
.forgot-password {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #111;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  width: fit-content;
  transition: all 0.2s ease;
}

.back-link:hover {
  color: #666;
  transform: translateX(-3px);
}

.header-section {
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: 900;
  color: #111;
  margin: 0 0 8px;
}

.description {
  font-size: 13px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 12px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 12px 14px;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.form-input.error {
  border-color: #b42318;
}

.error-message {
  font-size: 12px;
  color: #b42318;
  font-weight: 600;
}

.btn-primary {
  padding: 12px 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  text-decoration: none;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
}

.alert-error {
  background: rgba(180, 35, 24, 0.1);
  color: #b42318;
  border: 1px solid rgba(180, 35, 24, 0.2);
}

.success-message {
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.2);
  font-weight: 600;
  font-size: 13px;
  text-align: center;
}

.resend-hint {
  text-align: center;
  font-size: 13px;
  color: #666;
  margin: 0;
}

.resend-btn {
  background: none;
  border: none;
  color: #111;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font: inherit;
}

.resend-btn:hover {
  color: #666;
}

.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 24px 0;
}

.check-icon {
  width: 60px;
  height: 60px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #15803d;
}

.success-section h2 {
  font-size: 20px;
  font-weight: 900;
  color: #111;
  margin: 0;
}

.success-section p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

@media (max-width: 640px) {
  .forgot-password {
    gap: 18px;
  }

  .title {
    font-size: 20px;
  }

  .form {
    gap: 14px;
  }
}
</style>