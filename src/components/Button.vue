<template>
  <button
    :class="['btn', `btn-${variant}`, `btn-${size}`, { 'is-loading': isLoading }]"
    :disabled="isLoading || disabled"
    v-bind="$attrs"
  >
    <span v-if="isLoading" class="spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, ghost
  size: { type: String, default: 'md' }, // sm, md, lg
  disabled: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  min-height: 44px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f5f5f5;
  color: #111;
  border: 1px solid #ddd;
}

.btn-secondary:hover:not(:disabled) {
  background: #eee;
}

.btn-danger {
  background: #ffe5e5;
  color: #b42318;
}

.btn-danger:hover:not(:disabled) {
  background: #ffcccc;
}

.btn-ghost {
  background: transparent;
  color: #111;
  border: 1px solid #ddd;
}

.btn-ghost:hover:not(:disabled) {
  background: #f5f5f5;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-md {
  padding: 10px 16px;
  font-size: 13px;
}

.btn-lg {
  padding: 12px 20px;
  font-size: 14px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-secondary .spinner {
  border-color: rgba(0, 0, 0, 0.3);
  border-top-color: #111;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
