<template>
  <section class="tasks-container">
    <div v-for="task in tasks" :key="task.id" class="task-card">
      <div class="task-header">
        <h4 class="task-title">{{ task.titleLabel || (task.titleKey ? t(task.titleKey) : task.title) }}</h4>
        <div class="kebab-menu-wrap">
          <button class="kebab-btn" type="button" @click="toggleMenu(task.id)"><IconMore /></button>
          <div v-if="activeMenuId === task.id" class="task-menu" role="menu">
            <button class="menu-item" type="button" @click="emit('note', task.id)"><IconNote /> {{ t('dashboard.tasks.addNote') }}</button>
            <button class="menu-item" type="button" @click="emit('edit', task.id)"><IconEdit /> {{ t('common.edit') }}</button>
            <div class="divider"></div>
            <button class="menu-item danger" type="button" @click="emit('delete', task.id)"><IconTrash /> {{ t('common.delete') }}</button>
          </div>
        </div>
      </div>
      <p class="task-when">{{ task.whenLabel || (task.whenKey ? t(task.whenKey) : task.when) }}</p>
      <div class="task-footer">
        <span class="type-badge" :class="task.type">{{ task.typeLabel }}</span>
        <span class="private-icon" :title="t('dashboard.tasks.private')"><IconShield /></span>
      </div>
    </div>

    <button class="add-task-btn" type="button" @click="emit('add')">
      <div class="plus-circle">＋</div>
      <span class="btn-text">{{ t('dashboard.tasks.add') }}</span>
    </button>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import IconMore from '@/ui/icons/IconMore.vue'
import IconNote from '@/ui/icons/IconNote.vue'
import IconEdit from '@/ui/icons/IconEdit.vue'
import IconTrash from '@/ui/icons/IconTrash.vue'
import IconShield from '@/ui/icons/IconShield.vue'

defineProps({ tasks: { type: Array, required: true } })
const emit = defineEmits(['add', 'edit', 'delete', 'note'])
const { t } = useI18n()
const activeMenuId = ref(null)

const toggleMenu = (id) => {
  activeMenuId.value = activeMenuId.value === id ? null : id
}

const handleClickOutside = (event) => {
  if (activeMenuId.value && !event.target.closest('.kebab-menu-wrap')) {
    activeMenuId.value = null
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.tasks-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-md); }
.task-card { background: var(--bg-card); padding: var(--space-md); border-radius: var(--radius-lg); border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 8px; box-shadow: var(--shadow-sm); transition: var(--trans-fast); }
.task-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.task-header { display: flex; justify-content: space-between; align-items: flex-start; }
.task-title { font-size: 15px; font-weight: 800; color: var(--text-main); line-height: 1.3; }
.kebab-menu-wrap { position: relative; }
.kebab-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: var(--radius-sm); }
.kebab-btn:hover { background: rgba(0,0,0,0.05); }
.task-menu { position: absolute; right: 0; top: 30px; width: 160px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); z-index: 10; padding: 6px; display: flex; flex-direction: column; }
.menu-item { display: flex; align-items: center; gap: 8px; padding: 8px; border: none; background: transparent; font-size: 12px; font-weight: 700; cursor: pointer; border-radius: var(--radius-sm); transition: var(--trans-fast); color: var(--text-main); }
.menu-item:hover { background: var(--bg-main); }
.menu-item.danger { color: var(--danger); }
.task-when { font-size: 11px; font-weight: 700; color: var(--text-muted); }
.task-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; }
.type-badge { font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: var(--radius-full); text-transform: uppercase; }
.type-badge.meeting { background: #e0f2fe; color: #0369a1; }
.type-badge.work { background: #fef3c7; color: #b45309; }
.type-badge.personal { background: #f3e8ff; color: #7e22ce; }
.private-icon { color: var(--text-muted); opacity: 0.5; }
.add-task-btn { border: 2px dashed var(--border-light); background: transparent; border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-sm); padding: var(--space-md); cursor: pointer; transition: var(--trans-fast); }
.add-task-btn:hover { border-color: var(--primary); background: rgba(0,0,0,0.02); }
.plus-circle { width: 32px; height: 32px; border-radius: 50%; background: var(--bg-main); display: grid; place-items: center; font-size: 20px; font-weight: 700; color: var(--text-muted); }
.btn-text { font-size: 14px; font-weight: 800; color: var(--text-muted); }
</style>
