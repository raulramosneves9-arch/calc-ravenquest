<script setup>
import { ref, computed, watch } from 'vue'
import { useItems, CATEGORIES } from '../composables/useItems.js'

const { addItem, updateItem, editingItem, cancelEdit, fmt, parseGameValue } = useItems()

const form = ref({ name: '', quantity: null, unitPriceRaw: '', category: 'Outros' })
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
      category: form.value.category,
    })
    successMessage.value = 'Item atualizado!'
    cancelEdit()
  } else {
    addItem({
      name: form.value.name,
      quantity: form.value.quantity,
      unitPrice: parsedUnitPrice.value,
      category: form.value.category,
    })
    successMessage.value = 'Item adicionado!'
  }
  form.value = { name: '', quantity: null, unitPriceRaw: '', category: 'Outros' }
  submitting.value = false
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 2500)
}

function handleCancelEdit() {
  cancelEdit()
  errors.value = { name: '', quantity: '', unitPrice: '' }
  form.value = { name: '', quantity: null, unitPriceRaw: '', category: 'Outros' }
}

watch(editingItem, (item) => {
  if (!item) return
  form.value = {
    name: item.name,
    quantity: item.quantity,
    unitPriceRaw: fmt(item.unitPrice),
    category: item.category || 'Outros',
  }
  errors.value = { name: '', quantity: '', unitPrice: '' }
})
</script>

<template>
  <form class="create-form" @submit.prevent="handleSubmit" novalidate>
    <div class="form-top">
      <div class="form-title">
        <span class="form-title-icon">{{ isEditing ? '✎' : '+' }}</span>
        {{ isEditing ? 'EDITAR ITEM' : 'NOVO ITEM' }}
      </div>

      <div class="fields">
        <div class="field" :class="{ error: errors.name }">
          <label for="name">NOME DO ITEM</label>
          <input id="name" v-model.trim="form.name" type="text"
            placeholder="Ex: Espada Lendária" autocomplete="off"
            @input="errors.name = ''" />
          <span class="error-msg">{{ errors.name }}</span>
        </div>

        <div class="field">
          <label for="category">CATEGORIA</label>
          <select id="category" v-model="form.category">
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="field" :class="{ error: errors.quantity }">
          <label for="qty">QUANTIDADE</label>
          <input id="qty" v-model.number="form.quantity" type="number"
            min="1" placeholder="1" @input="errors.quantity = ''" />
          <span class="error-msg">{{ errors.quantity }}</span>
        </div>

        <div class="field" :class="{ error: errors.unitPrice }">
          <label for="price">VALOR UNITÁRIO</label>
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

        <div class="total-preview" v-if="previewTotal > 0">
          <span class="preview-label">TOTAL ESTIMADO</span>
          <span class="preview-value">{{ fmt(previewTotal) }}</span>
        </div>
      </div>
    </div>

    <div class="form-bottom">
      <div class="form-actions">
        <button v-if="isEditing" type="button" class="cancel-btn" @click="handleCancelEdit">
          CANCELAR
        </button>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitLabel }}
        </button>
      </div>

      <transition name="fade">
        <div class="success-toast" v-if="showSuccess">✓ {{ successMessage }}</div>
      </transition>
    </div>
  </form>
</template>

<style scoped>
.create-form {
  background: #111111;
  border: 1px solid #252525;
  border-radius: 24px;
  padding: 22px 20px;
  width: 300px;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 0 60px -20px #4ade80;
}

.form-top {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
}

.form-title {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #4ade80;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-title-icon {
  width: 18px;
  height: 18px;
  border: 1.5px solid #4ade80;
  border-radius: 5px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #4ade80;
  line-height: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: #555;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap input { padding-right: 76px; }

.input-badge {
  position: absolute;
  right: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #4ade80;
  background: #0d2b17;
  border-radius: 5px;
  padding: 2px 6px;
  pointer-events: none;
  white-space: nowrap;
}

input, select {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  background: #0d0d0d;
  border: 1.5px solid #2a2a2a;
  border-radius: 10px;
  color: #e0e0e0;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

select option { background: #111; color: #e0e0e0; }

input::placeholder { color: #333; font-size: 12px; }

input:focus, select:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 3px rgba(74,222,128,0.08);
  background: #0f0f0f;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; }
input[type='number'] { appearance: textfield; -moz-appearance: textfield; }

.field.error input {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248,113,113,0.08);
}

.error-msg {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  color: #f87171;
  min-height: 12px;
}

.total-preview {
  background: #0a1a0f;
  border: 1.5px dashed #1e4a2a;
  border-radius: 10px;
  padding: 10px 12px;
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
  font-size: 16px;
  color: #4ade80;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.cancel-btn {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  background: transparent;
  color: #666;
  border: 1px solid #2b2b2b;
  border-radius: 10px;
  padding: 12px 10px;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.cancel-btn:hover {
  border-color: #555;
  color: #aaa;
  background: #1a1a1a;
}

.submit-btn {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  background: #4ade80;
  color: #000;
  border: none;
  border-radius: 10px;
  padding: 12px 8px;
  width: 100%;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 0.15s, transform 0.1s, opacity 0.2s;
  box-shadow: 0 0 20px -6px #4ade80;
}

.submit-btn:hover:not(:disabled) { filter: brightness(1.1); box-shadow: 0 0 32px -4px #4ade80; }
.submit-btn:active:not(:disabled) { transform: scale(0.97); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.success-toast {
  background: #0a1a0f;
  border: 1px solid #4ade80;
  border-radius: 8px;
  padding: 7px 14px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: #4ade80;
  text-align: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from { opacity: 0; transform: translateY(6px); }
.fade-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>