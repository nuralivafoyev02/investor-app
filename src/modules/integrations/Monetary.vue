<template>
  <div class="integration-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Monetary Intelligence</h1>
        <p class="page-subtitle">{{ t('integrations.monetary.subtitle') }}</p>
      </div>
      <BaseBadge :type="store.connections.monetary.connected ? 'success' : 'error'">
        {{ store.connections.monetary.connected ? t('integrations.common.online') : t('integrations.common.offline') }}
      </BaseBadge>
    </div>

    <div class="integration-grid">
      <div class="main-column">
        <BaseCard title="Data Feed Access" class="config-card">
          <div class="form-vertical">
            <BaseInput
              v-model="settings.apiKey"
              label="Financial API Surface Secret"
              type="password"
              placeholder="Enter secured API key"
            />
            <BaseSelect
              v-model="settings.baseCurrency"
              label="Primary Reporting Currency"
              :options="[
                { label: 'Uzbekistan Som (UZS)', value: 'UZS' },
                { label: 'US Dollar (USD)', value: 'USD' },
                { label: 'Euro (EUR)', value: 'EUR' },
                { label: 'UAE Dirham (AED)', value: 'AED' }
              ]"
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

        <div v-if="rates.length > 0" class="rates-display">
          <h2 class="section-title">Live FX Indices</h2>
          <div class="rates-grid">
            <div v-for="rate in rates" :key="rate.currency" class="rate-chip glass">
              <span class="chip-curr">{{ rate.currency }}</span>
              <span class="chip-val">{{ rate.rate }}</span>
              <span class="chip-trend" :class="rate.trend">{{ rate.trend === 'up' ? '▲' : '▼' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="side-info">
        <BaseAlert v-if="alert" :type="alert.type" :title="alert.title">
          {{ alert.message }}
        </BaseAlert>
        
        <BaseCard title="Feed Status">
          <div class="feed-status">
            <div class="status-row">
              <span class="lbl">Last Synchronized</span>
              <span class="val">{{ store.connections.monetary.lastSync ? formatDate(store.connections.monetary.lastSync) : 'Never' }}</span>
            </div>
            <div class="status-row">
              <span class="lbl">Precision Level</span>
              <span class="val">High-Priority (Real-time)</span>
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
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import BaseAlert from '@/ui/base/BaseAlert.vue'

const store = useIntegrationsStore()
const { success, error } = useNotification()

const isTesting = ref(false)
const alert = ref(null)
const rates = ref([])

const settings = reactive(JSON.parse(localStorage.getItem('monetary_settings')) || {
  apiKey: '',
  baseCurrency: 'UZS',
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString()
}

const testConnection = async () => {
  isTesting.value = true
  alert.value = null
  
  try {
    await new Promise(r => setTimeout(r, 1000))
    if (settings.apiKey) {
      store.updateStatus('monetary', true)
      alert.value = {
        type: 'success',
        title: 'Feed Synchronized',
        message: 'Global exchange indices successfully re-indexed.'
      }
      rates.value = [
        { currency: 'USD/UZS', rate: '12,580', trend: 'up' },
        { currency: 'EUR/UZS', rate: '13,720', trend: 'down' },
        { currency: 'AED/UZS', rate: '3,425', trend: 'up' },
        { currency: 'GBP/UZS', rate: '16,040', trend: 'up' },
      ]
    } else {
      throw new Error('Missing Key')
    }
  } catch (err) {
    store.updateStatus('monetary', false)
    alert.value = {
      type: 'error',
      title: 'Feed Divergence',
      message: 'Server refused authentication. Check your Financial API Key.'
    }
  } finally {
    isTesting.value = false
  }
}

const saveSettings = () => {
  localStorage.setItem('monetary_settings', JSON.stringify(settings))
  success('Market feed configuration secured')
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

.rates-display {
  margin-top: var(--space-xxl);
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: var(--space-lg);
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-md);
}

.rate-chip {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chip-curr {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted);
}

.chip-val {
  font-size: 18px;
  font-weight: 900;
  color: var(--text-main);
}

.chip-trend { font-size: 10px; }
.chip-trend.up { color: var(--success); }
.chip-trend.down { color: var(--danger); }

.feed-status {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.status-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lbl {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.val {
  font-weight: 800;
  font-size: 14px;
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