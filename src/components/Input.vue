<template>
  <div class="input-wrapper">
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input', { 'error': error }]"
      @input="handleInput"
      @blur="$emit('blur')"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-if="hint" class="hint">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  trim: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const id = ref(`input-${Math.random().toString(36).slice(2, 9)}`)

function handleInput(e) {
  let value = e.target.value
  if (props.trim && props.type === 'email') {
    value = value.trim()
  }
  emit('update:modelValue', value)
}
</script>

<style scoped>
.input-wrapper {
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

.input {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input.error {
  border-color: #b42318;
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.08);
}

.error-message {
  font-size: 12px;
  color: #b42318;
  font-weight: 600;
}

.hint {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}
</style>
