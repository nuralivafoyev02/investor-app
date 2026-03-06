<template>
  <div class="expenses-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('finance.expenses.title') }}</h1>
        <p class="page-subtitle">{{ t('finance.expenses.subtitle') }}</p>
      </div>
      <BaseButton variant="primary" size="md" @click="openAddModal">
        {{ t('finance.expenses.add') }}
      </BaseButton>
    </div>

    <div class="filters-bar glass">
      <div class="search-box">
        <BaseInput
          v-model="searchQuery"
          :placeholder="t('common.search')"
          class="search-input"
        >
          <template #prefix>
            <IconSearch class="icon-sm" />
          </template>
        </BaseInput>
      </div>
    </div>

    <BaseTable
      :columns="columns"
      :data="filteredExpenses"
      :loading="financeStore.loading"
      actions
    >
      <template #cell-amount="{ val }">
        <span class="amount-cell">{{ formatCurrency(val) }}</span>
      </template>

      <template #cell-date="{ val }">
        <span class="date-cell">{{ formatDate(val) }}</span>
      </template>

      <template #actions="{ item }">
        <button class="action-btn delete" @click="confirmDelete(item.id)" :title="t('common.remove')">
          <IconTrash />
        </button>
      </template>
    </BaseTable>

    <!-- Expense Modal -->
    <DashboardModal
      v-if="showModal"
      :title="t('finance.expenses.modal.add')"
      @close="closeModal"
    >
      <form @submit.prevent="handleSave" class="expense-form">
        <div class="form-grid">
          <BaseSelect
            v-model="formData.category"
            :label="t('finance.expenses.form.category')"
            :options="[
              { label: 'Operations', value: 'Operations' },
              { label: 'Marketing', value: 'Marketing' },
              { label: 'Infrastructure', value: 'Infrastructure' },
              { label: 'Personnel', value: 'Personnel' },
              { label: 'Miscellaneous', value: 'Miscellaneous' }
            ]"
            class="span-2"
          />
          <BaseInput
            v-model.number="formData.amount"
            :label="t('finance.expenses.form.amount')"
            type="number"
            placeholder="0"
            required
          />
          <BaseInput
            v-model="formData.date"
            :label="t('finance.expenses.form.date')"
            type="date"
            required
          />
          <BaseTextarea
            v-model="formData.description"
            :label="t('finance.expenses.form.description')"
            placeholder="..."
            rows="2"
            class="span-2"
          />
        </div>
        
        <div class="modal-footer">
          <BaseButton variant="ghost" @click="closeModal">{{ t('common.cancel') }}</BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSaving">{{ t('finance.expenses.add') }}</BaseButton>
        </div>
      </form>
    </DashboardModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()

// Components
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseSelect from '@/ui/base/BaseSelect.vue'
import BaseTable from '@/ui/base/BaseTable.vue'
import BaseTextarea from '@/ui/base/BaseTextarea.vue'
import DashboardModal from '@/features/dashboard/DashboardModal.vue'

// Icons
import IconSearch from '@/ui/icons/IconSearch.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'

const financeStore = useFinanceStore()
const { success, error } = useNotification()

const columns = [
  { key: 'category', label: t('finance.expenses.form.category'), width: '25%' },
  { key: 'description', label: t('finance.expenses.form.description'), width: '35%' },
  { key: 'amount', label: t('common.capital'), width: '20%' },
  { key: 'date', label: t('common.date'), width: '15%' },
]

const searchQuery = ref('')
const showModal = ref(false)
const isSaving = ref(false)

const formData = reactive({
  category: 'Operations',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  description: '',
})

const filteredExpenses = computed(() => {
  return financeStore.expenses.filter(e => {
    return e.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           e.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

const openAddModal = () => {
  Object.assign(formData, { category: 'Operations', amount: 0, date: new Date().toISOString().split('T')[0], description: '' })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await new Promise(r => setTimeout(r, 600))
    financeStore.addExpense({ ...formData })
    success('Expense logged successfully')
    closeModal()
  } catch (err) {
    error('Failed to log expense')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (id) => {
  if (confirm(t('finance.expenses.modal.deleteConfirm'))) {
    financeStore.deleteExpense(id)
    success('Expense log removed')
  }
}
</script>

<style scoped>
.expenses-page {
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

.filters-bar {
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
}

.amount-cell {
  font-weight: 800;
  color: var(--danger);
}

.date-cell {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 700;
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
  color: var(--danger);
  box-shadow: var(--shadow-sm);
}

.expense-form {
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
}
</style>