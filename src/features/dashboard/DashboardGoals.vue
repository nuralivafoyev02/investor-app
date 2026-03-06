<template>
  <article class="dashboard-card goals-card">
    <div class="card-header">
      <h3 class="card-title">Month Goal’s</h3>
      <div class="header-tools">
        <div class="goal-chip">{{ completedCount }}/{{ goals.length }}</div>
        <button class="ghost-btn" title="Edit Goals" @click="emit('edit')">
          <IconEdit />
        </button>
      </div>
    </div>

    <div class="goals-list">
      <div v-for="goal in goals" :key="goal.id" class="goal-item" :class="{ completed: goal.done }">
        <label class="goal-checkbox-container">
          <input 
            type="checkbox" 
            :checked="goal.done" 
            @change="emit('toggle', goal.id)"
          />
          <span class="checkmark"></span>
        </label>
        <div class="goal-content">
          <span class="goal-text">{{ goal.text }}</span>
          <span class="goal-time">{{ goal.time }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import IconEdit from '@/ui/icons/IconEdit.vue'

const props = defineProps({
  goals: { type: Array, required: true }
})

const emit = defineEmits(['toggle', 'edit'])

const completedCount = computed(() => props.goals.filter(g => g.done).length)
</script>

<style scoped>
.goals-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.goal-chip {
  background: var(--bg-main);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 800;
  color: var(--text-main);
  border: 1px solid var(--border-light);
}

.ghost-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: var(--trans-fast);
}

.ghost-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-main);
}

.ghost-btn svg {
  width: 18px;
  height: 18px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--bg-main);
  transition: var(--trans-fast);
}

.goal-item.completed {
  opacity: 0.6;
}

.goal-checkbox-container {
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.goal-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 2px solid var(--border-light);
  border-radius: 6px;
  transition: var(--trans-fast);
}

.goal-checkbox-container:hover input ~ .checkmark {
  border-color: var(--primary);
}

.goal-checkbox-container input:checked ~ .checkmark {
  background-color: var(--primary);
  border-color: var(--primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.goal-checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.goal-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.goal-time {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-muted);
}
</style>
