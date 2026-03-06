<template>
  <article class="dashboard-card projects-card">
    <div class="card-header">
      <h3 class="card-title">{{ t('dashboard.projects.title') }}</h3>
      <button class="ghost-link" type="button" @click="emit('archive')">{{ t('dashboard.projects.archive') }}</button>
    </div>

    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-tile" :class="project.status">
        <div class="proj-header">
          <h4 class="proj-title">{{ project.titleLabel || (project.titleKey ? t(project.titleKey) : project.title) }}</h4>
          <div class="proj-status">
            <span class="status-dot"></span>
            {{ project.statusLabel }}
          </div>
        </div>
        <p class="proj-desc">{{ project.descLabel || project.desc || (project.descKey ? t(project.descKey) : t('dashboard.projects.noDescription')) }}</p>
        <div class="proj-tag-wrap">
          <span class="proj-tag">{{ project.tagLabel || project.tag }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

defineProps({ projects: { type: Array, required: true } })
defineEmits(['archive'])
const { t } = useI18n()
</script>

<style scoped>
.dashboard-card { background: var(--bg-card); border-radius: var(--radius-lg); padding: var(--space-lg); box-shadow: var(--shadow-md); border: 1px solid var(--border-light); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); }
.card-title { font-size: 18px; font-weight: 700; }
.ghost-link { background: transparent; border: none; color: var(--primary); font-weight: 700; cursor: pointer; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-md); }
.project-tile { display: flex; flex-direction: column; gap: 12px; padding: var(--space-md); border-radius: var(--radius-lg); background: var(--bg-main); border: 1px solid var(--border-light); }
.proj-header { display: flex; justify-content: space-between; gap: 12px; }
.proj-title { font-size: 16px; font-weight: 800; color: var(--text-main); }
.proj-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: capitalize; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.proj-desc { font-size: 13px; color: var(--text-muted); font-weight: 500; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.proj-tag { font-size: 10px; font-weight: 800; background: #fff; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--border-light); color: var(--text-muted); }
</style>
