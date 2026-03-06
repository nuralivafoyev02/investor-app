<template>
  <div class="base-alert" :class="type">
    <div class="alert-icon">
      <span v-if="type === 'success'">✓</span>
      <span v-else-if="type === 'error'">!</span>
      <span v-else-if="type === 'warning'">⚠</span>
      <span v-else>i</span>
    </div>
    <div class="alert-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'info' } // success, error, warning, info
})
</script>

<style scoped>
.base-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
}

.alert-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.success { background: var(--success-bg); color: var(--success-text); border: 1px solid var(--success-text); border-width: 0 0 0 4px; }
.success .alert-icon { background: var(--success); color: #fff; }

.error { background: var(--danger-bg); color: var(--danger-text); border: 1px solid var(--danger-text); border-width: 0 0 0 4px; }
.error .alert-icon { background: var(--danger); color: #fff; }

.warning { background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-text); border-width: 0 0 0 4px; }
.warning .alert-icon { background: var(--warning); color: #fff; }

.info { background: var(--info-bg); color: var(--info-text); border: 1px solid var(--info-text); border-width: 0 0 0 4px; }
.info .alert-icon { background: var(--info); color: #fff; }
</style>
