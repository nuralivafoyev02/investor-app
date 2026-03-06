<template>
  <div class="notification-container">
    <transition-group name="notif-list">
      <div 
        v-for="n in notifications" 
        :key="n.id" 
        class="notification-item glass"
        :class="n.type"
      >
        <div class="notif-icon">
          <span v-if="n.type === 'success'">✓</span>
          <span v-else-if="n.type === 'error'">✕</span>
          <span v-else-if="n.type === 'warning'">!</span>
          <span v-else>i</span>
        </div>
        <div class="notif-content">
          <div v-if="n.title" class="notif-title">{{ n.title }}</div>
          <div class="notif-message">{{ n.message }}</div>
        </div>
        <button class="notif-close" @click="remove(n.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notifications, remove } = useNotification()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.notification-item {
  pointer-events: auto;
  min-width: 320px;
  max-width: 400px;
  padding: 16px;
  border-radius: var(--radius-lg);
  display: flex;
  gap: 12px;
  align-items: flex-start;
  box-shadow: var(--shadow-lg);
  border-left: 4px solid transparent;
}

.notification-item.success { border-left-color: var(--success); }
.notification-item.error { border-left-color: var(--danger); }
.notification-item.warning { border-left-color: var(--warning); }
.notification-item.info { border-left-color: var(--primary); }

.notif-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
}

.success .notif-icon { 
  background: var(--success); 
  color: #ffffff; 
  opacity: 0.9;
}
.error .notif-icon { 
  background: var(--danger); 
  color: #ffffff; 
  opacity: 0.9;
}
.warning .notif-icon { 
  background: var(--warning); 
  color: #ffffff; 
  opacity: 0.9;
}
.info .notif-icon { 
  background: var(--info); 
  color: #ffffff; 
  opacity: 0.9;
}

.notif-content {
  flex: 1;
}

.notif-title {
  font-weight: 800;
  font-size: 14px;
  color: var(--text-main);
  margin-bottom: 2px;
}

.notif-message {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
  line-height: 1.4;
}

.notif-close {
  background: transparent;
  border: none;
  font-size: 18px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.notif-close:hover {
  opacity: 1;
}

/* Transitions */
.notif-list-enter-active,
.notif-list-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notif-list-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}

.notif-list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
