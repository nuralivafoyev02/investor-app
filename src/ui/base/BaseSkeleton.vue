<template>
  <div 
    class="base-skeleton" 
    :class="[type, { 'animate-pulse': pulse }]"
    :style="customStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text', // text, avatar, button, card, circle
    validator: (val) => ['text', 'avatar', 'button', 'card', 'circle', 'box'].includes(val)
  },
  width: { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  pulse: { type: Boolean, default: true }
})

const customStyle = computed(() => ({
  width: props.width,
  height: props.height
}))
</script>

<style scoped>
.base-skeleton {
  background: var(--bg-soft);
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.base-skeleton::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0,
    var(--glass-border) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.circle {
  border-radius: 50%;
}

.button {
  border-radius: var(--radius-full);
  height: 40px;
}

.card {
  border-radius: var(--radius-lg);
  height: 200px;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
