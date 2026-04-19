<template>
  <!-- Card visual de cada item -->
  <div class="item-card" :style="{ '--hue': hue }">
    <button class="remove-btn" @click="$emit('remove', item.id)" title="Remover">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="card-index">#{{ index + 1 }}</div>

    <div class="card-name">{{ item.name }}</div>

    <div class="card-stats">
      <div class="stat">
        <span class="stat-label">QTD</span>
        <span class="stat-value">{{ item.quantity }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">UNIT</span>
        <span class="stat-value">{{ fmt(item.unitPrice) }}</span>
      </div>
    </div>

    <div class="card-total">
      <span class="total-label">TOTAL</span>
      <span class="total-value">{{ fmt(item.total) }}</span>
    </div>

    <div class="card-glow"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useItems } from '../composables/useItems.js'

const { fmt } = useItems()

const props = defineProps({
  item:  { type: Object,  required: true },
  index: { type: Number,  default: 0 },
})

defineEmits(['remove'])

// Gera um matiz único e consistente por item baseado no id
const hue = computed(() => (props.item.id % 360).toString())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@400;600;700;800&display=swap');

.item-card {
  --accent: hsl(var(--hue, 200), 70%, 60%);
  position: relative;
  background: #111;
  border: 1px solid #252525;
  border-radius: 20px;
  padding: 22px 20px 18px;
  width: 200px;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.3s;
  animation: cardIn 0.3s ease both;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 40px -15px var(--accent);
}

/* Glow decorativo no canto */
.card-glow {
  position: absolute;
  bottom: -30px; right: -30px;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.08;
  filter: blur(30px);
  pointer-events: none;
}

/* Borda topo colorida */
.item-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.remove-btn {
  position: absolute;
  top: 12px; right: 12px;
  background: #1e1e1e;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  color: #555;
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.remove-btn:hover {
  background: #ff444422;
  border-color: #ff4444;
  color: #ff4444;
}

.card-index {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.card-name {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #e8e8e8;
  margin-bottom: 18px;
  line-height: 1.2;
  padding: 0 28px;
  word-break: break-word;
  text-align: center;
}

.card-stats {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.stat-label,
.total-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: #444;
}

.stat-value {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #aaa;
}

.card-total {
  border-top: 1px solid #222;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.total-value {
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  font-weight: 500;
  color: var(--accent);
}
</style>