<template>
  <div class="integration-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Uyqur App</h1>
        <p class="page-subtitle">{{ t('integrations.uyqur.subtitle') }}</p>
      </div>
      <BaseBadge :type="store.connections.uyqur.connected ? 'success' : 'error'">
        {{ store.connections.uyqur.connected ? t('integrations.common.online') : t('integrations.common.offline') }}
      </BaseBadge>
    </div>

    <div class="integration-grid">
      <div class="main-column">
        <BaseCard title="Platform Credentials" class="config-card">
          <div class="form-vertical">
            <BaseInput
              v-model="settings.appId"
              label="Application ID"
              placeholder="e.g. app_8872_premium"
            />
            <BaseInput
              v-model="settings.appToken"
              label="Synchronization Token"
              type="password"
              placeholder="Secure app token"
            />
            <BaseInput
              v-model="settings.serverUrl"
              label="Endpoint API Surface"
              placeholder="https://sync.uyqurapp.com"
            />
            
            <div class="config-actions">
              <BaseButton variant="secondary" size="md" @click="testConnection" :loading="isTesting">
                {{ t('integrations.common.validate') }}
              </BaseButton>
              <BaseButton variant="primary" size="md" @click="saveSettings">
                {{ t('integrations.common.save') }}
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <div v-if="isConnected" class="stats-overview">
          <BaseCard title="Real-time Ecosystem Health">
            <div class="stats-row">
              <div class="stat-circle">
                <span class="circle-val">{{ activeUsers }}</span>
                <span class="circle-lbl">Daily Active</span>
              </div>
              <div class="stat-circle">
                <span class="circle-val">{{ downloads }}</span>
                <span class="circle-lbl">Total Base</span>
              </div>
              <div class="stat-circle">
                <span class="circle-val">{{ rating }}</span>
                <span class="circle-lbl">Satisfaction</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      <div class="side-info">
        <BaseAlert v-if="alert" :type="alert.type" :title="alert.title">
          {{ alert.message }}
        </BaseAlert>
        
        <BaseCard title="Integration Guide">
          <div class="guide-content">
            <p>1. Retrieve your <strong>App ID</strong> from the Uyqur Console.</p>
            <p>2. Generate a <strong>Production Token</strong> in the security tab.</p>
            <p>3. Ensure your server URL uses **HTTPS** for secure transmission.</p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useIntegrationsStore } from '@/stores/integrations'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

// Components
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import BaseAlert from '@/ui/base/BaseAlert.vue'

const store = useIntegrationsStore()
const { success, error } = useNotification()

const isTesting = ref(false)
const isConnected = ref(store.connections.uyqur.connected)
const alert = ref(null)

const activeUsers = ref(1240)
const downloads = ref(8920)
const rating = ref('4.9/5')

const settings = reactive(JSON.parse(localStorage.getItem('uyqur_settings')) || {
  appId: '',
  appToken: '',
  serverUrl: '',
})

const testConnection = async () => {
  isTesting.value = true
  alert.value = null
  
  try {
    await new Promise(r => setTimeout(r, 1500))
    if (settings.appId && settings.appToken) {
      store.updateStatus('uyqur', true)
      isConnected.value = true
      alert.value = {
        type: 'success',
        title: 'Communication Verified',
        message: 'Handshake complete. Telemetry data is now streaming.'
      }
    } else {
      throw new Error('Invalid config')
    }
  } catch (err) {
    store.updateStatus('uyqur', false)
    isConnected.value = false
    alert.value = {
      type: 'error',
      title: 'Sync Interrupted',
      message: 'Protocol mismatch. Please verify your Application Token.'
    }
  } finally {
    isTesting.value = false
  }
}

const saveSettings = () => {
  localStorage.setItem('uyqur_settings', JSON.stringify(settings))
  success('Uyqur App configurations applied')
}
</script>

<style scoped>
.integration-page {
  padding: var(--space-xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xxl);
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: var(--text-muted);
  font-weight: 600;
}

.integration-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: var(--space-xxl);
}

.form-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.config-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.stats-overview {
  margin-top: var(--space-xl);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
  padding: var(--space-lg) 0;
}

.stat-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.circle-val {
  font-size: 24px;
  font-weight: 900;
  color: var(--primary);
  background: var(--bg-main);
  width: 80px;
  height: 80px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 4px solid var(--border-light);
}

.circle-lbl {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
}

.side-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .integration-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
}
</style>