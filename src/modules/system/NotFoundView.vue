<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>Sahifa topilmadi</h1>
      <p>Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirib tashlangan bo'lishi mumkin.</p>
      
      <div class="actions">
        <RouterLink to="/" class="btn-primary">Bosh sahifaga qaytish</RouterLink>
        <button @click="goBack" class="btn-secondary">Orqaga</button>
      </div>

      <div class="suggestions">
        <p class="suggestion-title">Qoidadan, siz bu sahifalarni qidirayotgan bo'lishingiz mumkin:</p>
        <ul>
          <li><RouterLink to="/">Dashboard</RouterLink></li>
          <li><RouterLink to="/investors">Investorlar</RouterLink></li>
          <li><RouterLink to="/projects">Loyihalar</RouterLink></li>
          <li><RouterLink to="/cashboxes">Kassalar</RouterLink></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 80px;
  font-weight: 900;
  color: #111;
  margin-bottom: 16px;
  opacity: 0.9;
}

.not-found-content h1 {
  font-size: 28px;
  font-weight: 900;
  color: #111;
  margin: 0 0 12px;
}

.not-found-content p {
  font-size: 14px;
  color: #666;
  margin: 0 0 28px;
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn-primary:hover {
  background: #333;
}

.btn-secondary {
  background: #f5f5f5;
  color: #111;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #eee;
}

.suggestions {
  text-align: left;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.suggestion-title {
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestions li {
  margin: 0;
}

.suggestions a {
  color: #111;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  display: block;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 6px;
  transition: all 0.2s;
}

.suggestions a:hover {
  background: #efefef;
}

@media (max-width: 640px) {
  .not-found-container {
    min-height: 100vh;
  }

  .not-found-content {
    padding: 32px 20px;
  }

  .error-code {
    font-size: 60px;
  }

  .not-found-content h1 {
    font-size: 22px;
  }

  .actions {
    gap: 10px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>