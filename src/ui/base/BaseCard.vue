<template>
  <div class="base-card" :class="{ interactive }">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  interactive: Boolean
})
</script>

<style scoped>
.base-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.interactive {
  cursor: pointer;
  transition: var(--trans-fast);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-light);
  background: var(--bg-surface-high);
}

.card-header {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
}

.card-body {
  padding: var(--space-lg);
  flex: 1;
}

.card-footer {
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-main);
  border-top: 1px solid var(--border-light);
}
</style>
