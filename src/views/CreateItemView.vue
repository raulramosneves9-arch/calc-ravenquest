<template>
  <form class="create-form" @submit.prevent="handleSubmit" novalidate>
    <div class="form-title">
      <span class="form-title-icon">{{ isEditing ? '✎' : '+' }}</span>
      {{ isEditing ? 'EDITAR ITEM' : 'NOVO ITEM' }}
    </div>

    <!-- Nome do item -->
    <div class="field" :class="{ error: errors.name }">
      <label for="name">NOME DO ITEM</label>
      <input id="name" v-model.trim="form.name" type="text"
        placeholder="Ex: Espada Lendária" autocomplete="off"
        @input="errors.name = ''" />
      <span class="error-msg">{{ errors.name }}</span>
    </div>

    <!-- Quantidade -->
    <div class="field" :class="{ error: errors.quantity }">
      <label for="qty">QUANTIDADE</label>
      <input id="qty" v-model.number="form.quantity" type="number"
        min="1" placeholder="1" @input="errors.quantity = ''" />
      <span class="error-msg">{{ errors.quantity }}</span>
    </div>

    <!-- Valor unitário — aceita notação de jogo -->
    <div class="field" :class="{ error: errors.unitPrice }">
      <label for="price">
        VALOR UNITÁRIO
      </label>
      <div class="input-wrap">
        <input
          id="price"
          v-model="form.unitPriceRaw"
          type="text"
          placeholder="Ex: 500 silver"
          autocomplete="off"
          @input="onPriceInput"
          @blur="normalizePriceInput"
        />
        <span class="input-badge" v-if="parsedUnitPrice > 0">
          = {{ fmt(parsedUnitPrice) }}
        </span>
      </div>
      <span class="error-msg">{{ errors.unitPrice }}</span>
    </div>

    <!-- Preview do total -->
    <div class="total-preview" v-if="previewTotal > 0">
      <span class="preview-label">TOTAL ESTIMADO</span>
      <span class="preview-value">{{ fmt(previewTotal) }}</span>
    </div>

    <div class="form-actions">
      <button
        v-if="isEditing"
        type="button"
        class="cancel-btn"
        @click="handleCancelEdit"
      >
        CANCELAR
      </button>
      <button type="submit" class="submit-btn" :disabled="submitting">
        {{ submitLabel }}
      </button>
    </div>

    <transition name="fade">
      <div class="success-toast" v-if="showSuccess">✓ {{ successMessage }}</div>
    </transition>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useItems } from '../composables/useItems.js'

const { addItem, updateItem, editingItem, cancelEdit, fmt, parseGameValue } = useItems()

const form = ref({ name: '', quantity: null, unitPriceRaw: '' })
const errors = ref({ name: '', quantity: '', unitPrice: '' })
const submitting = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')

const isEditing = computed(() => !!editingItem.value)
const submitLabel = computed(() => {
  if (submitting.value) return isEditing.value ? 'SALVANDO…' : 'ADICIONANDO…'
  return isEditing.value ? 'SALVAR EDIÇÃO' : 'ADICIONAR ITEM'
})

const parsedUnitPrice = computed(() => parseGameValue(form.value.unitPriceRaw))

const previewTotal = computed(() => {
  const q = Number(form.value.quantity)
  const p = parsedUnitPrice.value
  return q > 0 && p > 0 ? q * p : 0
})

function onPriceInput() { errors.value.unitPrice = '' }

function normalizePriceInput() {
  const val = parsedUnitPrice.value
  if (val > 0) form.value.unitPriceRaw = fmt(val)
}

