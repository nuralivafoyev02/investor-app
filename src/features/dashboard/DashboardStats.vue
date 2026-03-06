<template>
  <article class="stats-card premium-dark">
    <div class="card-header">
      <h3 class="card-title">Overall Information</h3>
      <div class="header-tools">
        <button class="ghost-btn" title="Share" @click="emit('share')">
          <IconShare />
        </button>
        <button class="ghost-btn" title="More" @click="emit('more')">
          <IconMore />
        </button>
      </div>
    </div>

    <div class="stats-summary">
      <div class="stat-item">
        <span class="stat-value">{{ stats.tasksDone }}</span>
        <span class="stat-label">Tasks done<br>for all time</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.projectsStopped }}</span>
        <span class="stat-label">Projects<br>are stopped</span>
      </div>
    </div>

    <div class="stats-progress">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
      </div>
      <div class="progress-info">
        <span>{{ overallProgress }}% of monthly plan</span>
      </div>
    </div>

    <div class="mini-stats-grid">
      <div class="mini-stat" @click="emit('navigate', 'projects')">
        <span class="mini-icon">◎</span>
        <span class="mini-label">Projects</span>
        <span class="mini-value">{{ stats.projectsTotal }}</span>
      </div>
      <div class="mini-stat highlighted" @click="emit('navigate', 'progress')">
        <span class="mini-icon">↻</span>
        <span class="mini-label">In Progress</span>
        <span class="mini-value">{{ stats.inProgress }}</span>
      </div>
      <div class="mini-stat" @click="emit('navigate', 'completed')">
        <span class="mini-icon">✓</span>
        <span class="mini-label">Completed</span>
        <span class="mini-value">{{ stats.completed }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import IconShare from '@/ui/icons/IconShare.vue'
import IconMore from '@/ui/icons/IconMore.vue'

const props = defineProps({
  stats: { type: Object, required: true }
})

const emit = defineEmits(['share', 'more', 'navigate'])

const overallProgress = computed(() => {
  const done = props.stats.completed
  const plan = props.stats.monthlyPlan || 1
  return Math.max(0, Math.min(100, Math.round((done / plan) * 100)))
})
</script>

<style scoped>
.stats-card {
  background: var(--primary);
  color: var(--text-on-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  box-shadow: var(--shadow-lg);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  opacity: 0.9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-tools {
  display: flex;
  gap: var(--space-xs);
}

.ghost-btn {
  background: transparent;
  border: none;
  color: var(--text-on-primary);
  opacity: 0.6;
  cursor: pointer;
  padding: 4px;
  transition: var(--trans-fast);
}

.ghost-btn:hover {
  opacity: 1;
}

.stats-summary {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-subtle);
}

.stats-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.progress-track {
  height: 8px;
  background: var(--border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--text-on-primary);
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.progress-info {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 600;
}

.mini-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.mini-stat {
  background: var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: var(--trans-fast);
  border: 1px solid transparent;
}

.mini-stat:hover {
  background: var(--border-light);
  transform: translateY(-2px);
}

.mini-stat.highlighted {
  background: var(--border-light);
  border-color: var(--text-on-primary);
  opacity: 0.9;
}

.mini-icon {
  font-size: 18px;
  opacity: 0.8;
}

.mini-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
}

.mini-value {
  font-size: 18px;
  font-weight: 800;
}
</style>
