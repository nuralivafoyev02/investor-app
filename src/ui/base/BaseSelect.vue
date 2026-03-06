<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <select
      v-bind="selectAttrs"
      :value="modelValue"
      class="base-select"
      @change="handleChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: [String, Number],
  options: { type: Array, required: true },
  label: String,
  placeholder: String
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const selectAttrs = computed(() => attrs)

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  margin-left: 4px;
}

.base-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--bg-soft);
  background: var(--bg-soft);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: var(--trans-fast);
}

.base-select:focus {
  outline: none;
  border-color: var(--secondary);
  background-color: var(--bg-card);
}
</style>
