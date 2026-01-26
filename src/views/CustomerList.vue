<script setup lang="ts">
import { useCustomerStore } from '../stores/customerStore.ts'

const { customers } = useCustomerStore()
</script>

<template>
  <div class="page">
    <h2>고객 목록</h2>
    <table class="customer-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>이름</th>
          <th>전화번호</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.phone }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 40px auto;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.customer-table th,
.customer-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.customer-table th {
  background: #f8f9fb;
  font-weight: bold;
}

.customer-table tr:hover {
  background: #f1f7ff;
}
</style>
