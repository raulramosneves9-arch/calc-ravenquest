<script setup>
import { computed } from 'vue'
import { useItems } from '../composables/useItems.js'

const { fmt } = useItems()

const props = defineProps({
  item:  { type: Object, required: true },
  index: { type: Number, default: 0 },
})

defineEmits(['remove'])

const hue = computed(() => (props.item.id % 360).toString())
</script>

<template>
  <div class="item-card" :style="{ '--hue': hue }">
    <button class="remove-btn" @click="$emit('remove', item.id)" title="Remover">
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="card-top">
      <div class="card-index">#{{ index + 1 }}</div>
      <div class="card-category">{{ item.category || 'Outros' }}</div>
    </div>

    <div class="card-name">{{ item.name }}</div>

    <div class="card-divider"></div>

    <div class="card-stats">
      <div class="stat">
        <span class="stat-label">QTD</span>
        <span class="stat-value">{{ item.quantity }}</span>
      </div>
      <div class="stat-sep">×</div>
      <div class="stat">
        <span class="stat-label">UNIT</span>
        <span class="stat-value">{{ fmt(item.unitPrice) }}</span>
      </div>
    </div>

    <div class="card-total">
      <span class="total-label">⬡ TOTAL</span>
      <span class="total-value">{{ fmt(item.total) }}</span>
    </div>

    <div class="card-glow"></div>
    <div class="card-corner tl"></div>
    <div class="card-corner tr"></div>
    <div class="card-corner bl"></div>
    <div class="card-corner br"></div>
  </div>
</template>

<style scoped>
.item-card {
  --accent: hsl(var(--hue, 200), 65%, 55%);
  --accent-dim: hsl(var(--hue, 200), 65%, 15%);
  position: relative;
  background: linear-gradient(160deg, #161616 0%, #0e0e0e 100%);
  border: 1px solid hsl(var(--hue, 200), 30%, 20%);
  border-radius: 16px;
  padding: 18px 16px 16px;
  width: 180px;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.3s;
  animation: cardIn 0.35s ease both;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 40px rgba(0,0,0,0.6),
    0 0 30px -10px var(--accent),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* Cantos decorativos estilo RPG */
.card-corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--accent);
  border-style: solid;
  opacity: 0.6;
}
.card-corner.tl { top: 6px; left: 6px;  border-width: 1.5px 0 0 1.5px; }
.card-corner.tr { top: 6px; right: 6px; border-width: 1.5px 1.5px 0 0; }
.card-corner.bl { bottom: 6px; left: 6px;  border-width: 0 0 1.5px 1.5px; }
.card-corner.br { bottom: 6px; right: 6px; border-width: 0 1.5px 1.5px 0; }

/* Linha topo colorida */
.item-card::before {
  content: '';
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.8;
}

.card-glow {
  position: absolute;
  bottom: -40px; right: -40px;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.06;
  filter: blur(35px);
  pointer-events: none;
}

.remove-btn {
  position: absolute;
  top: 10px; right: 10px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #444;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  z-index: 2;
}

.remove-btn:hover {
  background: rgba(255,68,68,0.15);
  border-color: #ff4444;
  color: #ff4444;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 26px;
}

.card-index {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--accent);
  opacity: 0.7;
}

.card-category {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid hsl(var(--hue, 200), 40%, 25%);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.card-name {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ececec;
  line-height: 1.2;
  word-break: break-word;
  text-shadow: 0 0 20px rgba(255,255,255,0.1);
}

.card-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, hsl(var(--hue,200),30%,25%), transparent);
}

.card-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-sep {
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  color: #333;
  margin-top: 8px;
}

.stat-label {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  color: #3a3a3a;
}

.stat-value {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #999;
}

.card-total {
  background: var(--accent-dim);
  border: 1px solid hsl(var(--hue,200), 35%, 22%);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-family: 'DM Mono', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  color: hsl(var(--hue,200), 40%, 40%);
}

.total-value {
  font-family: 'DM Mono', monospace;
  font-size: 16px;
  font-weight: 500;
  color: var(--accent);
}
</style>