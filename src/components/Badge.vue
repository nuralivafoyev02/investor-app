<template>
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' }, // default, success, error, warning, info
  size: { type: String, default: 'md' }, // sm, md, lg
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 700;
  white-space: nowrap;
}

.badge-sm {
  padding: 2px 8px;
  font-size: 10px;
}

.badge-md {
  padding: 4px 10px;
  font-size: 11px;
}

.badge-lg {
  padding: 6px 14px;
  font-size: 12px;
}

.badge-default {
  background: #f0f0f0;
  color: #666;
}

.badge-success {
  background: #d1f5e0;
  color: #15803d;
}

.badge-error {
  background: #ffe5e5;
  color: #b42318;
}

.badge-warning {
  background: #fff3cd;
  color: #856404;
}

.badge-info {
  background: #dbeafe;
  color: #0c4a6e;
}
</style>
