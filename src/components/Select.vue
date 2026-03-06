<template>
  <div class="select-wrapper">
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="['select', { 'error': error }]"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Tanlang' },
  options: { type: Array, required: true }, // [{ label, value }]
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const id = ref(`select-${Math.random().toString(36).slice(2, 9)}`)
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-weight: 700;
  font-size: 12px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.required {
  color: #ef4444;
}

.select {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.select:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.select.error {
  border-color: #b42318;
}

.select.error:focus {
  box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.08);
}

.error-message {
  font-size: 12px;
  color: #b42318;
  font-weight: 600;
}
</style>
