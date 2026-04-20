<template>
  <div class="app">
    <div class="bg-orb orb-green"></div>
    <div class="bg-orb orb-teal"></div>

    <header class="app-header">
      <div class="header-badge">PRICE MANAGER</div>
      <h1>Gerenciador de Itens</h1>
      <p class="header-sub">Adicione, visualize e gerencie seus itens com preços</p>
    </header>

    <main class="app-main">
      <HomeView />
    </main>
  </div>
</template>

<script setup>
import HomeView from './views/HomeView.vue'
</script>

<style>
@import './assets/base.css';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 60px 48px 80px;
  gap: 48px;
  position: relative;
  overflow-x: hidden;
}

.bg-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(120px);
  opacity: 0.07;
}

.orb-green { width: 600px; height: 600px; background: #4ade80; top: -200px; right: -200px; }
.orb-teal  { width: 400px; height: 400px; background: #2dd4bf; bottom: -100px; left: -100px; }

.app-header { position: relative; z-index: 1; }

.header-badge {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 4px;
  color: #4ade80;
  margin-bottom: 12px;
  display: inline-block;
  border: 1px solid #1e3a2a;
  border-radius: 6px;
  padding: 4px 10px;
  background: #0d1f13;
}

h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #f0f0f0;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.header-sub {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #333;
  letter-spacing: 1px;
}

.app-main {
  display: flex;
  gap: 36px;
  align-items: flex-start;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}

@media (max-width: 800px) {
  .app { padding: 32px 20px 60px; }
  .app-main { flex-direction: column; }
}
</style>