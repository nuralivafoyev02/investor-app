<template>
  <div class="textarea-wrapper">
    <label v-if="label" :for="id" class="label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="['textarea', { 'error': error }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    ></textarea>
    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-if="hint" class="hint">{{ hint }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  rows: { type: Number, default: 4 },
})

defineEmits(['update:modelValue', 'blur'])

const id = ref(`textarea-${Math.random().toString(36).slice(2, 9)}`)
</script>

<style scoped>
.textarea-wrapper {
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

.textarea {
  padding: 10px 12px;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s;
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.08);
}

.textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.textarea.error {
  border-color: #b42318;
}

.textarea.error:focus {
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
