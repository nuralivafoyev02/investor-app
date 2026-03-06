<template>
  <div :class="['card', `card-${variant}`]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
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
  variant: { type: String, default: 'default' }, // default, elevated, outlined
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  transition: all 0.2s;
  overflow: hidden;
}

.card-default {
  background: #fff;
  border: 1px solid #ddd;
}

.card-default:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-elevated {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-elevated:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-outlined {
  background: transparent;
  border: 2px solid #ddd;
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  font-weight: 700;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 12px 16px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}
</style>
