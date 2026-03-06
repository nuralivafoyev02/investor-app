<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>{{ t('system.notFound.title') }}</h1>
      <p>{{ t('system.notFound.description') }}</p>

      <div class="actions">
        <RouterLink to="/" class="btn-primary">{{ t('common.home') }}</RouterLink>
        <button @click="goBack" class="btn-secondary">{{ t('common.back') }}</button>
      </div>

      <div class="suggestions">
        <p class="suggestion-title">{{ t('system.notFound.suggestions') }}</p>
        <ul>
          <li><RouterLink to="/">{{ t('nav.dashboard') }}</RouterLink></li>
          <li><RouterLink to="/investors">{{ t('nav.investors') }}</RouterLink></li>
          <li><RouterLink to="/projects">{{ t('nav.projects') }}</RouterLink></li>
          <li><RouterLink to="/cashboxes">{{ t('nav.vaults') }}</RouterLink></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const { t } = useI18n()

function goBack() {
  router.back()
}
</script>

<style scoped>
.not-found-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: var(--bg-main); }
.not-found-content { text-align: center; background: var(--bg-card); padding: 40px; border-radius: 16px; box-shadow: var(--shadow-lg); max-width: 500px; width: 100%; border: 1px solid var(--border-light); }
.error-code { font-size: 80px; font-weight: 900; color: var(--text-main); margin-bottom: 16px; opacity: 0.9; }
.not-found-content h1 { font-size: 28px; font-weight: 900; color: var(--text-main); margin: 0 0 12px; }
.not-found-content p { font-size: 14px; color: var(--text-muted); margin: 0 0 28px; line-height: 1.6; }
.actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
.btn-primary, .btn-secondary { padding: 12px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { opacity: 0.9; }
.btn-secondary { background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border-light); }
.btn-secondary:hover { background: var(--border-subtle); }
.suggestions { text-align: left; padding-top: 24px; border-top: 1px solid var(--border-light); }
.suggestion-title { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px; }
.suggestions ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.suggestions li { margin: 0; }
.suggestions a { color: var(--text-main); text-decoration: none; font-weight: 600; font-size: 13px; display: block; padding: 8px 12px; background: var(--bg-main); border-radius: 6px; transition: all 0.2s; }
.suggestions a:hover { background: var(--border-subtle); }
@media (max-width: 640px) { .not-found-container { min-height: 100vh; } .not-found-content { padding: 32px 20px; } .error-code { font-size: 60px; } .not-found-content h1 { font-size: 22px; } .actions { gap: 10px; } .btn-primary, .btn-secondary { width: 100%; } }
</style>
