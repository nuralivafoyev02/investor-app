<template>
  <div class="input-group" :class="{ error: !!error, 'has-prefix': !!$slots.prefix }">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <span v-if="$slots.prefix" class="prefix-slot">
        <slot name="prefix" />
      </span>
      <input
        v-bind="inputAttrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :class="['base-input', { 'with-prefix': !!$slots.prefix }]"
        :required="required"
        @input="handleInput"
        @blur="emit('blur')"
      />
    </div>
    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
  required: Boolean
})

const emit = defineEmits(['update:modelValue', 'blur'])
const attrs = useAttrs()

const inputAttrs = computed(() => attrs)

const handleInput = (event) => {
  const { value } = event.target
  const nextValue = props.type === 'number' ? (value === '' ? '' : Number(value)) : value
  emit('update:modelValue', nextValue)
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

.input-wrapper {
  position: relative;
}

.prefix-slot {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  pointer-events: none;
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

.base-input.with-prefix {
  padding-left: 42px;
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
