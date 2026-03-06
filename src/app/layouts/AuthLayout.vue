<template>
  <div class="auth-layout">
    <div class="auth-card">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px 24px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (max-width: 640px) {
  .auth-layout {
    padding: 16px;
  }

  .auth-card {
    padding: 32px 20px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 16px;
    max-width: 100%;
  }
}
</style>