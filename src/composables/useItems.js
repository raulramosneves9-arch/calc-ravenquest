// composables/useItems.js
import { ref, computed } from 'vue'

const STORAGE_KEY = 'price-items-v1'
const items = ref([])
const editingItemId = ref(null)

export const CATEGORIES = [
  'Armas',
  'Equipamento',
  'Equipamento de Profissão',
  'Encantamentos',
  'Consumíveis',
  'Matérias-primas',
  'Matérias Refinados',
  'Transporte',
  'Matérias de Cosméticos',
  'Outros',
]

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

function addItem({ name, quantity, unitPrice, category }) {
  const item = {
    id: Date.now(),
    name: name.trim(),
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    total: Number(quantity) * Number(unitPrice),
    category: category || 'Outros',
    createdAt: new Date().toISOString(),
  }
  items.value.unshift(item)
  saveToStorage()
  return item
}

function updateItem(id, { name, quantity, unitPrice, category }) {
  const index = items.value.findIndex(i => i.id === id)
  if (index === -1) return null

  const updated = {
    ...items.value[index],
    name: name.trim(),
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    total: Number(quantity) * Number(unitPrice),
    category: category || 'Outros',
    updatedAt: new Date().toISOString(),
  }

  items.value[index] = updated
  saveToStorage()
  return updated
}

function startEdit(id) {
  editingItemId.value = id
}

function cancelEdit() {
  editingItemId.value = null
}

const editingItem = computed(() =>
  items.value.find(i => i.id === editingItemId.value) || null
)

function removeItem(id) {
  items.value = items.value.filter(i => i.id !== id)
  if (editingItemId.value === id) editingItemId.value = null
  saveToStorage()
}

const grandTotal = computed(() =>
  items.value.reduce((sum, i) => sum + i.total, 0)
)

function fmt(value) {
  const n = Number(value)
  if (isNaN(n)) return '0'

  function clean(num) {
    const rounded = parseFloat(num.toFixed(3))
    return rounded.toString().replace('.', ',')
  }

  if (n >= 1_000_000_000) return `${clean(n / 1_000_000_000)}KKK`
  if (n >= 1_000_000) return `${clean(n / 1_000_000)}KK`
  if (n >= 1_000) return `${clean(n / 1_000)}K`
  return clean(n)
}

function parseGameValue(str) {
  if (!str) return 0
  const s = str.trim().toUpperCase().replace(',', '.')

  if (s.endsWith('KKK')) return parseFloat(s) * 1_000_000_000
  if (s.endsWith('KK')) return parseFloat(s) * 1_000_000
  if (s.endsWith('K')) return parseFloat(s) * 1_000
  return parseFloat(s) || 0
}

loadFromStorage()

export function useItems() {
  return {
    items,
    grandTotal,
    editingItem,
    addItem,
    updateItem,
    startEdit,
    cancelEdit,
    removeItem,
    loadFromStorage,
    fmt,
    parseGameValue,
  }
}