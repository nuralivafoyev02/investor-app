<template>
  <article class="dashboard-card chart-card">
    <div class="card-header">
      <h3 class="card-title">{{ t('dashboard.chart.title') }}</h3>
      <button class="ghost-btn" type="button" :title="t('dashboard.chart.randomize')" @click="emit('randomize')">
        <IconRefresh />
      </button>
    </div>

    <div class="chart-legend">
      <button class="legend-item" :class="{ active: showWork }" @click="showWork = !showWork">
        <span class="swatch work-swatch"></span>
        {{ t('dashboard.chart.work') }}
      </button>
      <button class="legend-item" :class="{ active: showMeditation }" @click="showMeditation = !showMeditation">
        <span class="swatch meditation-swatch"></span>
        {{ t('dashboard.chart.meditation') }}
      </button>
    </div>

    <div class="chart-container" @mouseleave="hoverIndex = null">
      <svg class="dashboard-chart" viewBox="0 0 560 260" role="img" :aria-label="t('dashboard.chart.aria')">
        <g class="grid-lines" opacity=".08">
          <path v-for="y in 5" :key="y" :d="`M40 ${30 + (y-1)*40} H520`" stroke="currentColor" stroke-width="1" />
        </g>

        <path v-if="showWork" :d="workAreaPath" class="chart-area work-area" />
        <path v-if="showMeditation" :d="medAreaPath" class="chart-area meditation-area" />
        <path v-if="showWork" :d="workLinePath" class="chart-line work-line" />
        <path v-if="showMeditation" :d="medLinePath" class="chart-line meditation-line" />

        <g v-for="(day, index) in weekDays" :key="day + index">
          <circle v-if="showWork" class="chart-point work-point" :cx="xScale(index)" :cy="yScale(workData[index])" r="4" @mouseenter="hoverIndex = index" />
          <circle v-if="showMeditation" class="chart-point meditation-point" :cx="xScale(index)" :cy="yScale(medData[index])" r="4" @mouseenter="hoverIndex = index" />
        </g>

        <g v-if="hoverIndex !== null" class="chart-tooltip">
          <rect :x="Math.min(xScale(hoverIndex) + 12, 380)" y="20" width="160" height="56" rx="12" />
          <text :x="Math.min(xScale(hoverIndex) + 24, 392)" y="46" class="tooltip-title">{{ fullWeekDays[hoverIndex] }}</text>
          <text :x="Math.min(xScale(hoverIndex) + 24, 392)" y="64" class="tooltip-body">
            {{ t('dashboard.chart.workShort') }}: {{ workData[hoverIndex] }}h • {{ t('dashboard.chart.meditationShort') }}: {{ medData[hoverIndex] }}h
          </text>
        </g>

        <g class="axis-labels" opacity=".5">
          <text v-for="(day, index) in weekDays" :key="day + '-axis-' + index" :x="xScale(index)" y="250" text-anchor="middle">{{ day }}</text>
        </g>
      </svg>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import IconRefresh from '@/ui/icons/IconRefresh.vue'

const props = defineProps({
  workData: { type: Array, required: true },
  medData: { type: Array, required: true }
})

const emit = defineEmits(['randomize'])
const { t } = useI18n()

const showWork = ref(true)
const showMeditation = ref(true)
const hoverIndex = ref(null)

const weekDays = computed(() => [
  t('system.days.short.mon'),
  t('system.days.short.tue'),
  t('system.days.short.wed'),
  t('system.days.short.thu'),
  t('system.days.short.fri'),
  t('system.days.short.sat'),
  t('system.days.short.sun')
])

const fullWeekDays = computed(() => [
  t('system.days.full.mon'),
  t('system.days.full.tue'),
  t('system.days.full.wed'),
  t('system.days.full.thu'),
  t('system.days.full.fri'),
  t('system.days.full.sat'),
  t('system.days.full.sun')
])

const CHART_WIDTH = 560
const CHART_HEIGHT = 260
const PADDING = { left: 40, right: 40, top: 30, bottom: 40 }
const INNER_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right
const BASE_Y = CHART_HEIGHT - PADDING.bottom

const xScale = (index) => PADDING.left + (index * INNER_WIDTH / 6)
const yScale = (value) => {
  const max = 60
  const normalized = Math.max(0, Math.min(max, value)) / max
  return BASE_Y - (normalized * (BASE_Y - PADDING.top))
}

const linePath = (values) => values.map((value, index) => `${index === 0 ? 'M' : 'L'} ${xScale(index)} ${yScale(value)}`).join(' ')
const areaPath = (values) => `${linePath(values)} L ${xScale(6)} ${BASE_Y} L ${xScale(0)} ${BASE_Y} Z`

const workLinePath = computed(() => linePath(props.workData))
const medLinePath = computed(() => linePath(props.medData))
const workAreaPath = computed(() => areaPath(props.workData))
const medAreaPath = computed(() => areaPath(props.medData))
</script>

<style scoped>
.dashboard-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); box-shadow: var(--shadow-md); border: 1px solid var(--border-light); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
.card-title { font-size: 18px; font-weight: 700; color: var(--text-main); }
.ghost-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: var(--radius-sm); transition: var(--trans-fast); }
.ghost-btn:hover { background: rgba(0, 0, 0, 0.04); color: var(--text-main); }
.ghost-btn svg { width: 20px; height: 20px; }
.chart-legend { display: flex; gap: var(--space-md); margin-bottom: var(--space-lg); }
.legend-item { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: var(--radius-full); border: 1px solid var(--border-light); background: transparent; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: var(--trans-fast); }
.legend-item.active { color: var(--text-main); background: var(--bg-main); }
.swatch { width: 8px; height: 8px; border-radius: 50%; }
.work-swatch { background: var(--secondary, #6366f1); }
.meditation-swatch { background: var(--success, #10b981); }
.chart-container { width: 100%; }
.dashboard-chart { width: 100%; height: auto; overflow: visible; }
.chart-line { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.work-line { stroke: #6366f1; }
.meditation-line { stroke: #10b981; }
.chart-area { opacity: 0.1; }
.work-area { fill: #6366f1; }
.meditation-area { fill: #10b981; }
.chart-point { transition: r 0.2s ease; }
.chart-point:hover { r: 6; }
.work-point { fill: #6366f1; }
.meditation-point { fill: #10b981; }
.chart-tooltip rect { fill: rgba(15, 23, 42, 0.95); }
.tooltip-title, .tooltip-body { fill: white; font-size: 12px; font-weight: 600; }
</style>
