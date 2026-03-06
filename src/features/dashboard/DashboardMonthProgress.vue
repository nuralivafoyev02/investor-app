<template>
  <article class="dashboard-card month-progress">
    <div class="card-header">
      <h3 class="card-title">Month Progress</h3>
      <button class="ghost-btn" title="View Analytics" @click="emit('analytics')">
        <IconAnalytics />
      </button>
    </div>

    <div class="month-meta">
      <div class="percentage">{{ progress }}%</div>
      <div class="status-comparison">completed to last month*</div>
    </div>

    <div class="donut-section">
      <div class="overview-list">
        <div class="overview-header">OVERVIEW</div>
        <div class="overview-item">
          <span class="dot work-dot"></span>
          <span>Work</span>
        </div>
        <div class="overview-item">
          <span class="dot meditation-dot"></span>
          <span>Meditation</span>
        </div>
        <div class="overview-item">
          <span class="dot projects-dot"></span>
          <span>Projects</span>
        </div>
      </div>

      <div class="donut-container">
        <svg viewBox="0 0 120 120" class="donut-chart">
          <circle class="donut-track" cx="60" cy="60" r="44" />
          <circle
            class="donut-fill"
            cx="60"
            cy="60"
            r="44"
            :stroke-dasharray="dashArray"
            :stroke-dashoffset="0"
          />
          <text x="60" y="63" text-anchor="middle" class="donut-text">{{ progress }}%</text>
        </svg>
      </div>
    </div>

    <div class="action-footer">
      <button class="icon-pill" @click="emit('share')">
        <IconShare />
      </button>
      <button class="btn-secondary" @click="emit('download')">
        Download Report
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import IconAnalytics from '@/ui/icons/IconAnalytics.vue'
import IconShare from '@/ui/icons/IconShare.vue'

const props = defineProps({
  progress: { type: Number, default: 0 }
})

const emit = defineEmits(['analytics', 'share', 'download'])

const dashArray = computed(() => {
  const r = 44
  const c = 2 * Math.PI * r
  const filled = c * (Math.max(0, Math.min(100, props.progress)) / 100)
  return `${filled} ${c}`
})
</script>

<style scoped>
.dashboard-card {
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
  margin-bottom: var(--space-md);
}

.card-title {
  font-size: 18px;
  font-weight: 700;
}

.ghost-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: var(--trans-fast);
}

.ghost-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-main);
}

.month-meta {
  margin-bottom: var(--space-lg);
}

.percentage {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}

.status-comparison {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 4px;
}

.donut-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.overview-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overview-header {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.work-dot { background: var(--secondary); }
.meditation-dot { background: var(--success); }
.projects-dot { background: var(--warning); }

.donut-container {
  width: 100px;
  height: 100px;
}

.donut-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-track {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 10;
}

.donut-fill {
  fill: none;
  stroke: var(--primary);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.donut-text {
  fill: var(--text-main);
  font-size: 20px;
  font-weight: 800;
  transform: rotate(90deg);
  transform-origin: center;
}

.action-footer {
  display: flex;
  gap: var(--space-sm);
}

.icon-pill {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: var(--trans-fast);
}

.icon-pill:hover {
  background: var(--bg-main);
}

.icon-pill svg {
  width: 20px;
  height: 20px;
  color: var(--text-main);
}

.btn-secondary {
  flex: 1;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--primary);
  color: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: var(--trans-fast);
}

.btn-secondary:hover {
  transform: translateY(-1px);
  background: var(--primary-hover);
}
</style>
