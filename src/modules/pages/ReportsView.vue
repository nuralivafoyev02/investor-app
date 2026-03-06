<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Hisobotlar</h1>
    </div>

    <div class="date-filter">
      <input v-model="startDate" type="month" class="filter-input" />
      <span class="dash">—</span>
      <input v-model="endDate" type="month" class="filter-input" />
      <button @click="generateReport" class="btn-primary">Hisobot yaratish</button>
    </div>

    <div v-if="reportData" class="report-container">
      <div class="report-summary">
        <h2>Xulosa</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <span class="label">Jami kirim</span>
            <span class="value income">{{ reportData.totalIncome.toLocaleString('uz-UZ') }} so'm</span>
          </div>
          <div class="summary-card">
            <span class="label">Jami xarajat</span>
            <span class="value expense">{{ reportData.totalExpense.toLocaleString('uz-UZ') }} so'm</span>
          </div>
          <div class="summary-card">
            <span class="label">Sof daromad</span>
            <span class="value" :class="{ income: reportData.netIncome >= 0, expense: reportData.netIncome < 0 }">
              {{ reportData.netIncome.toLocaleString('uz-UZ') }} so'm
            </span>
          </div>
        </div>
      </div>

      <div class="report-details">
        <h2>Xarajatlar bo'yicha tahlil</h2>
        <div class="details-list">
          <div v-for="item in reportData.expenseBreakdown" :key="item.category" class="detail-item">
            <span class="category">{{ item.category }}</span>
            <div class="bar-container">
              <div class="bar" :style="{ width: item.percentage + '%' }"></div>
            </div>
            <span class="amount">{{ item.amount.toLocaleString('uz-UZ') }} so'm</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="downloadReport" class="btn-action">⬇️ Yuklab olish</button>
        <button @click="printReport" class="btn-action">🖨️ Chop etish</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Hisobot yaratish uchun sana tanlang</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const startDate = ref(new Date().toISOString().slice(0, 7))
const endDate = ref(new Date().toISOString().slice(0, 7))
const reportData = ref(null)

function generateReport() {
  // Dummy data
  reportData.value = {
    totalIncome: 5000000,
    totalExpense: 2300000,
    netIncome: 2700000,
    expenseBreakdown: [
      { category: 'Ish haqi', amount: 1000000, percentage: 43 },
      { category: 'Kommunal xizmat', amount: 400000, percentage: 17 },
      { category: 'Transport', amount: 500000, percentage: 22 },
      { category: 'Boshqa xarajat', amount: 400000, percentage: 18 },
    ]
  }
}

function downloadReport() {
  if (!reportData.value) return
  const data = JSON.stringify(reportData.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hisobot-${startDate.value}.json`
  a.click()
}

function printReport() {
  window.print()
}
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 900;
  margin: 0;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
}

.dash {
  color: #999;
  font-weight: 700;
}

.btn-primary {
  padding: 10px 16px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:hover {
  background: #333;
}

.report-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.report-summary {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eee;
}

.report-summary h2 {
  margin: 0 0 16px;
  font-size: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-card {
  padding: 14px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-card .label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.summary-card .value {
  font-size: 18px;
  font-weight: 900;
  color: #111;
}

.value.income {
  color: #22c55e;
}

.value.expense {
  color: #ef4444;
}

.report-details {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.report-details h2 {
  margin: 0 0 16px;
  font-size: 16px;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category {
  flex: 0 0 140px;
  font-weight: 600;
  font-size: 13px;
  color: #333;
}

.bar-container {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.detail-item .amount {
  flex: 0 0 140px;
  text-align: right;
  font-weight: 700;
  font-size: 12px;
  color: #666;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-action {
  padding: 12px 20px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #eee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

@media print {
  .date-filter,
  .actions {
    display: none;
  }
}

@media (max-width: 640px) {
  .date-filter {
    flex-direction: column;
  }

  .filter-input {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    flex-direction: column;
  }

  .category,
  .detail-item .amount {
    flex: 1;
    width: 100%;
    text-align: left;
  }

  .actions {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }
}
</style>