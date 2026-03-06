<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <div class="main-layout">
    <!-- Mobile menu toggle button -->
    <button class="mobile-menu-btn" @click="sidebarOpen = !sidebarOpen" v-if="isMobile" title="Menu">
      <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar Overlay for mobile -->
    <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>
          <RouterLink class="logo" to="/" @click="sidebarOpen = false">Investor app</RouterLink>
        </h2>
        <button v-if="isMobile" @click="sidebarOpen = false" class="close-btn">×</button>
      </div>

      <nav class="menu">
        <RouterLink to="/" @click="closeSidebar"><i class="bi bi-grid"></i>Dashboard</RouterLink>
        <RouterLink to="/investors" @click="closeSidebar"><i class="bi bi-person-up"></i>Investorlar</RouterLink>
        <RouterLink to="/projects" @click="closeSidebar"><i class="bi bi-briefcase"></i>Loyihalar</RouterLink>
        <RouterLink to="/cashboxes" @click="closeSidebar"><i class="bi bi-wallet"></i>Kassalar</RouterLink>
        <RouterLink to="/expenses" @click="closeSidebar"><i class="bi bi-currency-dollar"></i>Xarajatlar</RouterLink>
        <RouterLink to="/reports" @click="closeSidebar"><i class="bi bi-bar-chart"></i>Hisobotlar</RouterLink>
        <li class="nav-name">Integratsiyalar</li>
        <RouterLink to="/cluck-uzbekistan" @click="closeSidebar"><i class="bi bi-plug"></i>Click</RouterLink>
        <RouterLink to="/uyqur" @click="closeSidebar"><i class="bi bi-phone"></i>Uyqur App</RouterLink>
        <RouterLink to="/monetary" @click="closeSidebar"><i class="bi bi-bank"></i>Monetary</RouterLink>
        <li class="nav-name">Sozlamalar</li>
        <RouterLink to="/settings" @click="closeSidebar"><i class="bi bi-sliders"></i>Sozlamalar</RouterLink>
      </nav>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  width: 44px;
  height: 44px;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  z-index: 997;
  font-size: 20px;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 995;
}

.sidebar {
  width: 260px;
  padding: 24px;
  background: #ffffff3d;
  border-radius: 25px;
  box-shadow: 0 0 30px #00000014;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  position: relative;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h2 {
  margin: 0;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #111;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.menu a {
  color: #131313;
  border: 1px solid #fff;
  padding: 13px 33px;
  border-radius: 15px;
  transition: all 0.1s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu a.router-link-exact-active {
  color: #fff;
  border-color: #e5e7eb;
  background-color: #131313;
}

.menu a:hover {
  color: #131313;
  border-color: #39393953;
}

a.router-link-exact-active:hover {
  color: #fff;
}

.logo.router-link-exact-active:hover {
  color: #131313;
}

.nav-name {
  margin: 20px 0px;
  font-weight: 600;
  color: #13131360;
  text-transform: uppercase;
}

.content {
  flex: 1;
  padding: 24px;
  background: #fff;
  overflow-y: auto;
  width: 100%;
}

.logo {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
    padding: 16px;
  }

  .menu a {
    padding: 10px 20px;
    font-size: 14px;
  }

  .content {
    padding: 20px;
  }
}

/* Mobile (< 768px) */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    height: 100vh;
    border-radius: 0;
    z-index: 996;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .close-btn {
    display: block;
  }

  .content {
    padding: 16px;
    margin-top: 60px;
  }

  .main-layout {
    flex-direction: column;
  }
}

/* Small Mobile (< 480px) */
@media (max-width: 480px) {
  .mobile-menu-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .sidebar {
    width: 100%;
  }

  .content {
    padding: 12px;
    margin-top: 56px;
  }

  .menu a {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const sidebarOpen = ref(false)
const isMobile = ref(false)

function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (window.innerWidth > 768) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>