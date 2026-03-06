<template>
  <article class="dashboard-card month-progress">
    <div class="card-header">
      <h3 class="card-title">{{ t('dashboard.monthProgress.title') }}</h3>
      <button class="ghost-btn" type="button" :title="t('common.analyticsView')" @click="emit('analytics')"><IconAnalytics /></button>
    </div>

    <div class="month-meta">
      <div class="percentage">{{ progress }}%</div>
      <div class="status-comparison">{{ t('dashboard.monthProgress.caption') }}</div>
    </div>

    <div class="donut-section">
      <div class="overview-list">
        <div class="overview-header">{{ t('dashboard.monthProgress.overview') }}</div>
        <div class="overview-item"><span class="dot work-dot"></span><span>{{ t('dashboard.chart.work') }}</span></div>
        <div class="overview-item"><span class="dot meditation-dot"></span><span>{{ t('dashboard.chart.meditation') }}</span></div>
        <div class="overview-item"><span class="dot projects-dot"></span><span>{{ t('nav.projects') }}</span></div>
      </div>

      <div class="donut-container">
        <svg viewBox="0 0 120 120" class="donut-chart">
          <circle class="donut-track" cx="60" cy="60" r="44" />
          <circle class="donut-fill" cx="60" cy="60" r="44" :stroke-dasharray="dashArray" :stroke-dashoffset="0" />
          <text x="60" y="63" text-anchor="middle" class="donut-text">{{ progress }}%</text>
        </svg>
      </div>
    </div>

    <div class="action-footer">
      <button class="icon-pill" type="button" @click="emit('share')"><IconShare /></button>
      <button class="btn-secondary" type="button" @click="emit('download')">{{ t('dashboard.monthProgress.download') }}</button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import IconAnalytics from '@/ui/icons/IconAnalytics.vue'
import IconShare from '@/ui/icons/IconShare.vue'

const props = defineProps({ progress: { type: Number, default: 0 } })
const emit = defineEmits(['analytics', 'share', 'download'])
const { t } = useI18n()
const dashArray = computed(() => {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const filled = circumference * (Math.max(0, Math.min(100, props.progress)) / 100)
  return `${filled} ${circumference}`
})
</script>

<style scoped>
.dashboard-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); box-shadow: var(--shadow-md); border: 1px solid var(--border-light); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
.card-title { font-size: 18px; font-weight: 700; }
.ghost-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: var(--radius-sm); transition: var(--trans-fast); }
.ghost-btn:hover { background: rgba(0, 0, 0, 0.04); color: var(--text-main); }
.month-meta { margin-bottom: var(--space-lg); }
.percentage { font-size: 36px; font-weight: 800; color: var(--text-main); line-height: 1; }
.status-comparison { font-size: 12px; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
.donut-section { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg); }
.overview-list { display: flex; flex-direction: column; gap: 10px; }
.overview-header { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 4px; }
.overview-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: var(--text-main); }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.work-dot { background: var(--secondary); } .meditation-dot { background: var(--success); } .projects-dot { background: var(--warning); }
.donut-container { width: 100px; height: 100px; }
.donut-chart { width: 100%; height: 100%; transform: rotate(-90deg); }
.donut-track { fill: none; stroke: var(--border-light); stroke-width: 10; }
.donut-fill { fill: none; stroke: var(--primary); stroke-width: 10; stroke-linecap: round; transition: stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1); }
.donut-text { fill: var(--text-main); font-size: 20px; font-weight: 800; transform: rotate(90deg); transform-origin: center; }
.action-footer { display: flex; gap: var(--space-sm); }
.icon-pill { width: 44px; height: 44px; border-radius: var(--radius-full); border: 1px solid var(--border-light); background: transparent; display: grid; place-items: center; cursor: pointer; transition: var(--trans-fast); }
.btn-secondary { flex: 1; border: 1px solid var(--border-light); background: var(--bg-main); border-radius: var(--radius-full); font-weight: 700; cursor: pointer; }
</style>
