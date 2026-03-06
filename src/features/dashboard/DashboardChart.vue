<template>
  <article class="dashboard-card chart-card">
    <div class="card-header">
      <h3 class="card-title">Weekly Process</h3>
      <button class="ghost-btn" title="Randomize data" @click="emit('randomize')">
        <IconRefresh />
      </button>
    </div>

    <div class="chart-legend">
      <button 
        class="legend-item" 
        :class="{ active: showWork }" 
        @click="showWork = !showWork"
      >
        <span class="swatch work-swatch"></span>
        Work
      </button>
      <button 
        class="legend-item" 
        :class="{ active: showMeditation }" 
        @click="showMeditation = !showMeditation"
      >
        <span class="swatch meditation-swatch"></span>
        Meditation
      </button>
    </div>

    <div class="chart-container" @mouseleave="hoverIndex = null">
      <svg class="dashboard-chart" viewBox="0 0 560 260" role="img" aria-label="Weekly process chart">
        <!-- Grid Lines -->
        <g class="grid-lines" opacity=".08">
          <path v-for="y in 5" :key="y" :d="`M40 ${30 + (y-1)*40} H520`" stroke="currentColor" stroke-width="1" />
        </g>

        <!-- Area Fills -->
        <path v-if="showWork" :d="workAreaPath" class="chart-area work-area" />
        <path v-if="showMeditation" :d="medAreaPath" class="chart-area meditation-area" />

        <!-- Line Paths -->
        <path v-if="showWork" :d="workLinePath" class="chart-line work-line" />
        <path v-if="showMeditation" :d="medLinePath" class="chart-line meditation-line" />

        <!-- Interactive Points -->
        <g v-for="(d, i) in weekDays" :key="d">
          <circle
            v-if="showWork"
            class="chart-point work-point"
            :cx="xScale(i)"
            :cy="yScale(workData[i])"
            r="4"
            @mouseenter="hoverIndex = i"
          />
          <circle
            v-if="showMeditation"
            class="chart-point meditation-point"
            :cx="xScale(i)"
            :cy="yScale(medData[i])"
            r="4"
            @mouseenter="hoverIndex = i"
          />
        </g>

        <!-- Precise Tooltip -->
        <g v-if="hoverIndex !== null" class="chart-tooltip">
          <rect
            :x="Math.min(xScale(hoverIndex) + 12, 380)"
            :y="20"
            width="160"
            height="56"
            rx="12"
          />
          <text :x="Math.min(xScale(hoverIndex) + 24, 392)" y="46" class="tooltip-title">
            {{ DAYS_FULL[hoverIndex] }}
          </text>
          <text :x="Math.min(xScale(hoverIndex) + 24, 392)" y="64" class="tooltip-body">
            W: {{ workData[hoverIndex] }}h • M: {{ medData[hoverIndex] }}h
          </text>
        </g>

        <!-- X-Axis Labels -->
        <g class="axis-labels" opacity=".5">
          <text v-for="(d, i) in weekDays" :key="d" :x="xScale(i)" y="250" text-anchor="middle">
            {{ d }}
          </text>
        </g>
      </svg>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import IconRefresh from '@/ui/icons/IconRefresh.vue'

const props = defineProps({
  workData: { type: Array, required: true },
  medData: { type: Array, required: true }
})

const emit = defineEmits(['randomize'])

const showWork = ref(true)
const showMeditation = ref(true)
const hoverIndex = ref(null)

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Chart Dimensions & Scaling
const CHART_WIDTH = 560
const CHART_HEIGHT = 260
const PADDING = { left: 40, right: 40, top: 30, bottom: 40 }
const INNER_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right
const INNER_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom
const BASE_Y = CHART_HEIGHT - PADDING.bottom

const xScale = (i) => PADDING.left + (i * INNER_WIDTH / 6)
const yScale = (v) => {
  const max = 60
  const normalized = Math.max(0, Math.min(max, v)) / max
  return BASE_Y - (normalized * (BASE_Y - PADDING.top))
}

const linePath = (vals) => {
  return vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')
}

const areaPath = (vals) => {
  const path = linePath(vals)
  const leftX = xScale(0)
  const rightX = xScale(6)
  return `${path} L ${rightX} ${BASE_Y} L ${leftX} ${BASE_Y} Z`
}

const workLinePath = computed(() => linePath(props.workData))
const medLinePath = computed(() => linePath(props.medData))
const workAreaPath = computed(() => areaPath(props.workData))
const medAreaPath = computed(() => areaPath(props.medData))
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
  color: var(--text-main);
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

.ghost-btn svg {
  width: 20px;
  height: 20px;
}

.chart-legend {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--trans-fast);
}

.legend-item.active {
  color: var(--text-main);
  background: var(--bg-main);
}

.swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.work-swatch { background: var(--secondary, #6366f1); }
.meditation-swatch { background: var(--success, #10b981); }

.chart-container {
  width: 100%;
}

.dashboard-chart {
  width: 100%;
  height: auto;
  overflow: visible;
}

.chart-line {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.work-line { stroke: #6366f1; }
.meditation-line { stroke: #10b981; }

.chart-area {
  opacity: 0.1;
  pointer-events: none;
}

.work-area { fill: #6366f1; }
.meditation-area { fill: #10b981; }

.chart-point {
  cursor: pointer;
  transition: r 0.15s ease;
}

.work-point { fill: #6366f1; }
.meditation-point { fill: #10b981; }

.chart-point:hover {
  r: 6;
}

.chart-tooltip {
  pointer-events: none;
}

.chart-tooltip rect {
  fill: var(--primary);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
}

.tooltip-title {
  fill: #fff;
  font-size: 14px;
  font-weight: 800;
}

.tooltip-body {
  fill: rgba(255,255,255,0.7);
  font-size: 11px;
  font-weight: 600;
}

.axis-labels text {
  font-size: 11px;
  font-weight: 700;
  fill: var(--text-muted);
}
</style>
