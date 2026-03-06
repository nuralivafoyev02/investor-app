<template>
  <button 
    class="btn-base" 
    :class="[variant, size, { loading, disabled }]"
    :type="type"
    :disabled="disabled || loading"
  >
    <div v-if="loading" class="spinner"></div>
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, ghost, danger
  size: { type: String, default: 'md' }, // sm, md, lg
  loading: Boolean,
  disabled: Boolean,
  type: { type: String, default: 'button' }
})
</script>

<style scoped>
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: var(--trans-fast);
  border: none;
  font-family: inherit;
  white-space: nowrap;
}

/* Sizes */
.sm { padding: 8px 16px; font-size: 13px; }
.md { padding: 12px 24px; font-size: 15px; }
.lg { padding: 16px 32px; font-size: 17px; }

/* Variants */
.primary {
  background: var(--primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-md);
}
.primary:hover:not(.disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.secondary {
  background: var(--bg-soft);
  color: var(--text-main);
  border: 1px solid var(--border-light);
}
.secondary:hover:not(.disabled) {
  background: var(--bg-surface-high);
  border-color: var(--text-muted);
}

.ghost {
  background: transparent;
  color: var(--text-muted);
}
.ghost:hover:not(.disabled) {
  background: var(--border-subtle);
  color: var(--text-main);
}

.danger {
  background: var(--danger);
  color: #ffffff;
  opacity: 0.9;
}
.danger:hover:not(.disabled) {
  opacity: 1;
  box-shadow: var(--shadow-md);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.w-full { width: 100%; }
</style>
