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
import { RouterView } from 'vue-router'
import TheNotifications from '@/ui/base/TheNotifications.vue'
</script>

<style>
.app-root {
  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-main);
}
</style>