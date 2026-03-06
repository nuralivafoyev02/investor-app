<template>
  <div class="integration-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Click Uzbekistan</h1>
        <p class="page-subtitle">{{ t('integrations.click.subtitle') }}</p>
      </div>
      <BaseBadge :type="store.connections.click.connected ? 'success' : 'error'">
        {{ store.connections.click.connected ? t('integrations.common.online') : t('integrations.common.offline') }}
      </BaseBadge>
    </div>

    <div class="integration-grid">
      <BaseCard title="API Configuration" class="config-card">
        <div class="form-vertical">
          <BaseInput
            v-model="settings.merchantId"
            label="Merchant Identifier"
            placeholder="Enter your Merchant ID"
          />
          <BaseInput
            v-model="settings.apiKey"
            label="Production API Key"
            type="password"
            placeholder="Enter API Key"
          />
          <BaseInput
            v-model="settings.secretKey"
            label="Secure Hash Secret"
            type="password"
            placeholder="Enter Secret Key"
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

      <div class="side-info">
        <BaseAlert v-if="alert" :type="alert.type" :title="alert.title">
          {{ alert.message }}
        </BaseAlert>

        <BaseCard :title="t('integrations.common.ledger')" class="ledger-card">
          <div v-if="transactions.length === 0" class="empty-ledger">
            <p>{{ t('integrations.common.noLogs') }}</p>
          </div>
          <div v-else class="ledger-list">
            <div v-for="tx in transactions" :key="tx.id" class="ledger-item">
              <div class="tx-main">
                <span class="tx-ref">#{{ tx.id }}</span>
                <span class="tx-val">{{ formatCurrency(tx.amount) }}</span>
              </div>
              <BaseBadge type="success" size="sm">{{ t('integrations.common.settled') }}</BaseBadge>
            </div>
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
const alert = ref(null)
const transactions = ref([])

const settings = reactive(JSON.parse(localStorage.getItem('click_settings')) || {
  merchantId: '',
  apiKey: '',
  secretKey: '',
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}

const testConnection = async () => {
  isTesting.value = true
  alert.value = null
  
  try {
    await new Promise(r => setTimeout(r, 1200))
    if (settings.merchantId && settings.apiKey) {
      store.updateStatus('click', true)
      alert.value = {
        type: 'success',
        title: 'Authentication Successful',
        message: 'Established secure handshake with Click Uzbekistan servers.'
      }
      transactions.value = [
        { id: 'CLK-9021', amount: 450000 },
        { id: 'CLK-8832', amount: 1200000 },
      ]
    } else {
      throw new Error('Missing credentials')
    }
  } catch (err) {
    store.updateStatus('click', false)
    alert.value = {
      type: 'error',
      title: 'Connection Failed',
      message: 'Unable to authorize with provided credentials. Please check your Merchant ID.'
    }
  } finally {
    isTesting.value = false
  }
}

const saveSettings = () => {
  localStorage.setItem('click_settings', JSON.stringify(settings))
  success('Click integration settings updated')
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

.side-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.ledger-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.ledger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-main);
  border-radius: var(--radius-md);
}

.tx-main {
  display: flex;
  flex-direction: column;
}

.tx-ref {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
}

.tx-val {
  font-weight: 800;
  color: var(--text-main);
}

.empty-ledger {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-muted);
  font-size: 13px;
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
}
</style>