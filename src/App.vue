<template>
  <div class="app-root">
    <RouterView v-slot="{ Component }">
      <transition name="fade-page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    <TheNotifications />
  </div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import TheNotifications from '@/ui/base/TheNotifications.vue'

const route = useRoute()
const { t, locale } = useI18n()

watchEffect(() => {
  const titleKey = route.meta?.title
  const appTitle = t('system.titles.app')
  document.title = titleKey ? `${t(titleKey)} • ${appTitle}` : appTitle
  document.documentElement.lang = locale.value || 'en'
})
</script>

<style>
.app-root {
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
}
</style>
