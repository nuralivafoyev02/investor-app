<template>
  <div class="login-view">
    <div class="login-header">
      <div class="logo-box">📊</div>
      <h1 class="login-title">{{ t('auth.login.title') }}</h1>
      <p class="login-subtitle">{{ t('auth.login.subtitle') }}</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <BaseInput
        v-model="formData.email"
        type="email"
        :label="t('auth.login.email')"
        placeholder="admin@example.com"
        :error="errors.email"
        @blur="validateEmail"
        required
      />

      <BaseInput
        v-model="formData.password"
        type="password"
        :label="t('auth.login.password')"
        placeholder="••••••••"
        :error="errors.password"
        @blur="validatePassword"
        required
      />

      <div class="form-options">
        <label class="checkbox-container">
          <input type="checkbox" v-model="formData.rememberMe" />
          <span class="checkmark"></span>
          <span class="label-text">{{ t('auth.login.remember') }}</span>
        </label>
        <RouterLink to="/auth/forgot-password" class="forgot-link">{{ t('auth.login.forgot') }}</RouterLink>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        class="login-btn"
        :loading="isLoading"
      >
        {{ t('auth.login.submit') }}
      </BaseButton>

      <transition name="fade">
        <BaseAlert v-if="errors.general" type="error">
          {{ errors.general }}
        </BaseAlert>
      </transition>
    </form>

    <div class="login-footer">
      <p class="demo-account">
        <strong>{{ t('auth.login.demo') }}:</strong> admin@example.com / password
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseAlert from '@/ui/base/BaseAlert.vue'

const { t } = useI18n()

const router = useRouter()
const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive({
  email: '',
  password: '',
  general: '',
})

function validateEmail() {
  const email = formData.email.trim()
  if (!email) {
    errors.email = t('auth.login.error.emailReq')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.email = t('auth.login.error.emailInvalid')
    return false
  }
  errors.email = ''
  return true
}

function validatePassword() {
  if (!formData.password) {
    errors.password = t('auth.login.error.passReq')
    return false
  }
  if (formData.password.length < 6) {
    errors.password = t('auth.login.error.passMin')
    return false
  }
  errors.password = ''
  return true
}

async function handleLogin() {
  errors.general = ''

  if (!validateEmail() || !validatePassword()) return

  isLoading.value = true

  // Simulate secure authentication
  await new Promise(resolve => setTimeout(resolve, 1200))

  if (formData.email === 'admin@example.com' && formData.password === 'password') {
    const user = { id: '1', email: formData.email, name: 'Portfolio Manager' }
    localStorage.setItem('token', 'session_' + Math.random().toString(36).slice(2))
    localStorage.setItem('user', JSON.stringify(user))
    
    isLoading.value = false
    router.push('/')
  } else {
    errors.general = t('auth.login.error.denied')
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.login-header {
  text-align: center;
}

.logo-box {
  width: 64px;
  height: 64px;
  background: var(--primary);
  color: #fff;
  border-radius: var(--radius-lg);
  display: grid;
  place-items: center;
  font-size: 32px;
  margin: 0 auto 16px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.login-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  height: 18px;
  width: 18px;
  border-radius: 4px;
  border: 2px solid var(--border-light);
  transition: var(--trans-fast);
  position: relative;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--primary);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.label-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
}

.forgot-link {
  font-size: 13px;
  font-weight: 800;
  color: var(--primary);
  text-decoration: none;
  transition: var(--trans-fast);
}

.forgot-link:hover {
  opacity: 0.7;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.login-footer {
  text-align: center;
}

.demo-account {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  opacity: 0.7;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>