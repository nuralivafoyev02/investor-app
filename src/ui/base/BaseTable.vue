<template>
  <div class="table-container glass" :class="{ 'is-loading': loading }">
    <table class="base-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
            {{ col.label }}
          </th>
          <th v-if="actions" class="actions-th">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="i in 5" :key="`skeleton-${i}`">
            <td v-for="col in columns" :key="`col-skeleton-${col.key}`">
              <BaseSkeleton width="80%" height="14px" />
            </td>
            <td v-if="actions">
              <BaseSkeleton width="60px" height="24px" type="button" />
            </td>
          </tr>
        </template>
        <template v-else-if="data.length > 0">
          <tr v-for="(item, index) in data" :key="item.id || index">
            <td v-for="col in columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :val="item[col.key]" :item="item">
                {{ item[col.key] }}
              </slot>
            </td>
            <td v-if="actions" class="actions-td">
              <slot name="actions" :item="item"></slot>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length + (actions ? 1 : 0)" class="empty-cell">
            <div class="empty-state">
              <p>No data found</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BaseSkeleton from './BaseSkeleton.vue'

defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  actions: { type: Boolean, default: false }
})
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  position: relative;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background: var(--bg-main);
  padding: 16px;
  font-size: 12px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-light);
}

td {
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-light);
  transition: var(--trans-fast);
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: var(--border-subtle);
}

.actions-col, .actions-cell {
  width: 80px;
  text-align: right;
}

.empty-cell {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-style: italic;
}

.table-loading-overlay {
  position: absolute;
  inset: 0;
  background: var(--glass-bg);
  display: grid;
  place-items: center;
  backdrop-filter: blur(2px);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
