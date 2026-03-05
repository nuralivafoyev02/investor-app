<template>
  <div>
    <h1>Kirish</h1>
    <button @click="login">Fake Login</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function login() {
  localStorage.setItem('token', 'demo-token')
  router.push('/')
}
</script>