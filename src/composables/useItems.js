// composables/useItems.js
import { ref, computed } from 'vue'

const STORAGE_KEY = 'price-items-v1'
const items = ref([])

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) items.value = JSON.parse(saved)
  } catch (e) {
    items.value = []
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

function addItem({ name, quantity, unitPrice }) {
  const item = {
    id: Date.now(),
    name: name.trim(),
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    total: Number(quantity) * Number(unitPrice),
    createdAt: new Date().toISOString(),
  }
  items.value.unshift(item)
  saveToStorage()
  return item
}

function removeItem(id) {
  items.value = items.value.filter(i => i.id !== id)
  saveToStorage()
}

const grandTotal = computed(() =>
  items.value.reduce((sum, i) => sum + i.total, 0)
)

/**
 * Formata número no estilo de jogo:
 * < 1.000          → ex: 25, 300, 999
 * >= 1.000         → ex: 1K, 1,5K, 250K
 * >= 1.000.000     → ex: 1KK, 1,5KK, 250KK
 * >= 1.000.000.000 → ex: 1KKK, 2,5KKK
 */
function fmt(value) {
  const n = Number(value)
  if (isNaN(n)) return '0'

  // Formata o número com até 3 casas decimais, removendo zeros desnecessários
  function clean(num) {
    // Arredonda para evitar 1.999999K
    const rounded = parseFloat(num.toFixed(3))
    // Remove zeros à direita após o ponto
    return rounded.toString().replace('.', ',')
  }

  if (n >= 1_000_000_000) return `${clean(n / 1_000_000_000)}KKK`
  if (n >= 1_000_000) return `${clean(n / 1_000_000)}KK`
  if (n >= 1_000) return `${clean(n / 1_000)}K`
  return clean(n)
}

/**
 * Converte string de input de jogo para número real.
 * Aceita: "1K", "1,5KK", "1.5KK", "250K", "500", "2KKK"
 */
function parseGameValue(str) {
  if (!str) return 0
  const s = str.trim().toUpperCase().replace(',', '.')

  if (s.endsWith('KKK')) return parseFloat(s) * 1_000_000_000
  if (s.endsWith('KK')) return parseFloat(s) * 1_000_000
  if (s.endsWith('K')) return parseFloat(s) * 1_000
  return parseFloat(s) || 0
}

export function useItems() {
  return { items, grandTotal, addItem, removeItem, loadFromStorage, fmt, parseGameValue }
}