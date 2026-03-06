<template>
  <div v-if="isLoading" :class="['loading', `loading-${size}`]">
    <div class="spinner"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  isLoading: { type: Boolean, default: true },
  message: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm, md, lg
})
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
}

.loading-sm {
  padding: 16px;
  gap: 12px;
}

.loading-lg {
  padding: 48px;
  gap: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-md .spinner {
  width: 40px;
  height: 40px;
}

.loading-sm .spinner {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.loading-lg .spinner {
  width: 56px;
  height: 56px;
  border-width: 5px;
}

.loading-message {
  color: #666;
  font-weight: 600;
  font-size: 13px;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
