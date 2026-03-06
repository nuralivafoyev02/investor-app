<template>
  <div class="finance-page">
    <div class="page-header">
      <div class="header-content"><h1 class="page-title">{{ t('finance.vaults.title') }}</h1><p class="page-subtitle">{{ t('finance.vaults.subtitle') }}</p></div>
      <BaseButton variant="primary" size="md" @click="openAddModal">{{ t('finance.vaults.create') }}</BaseButton>
    </div>

    <div class="vaults-summary"><div class="summary-card glass premium-glow"><span class="summary-label">{{ t('finance.vaults.totalAssets') }}</span><span class="summary-value">{{ formatCurrency(totalBalance) }}</span></div></div>

    <div class="vaults-grid">
      <template v-if="financeStore.loading">
        <BaseCard v-for="i in 3" :key="`skeleton-${i}`" class="vault-card"><div class="vault-body"><BaseSkeleton width="70%" height="24px" class="mb-4" /><BaseSkeleton width="40%" height="16px" class="mb-2" /><BaseSkeleton width="100%" height="40px" type="button" /></div></BaseCard>
      </template>
      <template v-else>
        <BaseCard v-for="vault in financeStore.cashboxes" :key="vault.id" class="vault-card" :style="{ borderTop: `4px solid ${vault.color}` }">
          <template #header><div class="vault-header"><div class="vault-info"><h3 class="vault-name">{{ vault.name }}</h3><BaseBadge :type="vault.type === 'Cash' ? 'info' : 'success'">{{ vault.type }}</BaseBadge></div><button class="delete-btn" type="button" @click="confirmDelete(vault.id)" :title="t('common.remove')"><IconTrash class="icon-sm" /></button></div></template>
          <div class="vault-body"><div class="balance-display"><span class="balance-label">{{ t('finance.vaults.balance') }}</span><span class="balance-amount">{{ formatCurrency(vault.balance) }}</span></div><div class="vault-actions"><BaseButton variant="secondary" size="sm" class="w-full">{{ t('finance.vaults.transfer') }}</BaseButton></div></div>
        </BaseCard>
      </template>
    </div>

    <DashboardModal v-if="showModal" :title="t('finance.vaults.modal.title')" @close="closeModal">
      <form @submit.prevent="handleSave" class="vault-form">
        <div class="form-grid">
          <BaseInput v-model="formData.name" :label="t('finance.vaults.form.name')" placeholder="E.g. Main Reserve" required class="span-2" />
          <BaseSelect v-model="formData.type" :label="t('finance.vaults.form.type')" :options="typeOptions" />
          <BaseInput v-model="formData.balance" :label="t('finance.vaults.form.balance')" type="number" placeholder="0" required />
          <BaseInput v-model="formData.color" :label="t('finance.vaults.form.color')" type="color" />
        </div>
        <div class="modal-footer"><BaseButton variant="ghost" type="button" @click="closeModal">{{ t('common.cancel') }}</BaseButton><BaseButton type="submit" variant="primary" :loading="isSaving">{{ t('finance.vaults.modal.confirm') }}</BaseButton></div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import BaseSkeleton from '@/ui/base/BaseSkeleton.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'

const financeStore = useFinanceStore()
const { success } = useNotification()
const { t } = useI18n()

const showModal = ref(false)
const isSaving = ref(false)
const formData = reactive({ name: '', type: 'Cash', balance: 0, color: '#6366f1' })
const totalBalance = computed(() => financeStore.cashboxes.reduce((sum, item) => sum + Number(item.balance || 0), 0))
const typeOptions = computed(() => [
  { label: t('finance.vaults.form.types.cash'), value: 'Cash' },
  { label: t('finance.vaults.form.types.card'), value: 'Card' },
  { label: t('finance.vaults.form.types.bank'), value: 'Bank' }
])

const formatCurrency = (value) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value)
const openAddModal = () => { Object.assign(formData, { name: '', type: 'Cash', balance: 0, color: '#6366f1' }); showModal.value = true }
const closeModal = () => { showModal.value = false }
const handleSave = async () => {
  isSaving.value = true
  try { await financeStore.addCashbox({ ...formData, balance: Number(formData.balance) || 0 }); success(t('common.created', { type: t('finance.vaults.title').toLowerCase() })); closeModal() }
  finally { isSaving.value = false }
}
onMounted(() => { financeStore.fetchCashboxes() })
const confirmDelete = async (id) => { if (confirm(t('finance.vaults.modal.decommissionConfirm'))) { await financeStore.deleteCashbox(id); success(t('common.removed')) } }
</script>

<style scoped>
.finance-page { padding: var(--space-xl); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
.page-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
.page-subtitle { color: var(--text-muted); font-weight: 600; }
.vaults-summary { margin-bottom: var(--space-xl); }
.summary-card { padding: var(--space-xl); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 8px; background: var(--grad-ambient); color: var(--text-main); border: 1px solid var(--border-light); }
.summary-label { color: var(--text-muted); font-weight: 700; } .summary-value { font-size: 30px; font-weight: 900; }
.vaults-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg); }
.vault-header { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
.vault-name { font-size: 18px; font-weight: 800; }
.balance-display { display: flex; flex-direction: column; gap: 6px; margin-bottom: var(--space-lg); }
.balance-amount { font-size: 28px; font-weight: 900; }
.delete-btn { background: transparent; border: none; cursor: pointer; color: var(--text-muted); }
.vault-form { padding: var(--space-lg); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); } .span-2 { grid-column: span 2; }
.modal-footer { display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-xl); }
@media (max-width: 768px) { .page-header, .form-grid { flex-direction: column; grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } }
</style>
