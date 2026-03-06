<template>
  <Transition name="alert-fade">
    <div v-if="isVisible" :class="['alert', `alert-${type}`]">
      <div class="alert-content">
        <span class="alert-icon">{{ getIcon }}</span>
        <div class="alert-text">
          <div v-if="title" class="alert-title">{{ title }}</div>
          <div class="alert-message">{{ message }}</div>
        </div>
      </div>
      <button v-if="dismissible" class="alert-close" @click="close">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  type: { type: String, default: 'info' }, // success, error, warning, info
  title: { type: String, default: '' },
  message: { type: String, required: true },
  dismissible: { type: Boolean, default: true },
  autoClose: { type: Number, default: 0 }, // 0 = no auto close, ms
})

const isVisible = ref(true)

const getIcon = () => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  }
  return icons[props.type] || 'ℹ'
}

function close() {
  isVisible.value = false
}

watch(() => props.autoClose, (autoClose) => {
  if (autoClose > 0) {
    setTimeout(() => {
      isVisible.value = false
    }, autoClose)
  }
}, { immediate: true })
</script>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.alert-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 12px;
}

.alert-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alert-title {
  font-weight: 700;
}

.alert-message {
  opacity: 0.9;
  font-weight: 500;
}

.alert-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

/* Success */
.alert-success {
  background: #d1f5e0;
  border-color: #a0e0c9;
  color: #15803d;
}

.alert-success .alert-icon {
  background: rgba(21, 128, 61, 0.1);
  color: #15803d;
}

/* Error */
.alert-error {
  background: #ffe5e5;
  border-color: #ffcccc;
  color: #b42318;
}

.alert-error .alert-icon {
  background: rgba(180, 35, 24, 0.1);
  color: #b42318;
}

/* Warning */
.alert-warning {
  background: #fff3cd;
  border-color: #ffe69c;
  color: #856404;
}

.alert-warning .alert-icon {
  background: rgba(133, 100, 4, 0.1);
  color: #856404;
}

/* Info */
.alert-info {
  background: #dbeafe;
  border-color: #bfdbfe;
  color: #0c4a6e;
}

.alert-info .alert-icon {
  background: rgba(12, 74, 110, 0.1);
  color: #0c4a6e;
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.2s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
