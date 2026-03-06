<template>
  <div class="forgot-password">
    <RouterLink to="/auth/login" class="back-link">
      <span>&larr;</span> {{ t('auth.forgot.back') }}
    </RouterLink>

    <div class="header-section">
      <h1 class="title">{{ t('auth.forgot.title') }}</h1>
      <p class="description">{{ t('auth.forgot.subtitle') }}</p>
    </div>

    <div v-if="!resetSent" class="reset-form">
      <form @submit.prevent="sendResetCode" class="form">
        <BaseInput
          v-model="resetEmail"
          type="email"
          :label="t('auth.forgot.email')"
          placeholder="admin@example.com"
          :error="emailError"
          @blur="validateResetEmail"
          required
        />

        <BaseButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          :loading="isLoading"
        >
          {{ t('auth.forgot.submit') }}
        </BaseButton>

        <transition name="fade">
          <BaseAlert v-if="generalError" type="error">
            {{ generalError }}
          </BaseAlert>
        </transition>
      </form>
    </div>

    <div v-else-if="!passwordChanged" class="reset-form">
      <BaseAlert type="success" class="mb-lg">
        {{ t('auth.forgot.sent', { email: resetEmail }) }}
      </BaseAlert>

      <form @submit.prevent="resetPassword" class="form">
        <BaseInput
          v-model="resetCode"
          type="text"
          :label="t('auth.forgot.code')"
          placeholder="123456"
          maxlength="6"
          required
        />

        <BaseInput
          v-model="newPassword"
          type="password"
          :label="t('auth.forgot.newPass')"
          placeholder="••••••••"
          :error="passwordError"
          @blur="validateNewPassword"
          required
        />

        <BaseInput
          v-model="confirmPassword"
          type="password"
          :label="t('auth.forgot.confirmPass')"
          placeholder="••••••••"
          :error="confirmError"
          @blur="validateConfirmPassword"
          required
        />

        <BaseButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          :loading="isLoading"
        >
          {{ t('auth.forgot.change') }}
        </BaseButton>
        
        <transition name="fade">
          <BaseAlert v-if="generalError" type="error">
            {{ generalError }}
          </BaseAlert>
        </transition>
      </form>

      <p class="resend-hint">
        {{ t('auth.forgot.noCode') }} 
        <button @click="resendCode" class="resend-btn">{{ t('auth.forgot.resend') }}</button>
      </p>
    </div>

    <div v-else class="success-section">
      <div class="check-icon">✓</div>
      <h2>{{ t('auth.forgot.ready') }}</h2>
      <p>{{ t('auth.forgot.success') }}</p>
      <RouterLink to="/auth/login" class="btn-primary-link">
        {{ t('auth.forgot.return') }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseAlert from '@/ui/base/BaseAlert.vue'

const { t } = useI18n()

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
    emailError.value = t('auth.forgot.error.emailReq')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = t('auth.forgot.error.emailInvalid')
    return false
  }
  emailError.value = ''
  return true
}

function validateNewPassword() {
  if (!newPassword.value) {
    passwordError.value = t('auth.forgot.error.passReq')
    return false
  }
  if (newPassword.value.length < 6) {
    passwordError.value = t('auth.forgot.error.passMin')
    return false
  }
  passwordError.value = ''
  return true
}

function validateConfirmPassword() {
  if (newPassword.value !== confirmPassword.value) {
    confirmError.value = t('auth.forgot.error.mismatch')
    return false
  }
  confirmError.value = ''
  return true
}

async function sendResetCode() {
  generalError.value = ''
  if (!validateResetEmail()) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  resetSent.value = true
  isLoading.value = false
}

async function resetPassword() {
  generalError.value = ''
  if (!resetCode.value) {
    generalError.value = t('auth.forgot.error.codeReq')
    return
  }
  if (!validateNewPassword() || !validateConfirmPassword()) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  if (resetCode.value === '123456') {
    passwordChanged.value = true
  } else {
    generalError.value = t('auth.forgot.error.invalidCode')
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
  gap: var(--space-xl);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  width: fit-content;
  transition: var(--trans-fast);
}

.back-link:hover {
  color: var(--primary);
  transform: translateX(-4px);
}

.header-section {
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 600;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.resend-hint {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.resend-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font: inherit;
}

.success-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
  text-align: center;
}

.check-icon {
  width: 64px;
  height: 64px;
  background: rgba(var(--success-rgb), 0.1);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 28px;
  color: var(--success);
}

.btn-primary-link {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: var(--text-on-primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 700;
  transition: var(--trans-fast);
}

.btn-primary-link:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.mb-lg { margin-bottom: var(--space-lg); }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>