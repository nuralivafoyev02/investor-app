<template>
  <div class="table-wrapper">
    <table class="table">
      <thead v-if="!hideHeader">
        <tr>
          <th v-for="column in columns" :key="column.key" :style="{ width: column.width }">
            {{ column.label }}
          </th>
          <th v-if="hasActions" style="width: 80px; text-align: center;">Amallar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + (hasActions ? 1 : 0)" class="empty-cell">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr v-for="(row, idx) in rows" :key="idx">
          <td v-for="column in columns" :key="column.key">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ formatValue(row[column.key], column.type) }}
            </slot>
          </td>
          <td v-if="hasActions" class="action-cell">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label, type?, width? }]
  rows: { type: Array, required: true },
  hideHeader: { type: Boolean, default: false },
  emptyMessage: { type: String, default: 'Hech narsa topilmadi' },
  hasActions: { type: Boolean, default: false },
})

function formatValue(value, type) {
  if (!value) return '—'
  if (type === 'currency' && typeof value === 'number') {
    return value.toLocaleString('uz-UZ') + ' so\'m'
  }
  if (type === 'date' && value instanceof Date) {
    return value.toLocaleDateString('uz-UZ')
  }
  return value
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

th {
  padding: 12px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #333;
}

tbody tr:hover {
  background: #f9f9f9;
}

tbody tr:last-child td {
  border-bottom: none;
}

.empty-cell {
  text-align: center;
  padding: 40px !important;
  color: #999;
  font-weight: 600;
}

.action-cell {
  text-align: center;
}

@media (max-width: 640px) {
  th, td {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
