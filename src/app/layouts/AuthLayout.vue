<template>
  <div class="auth-layout">
    <div class="ambient-bg"></div>
    
    <main class="auth-content">
      <div class="auth-card glass premium-glow">
        <RouterView v-slot="{ Component }">
          <transition name="auth-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
      
      <p class="auth-footer">
        © {{ new Date().getFullYear() }} Investor App. Built for excellence.
      </p>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background-color: var(--bg-main);
  position: relative;
  overflow: hidden;
  padding: var(--space-md);
}

.ambient-bg {
  position: absolute;
  inset: -100px;
  background: var(--grad-ambient);
  filter: blur(60px);
  z-index: 0;
}

.auth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  align-items: center;
}

.auth-card {
  width: 100%;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  background: var(--glass-bg);
}

.auth-footer {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  opacity: 0.6;
}

/* Transitions */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 480px) {
  .auth-card {
    padding: var(--space-lg);
  }
}
</style>