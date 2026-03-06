<template>
  <header class="dashboard-header">
    <div class="user-greeting">
      <h1 class="greeting-text">{{ t('dashboard.greeting', { name: userName }) }}</h1>
      <p class="greeting-sub">{{ t('dashboard.subtitle') }}</p>
    </div>

    <div class="header-actions">
      <div class="create-dropdown" ref="dropdownRef">
        <button class="btn-primary" @click="toggleMenu">
          <span class="plus-icon">＋</span>
          {{ t('dashboard.actions.create') }}
        </button>
        <div v-if="isMenuOpen" class="dropdown-menu" role="menu">
          <button class="menu-item" @click="emit('create', 'task')">{{ t('dashboard.actions.newTask') }}</button>
          <button class="menu-item" @click="emit('create', 'project')">{{ t('dashboard.actions.newProject') }}</button>
          <div class="menu-divider"></div>
          <button class="menu-item" @click="emit('download')">{{ t('dashboard.actions.downloadReport') }}</button>
        </div>
      </div>

      <button class="icon-btn" title="Search" @click="emit('search')">
        <IconSearch />
      </button>
      <button class="icon-btn" title="Notifications" @click="emit('notifications')">
        <IconBell />
      </button>
      <button class="avatar-btn" title="Profile" @click="emit('profile')">
        <span>{{ initials }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
// Native click outside logic implemented below
import IconSearch from '@/ui/icons/IconSearch.vue'
import IconBell from '@/ui/icons/IconBell.vue'

const props = defineProps({
  userName: { type: String, default: 'Investor' }
})

const emit = defineEmits(['create', 'download', 'search', 'notifications', 'profile'])

import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()

const isMenuOpen = ref(false)
const dropdownRef = ref(null)

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
const initials = computed(() => props.userName.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() || 'U')

// Simple click outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

import { onMounted, onUnmounted } from 'vue'
onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.greeting-text {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.user-name {
  color: var(--primary);
}

.greeting-sub {
  color: var(--text-muted);
  margin-top: 4px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.create-dropdown {
  position: relative;
}

.btn-primary {
  height: 40px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-full);
  background: var(--primary);
  color: var(--text-on-primary);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-md);
  transition: var(--trans-fast);
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: var(--primary-hover);
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: var(--trans-fast);
}

.icon-btn:hover {
  background: var(--bg-surface-high);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  color: var(--text-main);
}

.avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-weight: 800;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 48px;
  width: 200px;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-premium);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: var(--trans-fast);
}

.menu-item:hover {
  background: var(--border-subtle);
}

.menu-divider {
  height: 1px;
  background: var(--border-light);
  margin: var(--space-sm) 0;
}
</style>
