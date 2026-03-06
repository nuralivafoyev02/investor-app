<template>
  <RouterView />
  <NotificationCenter />
</template>

<script setup>
import { RouterView } from 'vue-router'
import NotificationCenter from '@/components/NotificationCenter.vue'
</script>