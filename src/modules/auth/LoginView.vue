<template>
  <div class="login-form">
    <div class="logo-section">
      <h1 class="app-name">📊 Investor App</h1>
      <p class="subtitle">Investitsiya boshqarish tizimi</p>
    </div>

    <form @submit.prevent="handleLogin" class="form">
      <Input
        v-model="formData.email"
        type="email"
        label="Email manzili"
        placeholder="admin@example.com"
        :error="errors.email"
        @blur="validateEmail"
      />

      <Input
        v-model="formData.password"
        type="password"
        label="Parol"
        placeholder="••••••••"
        :error="errors.password"
        @blur="validatePassword"
      />

      <label class="checkbox-label">
        <input v-model="formData.rememberMe" type="checkbox" />
        <span>Meni eslab qol</span>
      </label>

      <Button
        type="submit"
        variant="primary"
        size="md"
        :disabled="isLoading"
        :loading="isLoading"
        class="w-full"
      >
        {{ isLoading ? 'Kirish...' : 'Kirish' }}
      </Button>

      <Alert v-if="errors.general" type="error">
        {{ errors.general }}
      </Alert>
    </form>

    <div class="footer-links">
      <RouterLink to="/auth/forgot-password" class="link">Parolni esdan chiqdingizmi?</RouterLink>
      <p class="demo-hint">Demo: email: admin@example.com, parol: password</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { reactive, ref } from 'vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import Alert from '@/components/Alert.vue'

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
    errors.email = 'Email manzili talab qilinadi'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.email = 'Email manzili noto\'g\'ri'
    return false
  }
  errors.email = ''
  return true
}

function validatePassword() {
  if (!formData.password) {
    errors.password = 'Parol talab qilinadi'
    return false
  }
  if (formData.password.length < 6) {
    errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
    return false
  }
  errors.password = ''
  return true
}

async function handleLogin() {
  errors.general = ''

  if (!validateEmail() | !validatePassword()) {
    return
  }

  isLoading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))

  // Demo credentials
  if (formData.email === 'admin@example.com' && formData.password === 'password') {
    const user = {
      id: '1',
      email: formData.email,
      name: 'Admin User',
    }
    localStorage.setItem('token', 'demo-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify(user))
    if (formData.rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    }
    isLoading.value = false
    router.push('/')
  } else {
    errors.general = 'Email yoki parol noto\'g\'ri'
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo-section {
  text-align: center;
  margin-bottom: 12px;
}

.app-name {
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 8px;
  color: #111;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 13px;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
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

.footer-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.link {
  color: #111;
  font-weight: 700;
  text-decoration: none;
  font-size: 13px;
  border-bottom: 2px solid #111;
  transition: all 0.2s ease;
}

.link:hover {
  color: #666;
  border-bottom-color: #666;
}

.demo-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
  font-weight: 500;
}

@media (max-width: 640px) {
  .login-form {
    gap: 20px;
  }

  .app-name {
    font-size: 24px;
  }

  .form {
    gap: 16px;
  }

  .btn-primary {
    padding: 14px 16px;
  }
}
</style>