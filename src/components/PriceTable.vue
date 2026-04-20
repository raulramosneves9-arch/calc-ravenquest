<script setup>
import { ref, computed, onMounted } from 'vue'
import { useItems, CATEGORIES } from '../composables/useItems.js'
import ItemCard from './ItemCard.vue'

const { items, grandTotal, removeItem, startEdit, loadFromStorage, fmt } = useItems()

const activeFilter = ref('Todos')

const filteredItems = computed(() => {
  if (activeFilter.value === 'Todos') return items.value
  return items.value.filter(i => i.category === activeFilter.value)
})

const filteredTotal = computed(() =>
  filteredItems.value.reduce((sum, i) => sum + i.total, 0)
)

onMounted(() => loadFromStorage())
</script>

<template>
  <div class="price-items-view">

    <!-- Cards -->
    <section class="cards-section" v-if="items.length > 0">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">⬡</span>
          INVENTÁRIO
        </div>
        <span class="item-count">{{ items.length }} {{ items.length === 1 ? 'item' : 'itens' }}</span>
      </div>
      <div class="cards-scroll">
        <ItemCard
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
          @remove="removeItem"
        />
      </div>
    </section>

    <!-- Tabela -->
    <section class="table-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">📜</span>
          REGISTRO DE PREÇOS
        </div>
        <span class="grand-total" v-if="items.length > 0">
          TESOURO TOTAL: <strong>{{ fmt(grandTotal) }}</strong>
        </span>
      </div>

      <!-- Filtros -->
      <div class="filters" v-if="items.length > 0">
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'Todos' }"
          @click="activeFilter = 'Todos'"
        >⬡ Todos</button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          class="filter-btn"
          :class="{ active: activeFilter === cat }"
          @click="activeFilter = cat"
        >{{ cat }}</button>
      </div>

      <!-- Vazio -->
      <div class="empty-state" v-if="items.length === 0">
        <div class="empty-icon">⬡</div>
        <p class="empty-title">Nenhum item no inventário</p>
        <p class="empty-sub">Adicione itens pelo formulário ao lado</p>
      </div>

      <!-- Tabela -->
      <div class="table-wrapper" v-else>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ITEM</th>
              <th>CATEGORIA</th>
              <th>QTD</th>
              <th>UNIT.</th>
              <th>TOTAL</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="table-row"
              :style="{ animationDelay: `${index * 40}ms` }"
            >
              <td class="td-index">{{ index + 1 }}</td>
              <td class="td-name">{{ item.name }}</td>
              <td class="td-category">
                <span class="category-badge">{{ item.category || 'Outros' }}</span>
              </td>
              <td class="td-qty">{{ item.quantity }}</td>
              <td class="td-price">{{ fmt(item.unitPrice) }}</td>
              <td class="td-total">{{ fmt(item.total) }}</td>
              <td class="td-action">
                <button class="edit-btn" @click="startEdit(item.id)">✎ Editar</button>
                <button class="remove-btn" @click="removeItem(item.id)">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="tfoot-center">
                <span class="tfoot-label">
                  ⬡ {{ activeFilter === 'Todos' ? 'TESOURO TOTAL' : activeFilter.toUpperCase() }}
                </span>
                <span class="tfoot-total">{{ fmt(filteredTotal) }}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

  </div>
</template>

<style scoped>
.price-items-view {
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
  min-width: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon { font-size: 12px; }

.item-count {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #2e2e2e;
}

.grand-total {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #4a4a4a;
  letter-spacing: 1px;
}

.grand-total strong {
  color: #4ade80;
  font-weight: 500;
}

/* Cards */
.cards-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: #1e1e1e transparent;
}

.cards-scroll::-webkit-scrollbar { height: 3px; }
.cards-scroll::-webkit-scrollbar-track { background: transparent; }
.cards-scroll::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 4px; }

/* Filtros */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.filter-btn {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  background: transparent;
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  color: #3a3a3a;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #3a3a3a;
  color: #777;
}

.filter-btn.active {
  background: #0d2b17;
  border-color: #4ade80;
  color: #4ade80;
  box-shadow: 0 0 10px -4px #4ade80;
}

/* Vazio */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  border: 1px solid #161616;
  border-radius: 16px;
  background: #090909;
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(74,222,128,0.03) 0%, transparent 70%);
}

.empty-icon {
  font-size: 28px;
  color: #1e1e1e;
  margin-bottom: 14px;
}

.empty-title {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: #333;
  margin-bottom: 6px;
}

.empty-sub {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #222;
  letter-spacing: 1px;
}

/* Tabela */
.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid #181818;
  background: #090909;
  position: relative;
}

.table-wrapper::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'DM Mono', monospace;
}

thead tr {
  border-bottom: 1px solid #141414;
  background: #0d0d0d;
}

thead th {
  font-size: 8px;
  letter-spacing: 3px;
  color: #2e2e2e;
  padding: 14px 16px;
  text-align: left;
  white-space: nowrap;
  font-weight: 400;
}

thead th:first-child { width: 36px; }
thead th:last-child { width: 120px; text-align: center; }

.table-row {
  border-bottom: 1px solid #0f0f0f;
  animation: rowIn 0.3s ease both;
  transition: background 0.15s;
  position: relative;
}

@keyframes rowIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}

.table-row:hover { background: #0e0e0e; }
.table-row:last-child { border-bottom: none; }

/* Linha lateral colorida no hover */
.table-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: #4ade80;
  opacity: 0;
  transition: opacity 0.2s;
}

.table-row:hover::before { opacity: 0.6; }

td {
  padding: 13px 16px;
  font-size: 12px;
  color: #666;
  vertical-align: middle;
}

.td-index {
  font-size: 9px;
  color: #252525;
  letter-spacing: 1px;
}

.td-name {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #bbb;
  max-width: 160px;
}

.td-category { white-space: nowrap; }

.category-badge {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 1px;
  color: #4ade80;
  background: #0a1f10;
  border: 1px solid #1a3d22;
  border-radius: 4px;
  padding: 3px 7px;
  white-space: nowrap;
}

.td-qty { color: #555; }
.td-price { color: #555; }

.td-total {
  color: #4ade80;
  font-size: 13px;
  font-weight: 500;
}

.td-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.edit-btn {
  background: #0d1f15;
  border: 1px solid #1a3d22;
  border-radius: 6px;
  height: 26px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #4ade80;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  transition: all 0.15s;
  white-space: nowrap;
}

.edit-btn:hover {
  background: #122a1c;
  border-color: #4ade80;
  box-shadow: 0 0 10px -4px #4ade80;
}

.remove-btn {
  background: #0f0f0f;
  border: 1px solid #1e1e1e;
  border-radius: 6px;
  width: 26px; height: 26px;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #2e2e2e;
  transition: all 0.15s;
}

.remove-btn:hover {
  background: rgba(255,68,68,0.1);
  border-color: #ff4444;
  color: #ff4444;
}

/* Footer */
tfoot tr {
  border-top: 1px solid #161616;
  background: #0b0b0b;
}

.tfoot-center { padding: 16px; text-align: center; }

.tfoot-label {
  display: block;
  font-size: 8px;
  letter-spacing: 4px;
  color: #2a2a2a;
  margin-bottom: 6px;
}

.tfoot-total {
  display: block;
  font-family: 'DM Mono', monospace;
  font-size: 20px;
  font-weight: 500;
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74,222,128,0.4);
}
</style>