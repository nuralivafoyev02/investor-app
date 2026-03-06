<template>
  <div class="investors-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('investors.title') }}</h1>
        <p class="page-subtitle">{{ t('investors.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="openAddModal">
        {{ t('investors.add') }}
      </BaseButton>
    </div>

    <div class="filters-bar glass">
      <div class="search-box">
        <BaseInput
          v-model="searchQuery"
          :placeholder="t('investors.searchPlaceholder')"
          class="search-input"
        >
          <template #prefix>
            <IconSearch class="icon-sm" />
          </template>
        </BaseInput>
      </div>
      <div class="filter-actions">
        <BaseSelect
          v-model="filterStatus"
          :options="[
            { label: t('investors.allStatuses'), value: '' },
            { label: t('common.active'), value: 'active' },
            { label: t('common.inactive'), value: 'inactive' }
          ]"
          class="status-select"
        />
      </div>
    </div>

    <BaseTable
      ref="investorTable"
      :columns="columns"
      :data="filteredInvestors"
      :loading="investorStore.loading"
      actions
    >
      <template #cell-name="{ item }">
        <div class="investor-identity">
          <div class="avatar-mini">{{ item.name.charAt(0) }}</div>
          <div class="identity-info">
            <span class="name">{{ item.name }}</span>
            <span class="email">{{ item.email }}</span>
          </div>
        </div>
      </template>

      <template #cell-amount="{ val }">
        <span class="amount-cell">{{ formatCurrency(val) }}</span>
      </template>

      <template #cell-status="{ val }">
        <BaseBadge :type="val === 'active' ? 'success' : 'error'">
          {{ val }}
        </BaseBadge>
      </template>

      <template #actions="{ item }">
        <div class="row-actions">
          <button class="action-btn edit" @click="openEditModal(item)" :title="t('common.edit')">
            <IconEdit />
          </button>
          <button class="action-btn delete" @click="confirmDelete(item.id)" :title="t('common.delete')">
            <IconTrash />
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- Investor Modal -->
    <DashboardModal
      v-if="showModal"
      :title="editingId ? t('investors.modal.edit') : t('investors.modal.add')"
      @close="closeModal"
    >
      <form @submit.prevent="handleSave" class="investor-form">
        <div class="form-grid">
          <BaseInput
            v-model="formData.name"
            :label="t('investors.form.name')"
            placeholder="John Doe"
            required
          />
          <BaseInput
            v-model="formData.email"
            :label="t('investors.form.email')"
            type="email"
            placeholder="john@example.com"
            required
          />
          <BaseInput
            v-model="formData.phone"
            :label="t('investors.form.phone')"
            placeholder="+998 90 ..."
            required
          />
          <BaseInput
            v-model.number="formData.amount"
            :label="t('investors.form.investment')"
            type="number"
            placeholder="0"
            required
          />
          <BaseSelect
            v-model="formData.status"
            :label="t('investors.form.status')"
            :options="[
              { label: t('common.active'), value: 'active' },
              { label: t('common.inactive'), value: 'inactive' }
            ]"
          />
        </div>
        
        <div class="modal-footer">
          <BaseButton variant="ghost" @click="closeModal">{{ t('common.cancel') }}</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSaving">
            {{ editingId ? t('investors.modal.update') : t('investors.modal.register') }}
          </BaseButton>
        </div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useInvestorStore } from '@/stores/investors'
import { useNotification } from '@/composables/useNotification'

// Components
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseTable from '@/ui/base/BaseTable.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'

// Icons
import IconSearch from '@/ui/icons/IconSearch.vue'
import IconEdit from '@/ui/icons/IconEdit.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'

const investorStore = useInvestorStore()
const { success, error } = useNotification()
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
import { onMounted } from 'vue'

const columns = [
  { key: 'name', label: t('common.investor'), width: '30%' },
  { key: 'phone', label: t('common.phone'), width: '20%' },
  { key: 'amount', label: t('common.capital'), width: '20%' },
  { key: 'status', label: t('common.status'), width: '15%' },
]

const searchQuery = ref('')
const filterStatus = ref('')
const showModal = ref(false)
const editingId = ref(null)
const isSaving = ref(false)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  amount: 0,
  status: 'active',
})

const filteredInvestors = computed(() => {
  return investorStore.investors.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         i.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         i.phone.includes(searchQuery.value)
    const matchesStatus = !filterStatus.value || i.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}

const openAddModal = () => {
  editingId.value = null
  Object.assign(formData, { name: '', email: '', phone: '', amount: 0, status: 'active' })
  showModal.value = true
}

const openEditModal = (item) => {
  editingId.value = item.id
  Object.assign(formData, { ...item })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  isSaving.value = true
  try {
    if (editingId.value) {
      await investorStore.updateInvestor(editingId.value, { ...formData })
      success('Investor profile updated successfully')
    } else {
      await investorStore.addInvestor({ ...formData })
      success('New investor onboarded successfully')
    }
    closeModal()
  } catch (err) {
    // Error is handled by service + useApi
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  investorStore.fetchInvestors()
})

const confirmDelete = (id) => {
  if (confirm(t('investors.modal.deleteConfirm'))) {
    investorStore.deleteInvestor(id)
    success('Investor removed from portfolio')
  }
}
</script>

<style scoped>
.investors-page {
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
  margin-bottom: 4px;
}

.page-subtitle {
  color: var(--text-muted);
  font-weight: 600;
}

.filters-bar {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  align-items: flex-end;
}

.search-box {
  flex: 1;
}

.status-select {
  width: 200px;
}

.investor-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-mini {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-main);
  color: var(--primary);
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  border: 1px solid var(--border-light);
}

.identity-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 700;
  color: var(--text-main);
}

.email {
  font-size: 12px;
  color: var(--text-muted);
}

.amount-cell {
  font-weight: 800;
  color: var(--success);
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--bg-main);
  color: var(--text-muted);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: var(--trans-fast);
}

.action-btn:hover {
  background: var(--bg-surface-high);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.action-btn.delete:hover {
  color: var(--danger);
}

.investor-form {
  padding: var(--space-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
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
  
  .filters-bar {
    flex-direction: column;
  }
  
  .status-select {
    width: 100%;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>