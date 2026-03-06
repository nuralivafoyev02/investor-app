<template>
  <span class="base-badge" :class="[type, size]">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'default' }, // default, success, warning, error, info
  size: { type: String, default: 'md' } // sm, md
})
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sm { padding: 2px 8px; font-size: 10px; }

.default { background: var(--bg-main); color: var(--text-muted); border: 1px solid var(--border-light); }
.success { background: #d1fae5; color: #065f46; }
.warning { background: #fef3c7; color: #92400e; }
.error { background: #fee2e2; color: #991b1b; }
.info { background: #dbeafe; color: #1e40af; }
</style>
