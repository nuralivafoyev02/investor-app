<template>
  <div class="input-group" :class="{ error: !!error }">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        class="base-input"
        :required="required"
        @blur="emit('blur')"
      />
    </div>
    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  required: Boolean
})
const emit = defineEmits(['update:modelValue', 'blur'])
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

.input-wrapper {
  position: relative;
}

.base-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--bg-soft);
  background: var(--bg-soft);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  transition: var(--trans-fast);
}

.base-input:focus {
  outline: none;
  border-color: var(--secondary);
  background: var(--bg-card);
  box-shadow: 0 0 0 4px var(--border-light);
}

.error .base-input {
  border-color: var(--danger);
  background: var(--bg-card);
}

.error-msg {
  font-size: 12px;
  font-weight: 700;
  color: var(--danger);
  margin-left: 4px;
}
</style>
