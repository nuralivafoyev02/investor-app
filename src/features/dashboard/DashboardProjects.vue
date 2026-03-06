<template>
  <article class="dashboard-card projects-card">
    <div class="card-header">
      <h3 class="card-title">Last Project’s</h3>
      <button class="ghost-link" @click="emit('archive')">Open archive</button>
    </div>

    <div class="projects-grid">
      <div 
        v-for="proj in projects" 
        :key="proj.id" 
        class="project-tile"
        :class="proj.status"
      >
        <div class="proj-header">
          <h4 class="proj-title">{{ proj.title }}</h4>
          <div class="proj-status">
            <span class="status-dot"></span>
            {{ proj.statusLabel }}
          </div>
        </div>
        <p class="proj-desc">{{ proj.desc || 'No description provided.' }}</p>
        <div class="proj-tag-wrap">
          <span class="proj-tag">{{ proj.tag }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  projects: { type: Array, required: true }
})

const emit = defineEmits(['archive'])
</script>

<style scoped>
.projects-card {
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

.ghost-link {
  background: transparent;
  border: none;
  color: var(--secondary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.ghost-link:hover {
  background: rgba(99, 102, 241, 0.05);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.project-tile {
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  background: var(--bg-main);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: var(--trans-fast);
}

.project-tile:hover {
  transform: scale(1.01);
  box-shadow: var(--shadow-md);
}

.project-tile.completed {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.project-tile.completed .status-dot {
  background: var(--success);
}

.project-tile.inprogress .status-dot {
  background: var(--warning);
}

.proj-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.proj-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
}

.proj-status {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: capitalize;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.proj-desc {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 500;
  line-height: 1.5;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}

.proj-tag-wrap {
  margin-top: auto;
}

.proj-tag {
  font-size: 10px;
  font-weight: 800;
  background: #fff;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
}
</style>