function validate() {
  let valid = true
  errors.value = { name: '', quantity: '', unitPrice: '' }
  if (!form.value.name)                                { errors.value.name = 'Informe o nome do item'; valid = false }
  if (!form.value.quantity || form.value.quantity < 1) { errors.value.quantity = 'Mínimo: 1'; valid = false }
  if (!form.value.unitPriceRaw || parsedUnitPrice.value <= 0) { errors.value.unitPrice = 'Ex: 500, 1K, 2,5KK'; valid = false }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 180))
  if (isEditing.value) {
    updateItem(editingItem.value.id, {
      name: form.value.name,
      quantity: form.value.quantity,
      unitPrice: parsedUnitPrice.value,
    })
    successMessage.value = 'Item atualizado!'
    cancelEdit()
  } else {
    addItem({ name: form.value.name, quantity: form.value.quantity, unitPrice: parsedUnitPrice.value })
    successMessage.value = 'Item adicionado!'
  }
  form.value = { name: '', quantity: null, unitPriceRaw: '' }
  submitting.value = false
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 2500)
}

function handleCancelEdit() {
  cancelEdit()
  errors.value = { name: '', quantity: '', unitPrice: '' }
  form.value = { name: '', quantity: null, unitPriceRaw: '' }
}

watch(editingItem, (item) => {
  if (!item) return
  form.value = {
    name: item.name,
    quantity: item.quantity,
    unitPriceRaw: fmt(item.unitPrice),
  }
  errors.value = { name: '', quantity: '', unitPrice: '' }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@400;600;700;800&display=swap');

.create-form {
  background: #111111;
  border: 1px solid #252525;
  border-radius: 24px;
  padding: 28px 24px;
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 0 60px -20px #4ade80;
}

.form-title {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #4ade80;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-title-icon {
  width: 20px; height: 20px;
  border: 1.5px solid #4ade80;
  border-radius: 6px;
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  color: #4ade80;
  line-height: 1;
}

.field { display: flex; flex-direction: column; gap: 6px; }

label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-hint {
  font-size: 8px;
  letter-spacing: 0.5px;
  color: #383838;
  font-style: italic;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap input { padding-right: 80px; }

.input-badge {
  position: absolute;
  right: 12px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #4ade80;
  background: #0d2b17;
  border-radius: 6px;
  padding: 2px 7px;
  pointer-events: none;
  white-space: nowrap;
}

input {
  font-family: 'DM Mono', monospace;
  font-size: 15px;
  background: #0d0d0d;
  border: 1.5px solid #2a2a2a;
  border-radius: 12px;
  color: #e0e0e0;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

input::placeholder { color: #333; font-size: 13px; }

input:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.08);
  background: #0f0f0f;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; }
input[type='number'] {
  appearance: textfield;        /* padrão moderno */
  -moz-appearance: textfield;   /* Firefox */
}

.field.error input { border-color: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,0.08); }

.error-msg {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #f87171;
  min-height: 14px;
}

.total-preview {
  background: #0a1a0f;
  border: 1.5px dashed #1e4a2a;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.preview-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: #2a6a3a;
}

.preview-value {
  font-family: 'DM Mono', monospace;
  font-size: 18px;
  color: #4ade80;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.cancel-btn {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
  color: #777;
  border: 1px solid #2b2b2b;
  border-radius: 12px;
  padding: 14px;
  min-width: 108px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.cancel-btn:hover {
  border-color: #666;
  color: #bbb;
  background: #1a1a1a;
}

.submit-btn {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  background: #4ade80;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 14px;
  width: 100%;
  cursor: pointer;
  transition: filter 0.15s, transform 0.1s, opacity 0.2s;
  box-shadow: 0 0 24px -6px #4ade80;
}

.submit-btn:hover:not(:disabled) { filter: brightness(1.1); box-shadow: 0 0 36px -4px #4ade80; }
.submit-btn:active:not(:disabled) { transform: scale(0.97); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.success-toast {
  position: absolute;
  bottom: -44px; left: 50%;
  transform: translateX(-50%);
  background: #0a1a0f;
  border: 1px solid #4ade80;
  border-radius: 10px;
  padding: 8px 18px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #4ade80;
  white-space: nowrap;
  z-index: 10;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(6px); }
.fade-leave-to   { opacity: 0; transform: translateX(-50%) translateY(-4px); }
</style>
