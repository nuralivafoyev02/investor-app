<template>
  <div class="reports-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('reports.title') }}</h1>
        <p class="page-subtitle">{{ t('reports.subtitle') }}</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" size="md" @click="printReport">{{ t('reports.export') }}</BaseButton>
        <BaseButton variant="primary" size="md" @click="generateReport">{{ t('reports.regenerate') }}</BaseButton>
      </div>
    </div>

    <div class="report-controls glass">
      <div class="control-item">
        <label>{{ t('reports.start') }}</label>
        <BaseInput v-model="startDate" type="month" />
      </div>
      <div class="control-item">
        <label>{{ t('reports.end') }}</label>
        <BaseInput v-model="endDate" type="month" />
      </div>
    </div>

    <div v-if="reportData" class="report-body">
      <div class="analytics-grid">
        <BaseCard :title="t('reports.summary')" class="summary-card">
          <div class="finance-overview">
            <div class="overview-item">
              <span class="ov-label">{{ t('reports.revenue') }}</span>
              <span class="ov-value success">{{ formatCurrency(reportData.totalIncome) }}</span>
            </div>
            <div class="overview-item">
              <span class="ov-label">{{ t('reports.expenses') }}</span>
              <span class="ov-value danger">{{ formatCurrency(reportData.totalExpense) }}</span>
            </div>
            <div class="overview-divider"></div>
            <div class="overview-item total">
              <span class="ov-label">{{ t('reports.net') }}</span>
              <span class="ov-value" :class="reportData.netIncome >= 0 ? 'success' : 'danger'">{{ formatCurrency(reportData.netIncome) }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard :title="t('reports.distribution')" class="chart-card">
          <div class="distribution-list">
            <div v-for="item in reportData.expenseBreakdown" :key="item.category" class="dist-item">
              <div class="dist-info">
                <span class="dist-cat">{{ item.category }}</span>
                <span class="dist-amount">{{ formatCurrency(item.amount) }}</span>
              </div>
              <div class="dist-bar-wrap">
                <div class="dist-bar-fill" :style="{ width: `${item.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="detailed-logs">
        <h2 class="section-title">{{ t('reports.breakdown') }}</h2>
        <BaseTable :columns="logColumns" :data="reportData.expenseBreakdown">
          <template #cell-amount="{ val }">
            <span class="table-amount">{{ formatCurrency(val) }}</span>
          </template>
          <template #cell-percentage="{ val }">
            <BaseBadge type="info">{{ val }}%</BaseBadge>
          </template>
        </BaseTable>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-illustration">📈</div>
      <h3>{{ t('reports.noReport') }}</h3>
      <p>{{ t('reports.noReportSubtitle') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useFinanceStore } from '@/stores/finance'
import BaseButton from '@/ui/base/BaseButton.vue'
import BaseInput from '@/ui/base/BaseInput.vue'
import BaseTable from '@/ui/base/BaseTable.vue'
import BaseCard from '@/ui/base/BaseCard.vue'
import BaseBadge from '@/ui/base/BaseBadge.vue'

const { t } = useI18n()
const financeStore = useFinanceStore()
const startDate = ref(new Date().toISOString().slice(0, 7))
const endDate = ref(new Date().toISOString().slice(0, 7))
const reportData = ref(null)

const logColumns = computed(() => [
  { key: 'category', label: t('reports.department'), width: '40%' },
  { key: 'amount', label: t('reports.total'), width: '30%' },
  { key: 'percentage', label: t('reports.allocation'), width: '30%' }
])

const formatCurrency = (value) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(Number(value) || 0)

const inSelectedRange = (dateString) => {
  if (!dateString) return false
  const current = new Date(`${dateString}T00:00:00`)
  const start = new Date(`${startDate.value}-01T00:00:00`)
  const end = new Date(`${endDate.value}-01T23:59:59`)
  end.setMonth(end.getMonth() + 1)
  end.setDate(0)
  end.setHours(23, 59, 59, 999)
  return current >= start && current <= end
}

const buildBreakdown = (expenses) => {
  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const grouped = expenses.reduce((acc, item) => {
    const key = item.category || 'Miscellaneous'
    acc[key] = (acc[key] || 0) + (Number(item.amount) || 0)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpense ? Math.round((amount / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
}

const generateReport = async () => {
  if (!financeStore.cashboxes.length) await financeStore.fetchCashboxes()
  if (!financeStore.expenses.length) await financeStore.fetchExpenses()

  const expenses = financeStore.expenses.filter((item) => inSelectedRange(item.date))
  const totalExpense = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const totalIncome = financeStore.cashboxes.reduce((sum, item) => sum + (Number(item.balance) || 0), 0)

  reportData.value = {
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
    expenseBreakdown: buildBreakdown(expenses)
  }
}

const printReport = () => window.print()

onMounted(async () => {
  await generateReport()
})
</script>

<style scoped>
.reports-page { padding: var(--space-xl); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
.header-actions { display: flex; gap: var(--space-md); }
.page-title { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
.page-subtitle { color: var(--text-muted); font-weight: 600; }
.report-controls { display: flex; gap: var(--space-xl); padding: var(--space-lg); border-radius: var(--radius-lg); margin-bottom: var(--space-xl); }
.control-item { display: flex; flex-direction: column; gap: 8px; }
.control-item label { font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); margin-bottom: var(--space-xxl); }
.finance-overview, .distribution-list { display: flex; flex-direction: column; gap: var(--space-lg); }
.overview-item, .dist-info { display: flex; justify-content: space-between; align-items: center; }
.ov-label { font-weight: 700; color: var(--text-muted); }
.ov-value { font-size: 18px; font-weight: 800; }
.overview-divider { height: 1px; background: var(--border-light); }
.dist-item { display: flex; flex-direction: column; gap: 8px; }
.dist-bar-wrap { height: 8px; background: var(--bg-main); border-radius: var(--radius-full); overflow: hidden; }
.dist-bar-fill { height: 100%; background: var(--primary); }
.empty-state { text-align: center; padding: 100px 20px; color: var(--text-muted); }
@media (max-width: 768px) { .page-header, .report-controls { flex-direction: column; align-items: flex-start; } .analytics-grid { grid-template-columns: 1fr; } }
</style>
