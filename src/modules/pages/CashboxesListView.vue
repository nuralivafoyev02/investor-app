<template>
  <div class="finance-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('finance.vaults.title') }}</h1>
        <p class="page-subtitle">{{ t('finance.vaults.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="openAddModal">
        {{ t('finance.vaults.create') }}
      </BaseButton>
    </div>

    <div class="vaults-summary">
      <div class="summary-card glass premium-glow">
        <span class="summary-label">{{ t('finance.vaults.totalAssets') }}</span>
        <span class="summary-value">{{ formatCurrency(totalBalance) }}</span>
      </div>
    </div>

    <div class="vaults-grid">
      <template v-if="financeStore.loading">
        <BaseCard v-for="i in 3" :key="`skeleton-${i}`" class="vault-card">
          <div class="vault-body">
            <BaseSkeleton width="70%" height="24px" class="mb-4" />
            <BaseSkeleton width="40%" height="16px" class="mb-2" />
            <BaseSkeleton width="100%" height="40px" type="button" />
          </div>
        </BaseCard>
      </template>
      <template v-else>
        <BaseCard
          v-for="vault in financeStore.cashboxes"
          :key="vault.id"
          class="vault-card"
          :style="{ borderTop: `4px solid ${vault.color}` }"
        >
          <template #header>
            <div class="vault-header">
              <div class="vault-info">
                <h3 class="vault-name">{{ vault.name }}</h3>
                <BaseBadge :type="vault.type === 'Cash' ? 'info' : 'success'">{{ vault.type }}</BaseBadge>
              </div>
              <button class="delete-btn" @click="confirmDelete(vault.id)" :title="t('common.remove')">
                <IconTrash class="icon-sm" />
              </button>
            </div>
          </template>
          
          <div class="vault-body">
            <div class="balance-display">
              <span class="balance-label">{{ t('finance.vaults.balance') }}</span>
              <span class="balance-amount">{{ formatCurrency(vault.balance) }}</span>
            </div>
            
            <div class="vault-actions">
              <BaseButton variant="secondary" size="sm" class="w-full">{{ t('finance.vaults.transfer') }}</BaseButton>
            </div>
          </div>
        </BaseCard>
      </template>
    </div>

    <!-- Add Vault Modal -->
    <DashboardModal
      v-if="showModal"
      :title="t('finance.vaults.modal.title')"
      @close="closeModal"
    >
      <form @submit.prevent="handleSave" class="vault-form">
        <div class="form-grid">
          <BaseInput
            v-model="formData.name"
            :label="t('finance.vaults.form.name')"
            placeholder="E.g. Main Reserve"
            required
            class="span-2"
          />
          <BaseSelect
            v-model="formData.type"
            :label="t('finance.vaults.form.type')"
            :options="[
              { label: t('finance.vaults.form.types.cash'), value: 'Cash' },
              { label: t('finance.vaults.form.types.card'), value: 'Card' },
              { label: t('finance.vaults.form.types.bank'), value: 'Bank' }
            ]"
          />
          <BaseInput
            v-model.number="formData.balance"
            :label="t('finance.vaults.form.balance')"
            type="number"
            placeholder="0"
            required
          />
          <BaseInput
            v-model="formData.color"
            :label="t('finance.vaults.form.color')"
            type="color"
          />
        </div>
        
        <div class="modal-footer">
          <BaseButton variant="ghost" @click="closeModal">{{ t('common.cancel') }}</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSaving">{{ t('finance.vaults.modal.confirm') }}</BaseButton>
        </div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()

// Components
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'

// Icons
import IconTrash from '@/ui/icons/IconTrash.vue'

const financeStore = useFinanceStore()
const { success, error } = useNotification()

const showModal = ref(false)
const isSaving = ref(false)

const formData = reactive({
  name: '',
  type: 'Cash',
  balance: 0,
  color: '#6366f1',
})

const totalBalance = computed(() => {
  return financeStore.cashboxes.reduce((acc, curr) => acc + curr.balance, 0)
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}

const openAddModal = () => {
  Object.assign(formData, { name: '', type: 'Cash', balance: 0, color: '#6366f1' })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await financeStore.addCashbox({ ...formData })
    success('New vault created successfully')
    closeModal()
  } catch (err) {
    // Handled by service
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  financeStore.fetchCashboxes()
})

const confirmDelete = (id) => {
  if (confirm(t('finance.vaults.modal.decommissionConfirm'))) {
    financeStore.deleteCashbox(id)
    success('Vault decommissioned')
  }
}
</script>

<style scoped>
.finance-page {
  padding: var(--space-xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
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

.vaults-summary {
  margin-bottom: var(--space-xl);
}

.summary-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--grad-ambient);
  color: var(--text-main);
  border: 1px solid var(--border-light);
}

.summary-label {
  font-size: 14px;
  font-weight: 700;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-value {
  font-size: 44px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.vaults-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-xl);
}

.vault-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.vault-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vault-name {
  font-size: 18px;
  font-weight: 800;
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0.4;
  transition: var(--trans-fast);
}

.delete-btn:hover {
  opacity: 1;
  color: var(--danger);
}

.balance-display {
  padding: var(--space-lg) 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.balance-amount {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
}

.vault-form {
  padding: var(--space-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.span-2 {
  grid-column: span 2;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
  }
  
  .summary-value {
    font-size: 32px;
  }
}
</style>