<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <div class="main-layout">
    <aside class="sidebar">
      <h2>
        <RouterLink class="logo" to="/">Investor app</RouterLink>
      </h2>

      <nav class="menu">
        <RouterLink to="/"><i class="bi bi-grid"></i>Dashboard</RouterLink>
        <RouterLink to="/investors"><i class="bi bi-person-up"></i>Investorlar</RouterLink>
        <RouterLink to="/projects"><i class="bi bi-briefcase"></i>Loyihalar</RouterLink>
        <RouterLink to="/cashboxes"><i class="bi bi-wallet"></i>Kassalar</RouterLink>
        <RouterLink to="/expenses"><i class="bi bi-currency-dollar"></i>Xarajatlar</RouterLink>
        <RouterLink to="/reports"><i class="bi bi-bar-chart"></i>Hisobotlar</RouterLink>
        <li class="nav-name">Integratsiyalar</li>
        <RouterLink to="/cluck-uzbekistan"><i class="bi bi-plug"></i>Click</RouterLink>
        <RouterLink to="/uyqur"><i class="bi bi-phone"></i>Uyqur App</RouterLink>
        <RouterLink to="/monetary"><i class="bi bi-bank"></i>Monetary</RouterLink>
        <li class="nav-name">Sozlamalar</li>
        <RouterLink to="/settings"><i class="bi bi-sliders"></i>Sozlamalar</RouterLink>
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
}
.sidebar {
  width: 260px;
  padding: 24px;
  background: #ffffff3d;
  border-radius: 25px;
  box-shadow: 0 0 30px #00000014;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
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
}
</style>