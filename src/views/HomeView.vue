<template>
  <div class="home-view">
    <ItemForm />
    <PriceTable />
  </div>
</template>

<script setup>
import ItemForm from '../components/ItemForm.vue'
import PriceTable from '../components/PriceTable.vue'
</script>

<style scoped>
.home-view {
  display: flex;
  gap: 36px;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}

@media (max-width: 800px) {
  .home-view { flex-direction: column; }
}
</style>