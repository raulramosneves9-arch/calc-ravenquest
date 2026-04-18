<template>
  <div class="price-items-view">

    <!-- Seção de cards rolável horizontalmente -->
    <section class="cards-section" v-if="items.length > 0">
      <div class="section-header">
        <span class="section-title">ITENS</span>
        <span class="item-count">{{ items.length }} {{ items.length === 1 ? 'item' : 'itens' }}</span>
      </div>

      <div class="cards-scroll">
        <ItemCardView
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :index="index"
          @remove="removeItem"
        />
      </div>
    </section>

    <!-- Tabela de Price Items -->
    <section class="table-section">
      <div class="section-header">
        <span class="section-title">PRICE ITEMS</span>
        <span class="grand-total" v-if="items.length > 0">
          TOTAL GERAL: <strong>{{ fmt(grandTotal) }}</strong>
        </span>
      </div>

      <!-- Estado vazio -->
      <div class="empty-state" v-if="items.length === 0">
        <div class="empty-icon">◻</div>
        <p>Nenhum item adicionado ainda.</p>
        <p class="empty-sub">Preencha o formulário ao lado para começar.</p>
      </div>

      <!-- Tabela -->
      <div class="table-wrapper" v-else>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>NOME</th>
              <th>QTD</th>
              <th>VALOR UNIT.</th>
              <th>TOTAL</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="table-row"
              :style="{ animationDelay: `${index * 40}ms` }"
            >
              <td class="td-index">{{ index + 1 }}</td>
              <td class="td-name">{{ item.name }}</td>
              <td class="td-qty">{{ item.quantity }}</td>
              <td class="td-price">{{ fmt(item.unitPrice) }}</td>
              <td class="td-total">{{ fmt(item.total) }}</td>
              <td class="td-action">
                <button class="edit-btn" @click="startEdit(item.id)" title="Editar">
                  Editar
                </button>
                <button class="remove-btn" @click="removeItem(item.id)" title="Remover">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="tfoot-label">TOTAL GERAL</td>
              <td class="tfoot-total">{{ fmt(grandTotal) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useItems } from '../composables/useItems.js'
import ItemCardView from './ItemCardView.vue'

const { items, grandTotal, removeItem, startEdit, loadFromStorage, fmt } = useItems()

// Carrega dados persistidos ao montar a view
onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@400;600;700;800&display=swap');

.price-items-view {
  display: flex;
  flex-direction: column;
  gap: 36px;
  flex: 1;
  min-width: 0;
}

/* Headers de seção */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #555;
}

.item-count {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #333;
}

.grand-total {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #555;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.grand-total strong {
  color: #4ade80;
  font-weight: 500;
}

/* Cards scroll horizontal */
.cards-scroll {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: #222 transparent;
}

.cards-scroll::-webkit-scrollbar { height: 4px; }
.cards-scroll::-webkit-scrollbar-track { background: transparent; }
.cards-scroll::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }

/* Estado vazio */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  border: 1px dashed #222;
  border-radius: 20px;
  background: #0a0a0a;
}

.empty-icon {
  font-size: 32px;
  color: #2a2a2a;
  margin-bottom: 16px;
}

.empty-state p {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: #444;
  margin-bottom: 6px;
}

.empty-sub {
  font-family: 'DM Mono', monospace;
  font-size: 11px !important;
  color: #2a2a2a !important;
}

/* Wrapper da tabela com scroll */
.table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  border: 1px solid #1e1e1e;
  background: #0d0d0d;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'DM Mono', monospace;
}

thead tr {
  border-bottom: 1px solid #1e1e1e;
}

thead th {
  font-size: 9px;
  letter-spacing: 3px;
  color: #3a3a3a;
  padding: 16px 18px;
  text-align: left;
  white-space: nowrap;
  font-weight: 400;
}

thead th:first-child { width: 40px; }
thead th:last-child  {
  width: 130px;
  text-align: center;
}

/* Rows */
.table-row {
  border-bottom: 1px solid #141414;
  animation: rowIn 0.3s ease both;
  transition: background 0.15s;
}

@keyframes rowIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.table-row:hover { background: #111; }
.table-row:last-child { border-bottom: none; }

td {
  padding: 14px 18px;
  font-size: 13px;
  color: #888;
  vertical-align: middle;
}

.td-index {
  font-size: 10px;
  color: #333;
  letter-spacing: 1px;
}

.td-name {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ccc;
  max-width: 200px;
}

.td-qty {
  color: #666;
}

.td-price { color: #666; }

.td-total {
  color: #4ade80;
  font-size: 14px;
}

.td-action {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-btn {
  background: #13261b;
  border: 1px solid #1f4d34;
  border-radius: 8px;
  height: 28px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4ade80;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.edit-btn:hover {
  background: #173223;
  border-color: #4ade80;
}

.remove-btn {
  background: #161616;
  border: 1px solid #222;
  border-radius: 8px;
  width: 28px; height: 28px;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #3a3a3a;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.remove-btn:hover {
  background: #2a0808;
  border-color: #ff4444;
  color: #ff4444;
}

/* Footer da tabela */
tfoot tr {
  border-top: 1px solid #222;
  background: #0a0a0a;
}

.tfoot-label {
  font-size: 9px;
  letter-spacing: 3px;
  color: #333;
  text-align: center;
  padding-right: 0;
}

.tfoot-total {
  font-size: 16px;
  font-weight: 500;
  color: #4ade80;
  padding: 18px;
  text-align: center;
}
</style>
