<template>
  <div class="investors-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('investors.title') }}</h1>
        <p class="page-subtitle">{{ t('investors.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="openAddModal">{{ t('investors.add') }}</BaseButton>
    </div>

    <div class="filters-bar glass">
      <div class="search-box">
        <BaseInput v-model="searchQuery" :placeholder="t('investors.searchPlaceholder')" class="search-input">
          <template #prefix><IconSearch class="icon-sm" /></template>
        </BaseInput>
      </div>
      <div class="filter-actions">
        <BaseSelect v-model="filterStatus" :options="statusOptions" class="status-select" />
      </div>
    </div>

    <BaseTable :columns="columns" :data="filteredInvestors" :loading="investorStore.loading" actions>
      <template #cell-name="{ item }">
        <div class="investor-identity">
          <div class="avatar-mini">{{ item.name.charAt(0) }}</div>
          <div class="identity-info"><span class="name">{{ item.name }}</span><span class="email">{{ item.email }}</span></div>
        </div>
      </template>
      <template #cell-amount="{ val }"><span class="amount-cell">{{ formatCurrency(val) }}</span></template>
      <template #cell-status="{ val }"><BaseBadge :type="val === 'active' ? 'success' : 'error'">{{ val }}</BaseBadge></template>
      <template #actions="{ item }">
        <div class="row-actions">
          <button class="action-btn edit" type="button" @click="openEditModal(item)" :title="t('common.edit')"><IconEdit /></button>
          <button class="action-btn delete" type="button" @click="confirmDelete(item.id)" :title="t('common.delete')"><IconTrash /></button>
        </div>
      </template>
    </BaseTable>

    <DashboardModal v-if="showModal" :title="editingId ? t('investors.modal.edit') : t('investors.modal.add')" @close="closeModal">
      <form @submit.prevent="handleSave" class="investor-form">
        <div class="form-grid">
          <BaseInput v-model="formData.name" :label="t('investors.form.name')" placeholder="John Doe" required />
          <BaseInput v-model="formData.email" :label="t('investors.form.email')" type="email" placeholder="john@example.com" required />
          <BaseInput v-model="formData.phone" :label="t('investors.form.phone')" placeholder="+998 90 ..." required />
          <BaseInput v-model="formData.amount" :label="t('investors.form.investment')" type="number" placeholder="0" required />
          <BaseSelect v-model="formData.status" :label="t('investors.form.status')" :options="investorStatusOptions" />
        </div>
        <div class="modal-footer">
          <BaseButton variant="ghost" type="button" @click="closeModal">{{ t('common.cancel') }}</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSaving">{{ editingId ? t('investors.modal.update') : t('investors.modal.register') }}</BaseButton>
        </div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useInvestorStore } from '@/stores/investors'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseTable from '@/ui/base/BaseTable.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'
import IconSearch from '@/ui/icons/IconSearch.vue'
import IconEdit from '@/ui/icons/IconEdit.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'

const investorStore = useInvestorStore()
const { success } = useNotification()
const { t } = useI18n()

const columns = computed(() => [
  { key: 'name', label: t('common.investor'), width: '30%' },
  { key: 'phone', label: t('common.phone'), width: '20%' },
  { key: 'amount', label: t('common.capital'), width: '20%' },
  { key: 'status', label: t('common.status'), width: '15%' },
])

const statusOptions = computed(() => [
  { label: t('investors.allStatuses'), value: '' },
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' }
])

const investorStatusOptions = computed(() => [
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' }
])

const searchQuery = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref(null)
const isSaving = ref(false)
const formData = reactive({ name: '', email: '', phone: '', amount: 0, status: 'active' })

const filteredInvestors = computed(() => investorStore.investors.filter((investor) => {
  const query = searchQuery.value.toLowerCase()
  const matchesSearch = investor.name.toLowerCase().includes(query) || investor.email.toLowerCase().includes(query) || investor.phone.includes(searchQuery.value)
  const matchesStatus = !filterStatus.value || investor.status === filterStatus.value
  return matchesSearch && matchesStatus
}))

const formatCurrency = (value) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(value)
const openAddModal = () => { editingId.value = null; Object.assign(formData, { name: '', email: '', phone: '', amount: 0, status: 'active' }); showModal.value = true }
const openEditModal = (item) => { editingId.value = item.id; Object.assign(formData, { ...item }); showModal.value = true }
const closeModal = () => { showModal.value = false }

const handleSave = async () => {
  isSaving.value = true
  try {
    if (editingId.value) {
      await investorStore.updateInvestor(editingId.value, { ...formData, amount: Number(formData.amount) || 0 })
      success(t('common.changesSaved'))
    } else {
      await investorStore.addInvestor({ ...formData, amount: Number(formData.amount) || 0 })
      success(t('common.created', { type: t('common.investor').toLowerCase() }))
    }
    closeModal()
  } finally {
    isSaving.value = false
  }
}

onMounted(() => { investorStore.fetchInvestors() })
const confirmDelete = async (id) => { if (confirm(t('investors.modal.deleteConfirm'))) { await investorStore.deleteInvestor(id); success(t('common.removed')) } }
</script>

<style scoped>
.investors-page { padding: var(--space-xl); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
.page-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
.page-subtitle { color: var(--text-muted); font-weight: 600; }
.filters-bar { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); padding: var(--space-md); border-radius: var(--radius-lg); align-items: flex-end; }
.search-box { flex: 1; }
.status-select { width: 200px; }
.investor-identity { display: flex; align-items: center; gap: 12px; }
.avatar-mini { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-main); color: var(--primary); display: grid; place-items: center; font-weight: 800; font-size: 14px; border: 1px solid var(--border-light); }
.identity-info { display: flex; flex-direction: column; }
.name { font-weight: 700; color: var(--text-main); }
.email { font-size: 12px; color: var(--text-muted); }
.amount-cell { font-weight: 800; color: var(--success); }
.row-actions { display: flex; gap: 8px; justify-content: flex-end; }
.action-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: none; background: var(--bg-main); color: var(--text-muted); cursor: pointer; display: grid; place-items: center; transition: var(--trans-fast); }
.action-btn:hover { background: var(--bg-surface-high); box-shadow: var(--shadow-sm); }
.action-btn.edit:hover { color: var(--primary); }
.action-btn.delete:hover { color: var(--danger); }
.investor-form { padding: var(--space-lg); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
.modal-footer { display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-xl); }
@media (max-width: 768px) { .page-header, .filters-bar, .form-grid { flex-direction: column; grid-template-columns: 1fr; } .status-select { width: 100%; } }
</style>
