<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <textarea
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
      class="base-textarea"
      :placeholder="placeholder"
      :rows="rows"
    ></textarea>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  rows: { type: [String, Number], default: 3 }
})
const emit = defineEmits(['update:modelValue'])
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

.base-textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 2px solid var(--bg-main);
  background: var(--bg-main);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  transition: var(--trans-fast);
  resize: vertical;
  font-family: inherit;
}

.base-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: #fff;
}
</style>
