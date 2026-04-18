<template>
  <div class="calc" :style="{ '--accent': accent }">
    <div class="calc-header">
      <div class="calc-dot"></div>
      <div class="calc-label">{{ label }}</div>
      <div class="calc-dot dim"></div>
    </div>

    <div class="display">
      <div class="expression">{{ expression || '\u00a0' }}</div>
      <div class="result" :class="{ small: display.length > 9, xsmall: display.length > 13 }">
        {{ display }}
      </div>
    </div>

    <div class="buttons">
      <button class="btn span2 fn" @click="clear">AC</button>
      <button class="btn fn" @click="toggleSign">±</button>
      <button class="btn op" @click="pressOp('/')">÷</button>

      <button class="btn" @click="pressNum('7')">7</button>
      <button class="btn" @click="pressNum('8')">8</button>
      <button class="btn" @click="pressNum('9')">9</button>
      <button class="btn op" @click="pressOp('*')">×</button>

      <button class="btn" @click="pressNum('4')">4</button>
      <button class="btn" @click="pressNum('5')">5</button>
      <button class="btn" @click="pressNum('6')">6</button>
      <button class="btn op" @click="pressOp('-')">−</button>

      <button class="btn" @click="pressNum('1')">1</button>
      <button class="btn" @click="pressNum('2')">2</button>
      <button class="btn" @click="pressNum('3')">3</button>
      <button class="btn op" @click="pressOp('+')">+</button>

      <button class="btn span2" @click="pressNum('0')">0</button>
      <button class="btn" @click="pressDecimal">.</button>
      <button class="btn equals" @click="calculate">=</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: { type: String, default: 'CALC' },
  accent: { type: String, default: '#ff6b35' },
})

const current = ref('0')
const previous = ref('')
const operator = ref(null)
const freshStart = ref(false)
const expression = ref('')

const display = computed(() => current.value)

function pressNum(n) {
  if (freshStart.value) { current.value = n; freshStart.value = false }
  else current.value = current.value === '0' ? n : current.value + n
}

function pressDecimal() {
  if (freshStart.value) { current.value = '0.'; freshStart.value = false; return }
  if (!current.value.includes('.')) current.value += '.'
}

function pressOp(op) {
  previous.value = current.value
  operator.value = op
  expression.value = `${current.value} ${op === '*' ? '×' : op === '/' ? '÷' : op}`
  freshStart.value = true
}

function calculate() {
  if (!operator.value || !previous.value) return
  const a = parseFloat(previous.value), b = parseFloat(current.value)
  let result
  if (operator.value === '+') result = a + b
  else if (operator.value === '-') result = a - b
  else if (operator.value === '*') result = a * b
  else result = b === 0 ? 'Erro' : a / b
  expression.value = `${previous.value} ${operator.value === '*' ? '×' : operator.value === '/' ? '÷' : operator.value} ${current.value} =`
  current.value = result === 'Erro' ? 'Erro' : String(parseFloat(result.toFixed(10)))
  operator.value = null; previous.value = ''; freshStart.value = true
}

function clear() {
  current.value = '0'; previous.value = ''; operator.value = null
  expression.value = ''; freshStart.value = false
}

function toggleSign() {
  if (current.value !== '0')
    current.value = current.value.startsWith('-') ? current.value.slice(1) : '-' + current.value
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;600;700&display=swap');

.calc {
  font-family: 'Outfit', sans-serif;
  background: #111111;
  border: 1px solid #252525;
  border-radius: 32px;
  padding: 28px 24px 32px;
  width: 300px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.03),
    0 40px 80px rgba(0,0,0,0.7),
    0 0 80px -20px var(--accent);
  transition: box-shadow 0.4s, transform 0.4s;
  position: relative;
}

.calc:hover {
  transform: translateY(-6px);
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.06),
    0 60px 100px rgba(0,0,0,0.8),
    0 0 100px -10px var(--accent);
}

.calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.calc-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 5px;
  color: var(--accent);
  text-transform: uppercase;
}

.calc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
}

.calc-dot.dim { opacity: 0.2; }

.display {
  background: #0a0a0a;
  border-radius: 20px;
  padding: 22px 22px 20px;
  margin-bottom: 24px;
  min-height: 118px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  border: 1px solid #1e1e1e;
  position: relative;
  overflow: hidden;
}

.display::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.35;
}

.expression {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #444;
  min-height: 18px;
}

.result {
  font-family: 'DM Mono', monospace;
  font-size: 46px;
  font-weight: 400;
  color: #f5f5f5;
  letter-spacing: -2px;
  transition: font-size 0.15s;
  line-height: 1;
}

.result.small  { font-size: 30px; letter-spacing: -1px; }
.result.xsmall { font-size: 20px; letter-spacing: 0; }

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 600;
  background: #1c1c1c;
  color: #d0d0d0;
  border: 1px solid #272727;
  border-radius: 14px;
  height: 62px;
  cursor: pointer;
  transition: background 0.12s, transform 0.08s, border-color 0.15s, color 0.12s;
  position: relative;
  overflow: hidden;
}

.btn:hover { background: #222; border-color: #333; }
.btn:active { transform: scale(0.91); }

.btn.fn {
  background: #161616;
  color: #555;
  font-size: 14px;
}

.btn.op {
  background: transparent;
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  font-size: 20px;
}

.btn.op:hover {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border-color: var(--accent);
}

.btn.equals {
  background: var(--accent);
  color: #000;
  font-size: 22px;
  font-weight: 700;
  border-color: transparent;
  box-shadow: 0 0 28px -8px var(--accent);
}

.btn.equals:hover {
  filter: brightness(1.15);
  box-shadow: 0 0 40px -4px var(--accent);
}

.btn.span2 { grid-column: span 2; }
</style>