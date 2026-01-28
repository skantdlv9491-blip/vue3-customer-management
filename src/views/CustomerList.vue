<script setup lang="ts">
// CustomerTable 컴포넌트를 사용하기 위해 import
// import를 쓰는 이유: 컴포넌트를 현재 파일에서 사용 가능하게 만들기 위함
import CustomerTable from '@/components/CustomerTable.vue'

// 고객 타입을 맞추기 위해 import
import type { Customer } from '@/types/customer'

// 반응형 상태를 만들기 위해 ref 사용
import { ref } from 'vue'

// 고객 목록 상태 (부모가 상태를 소유)
const customers = ref<Customer[]>([
  { id: 1, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 2, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
])

// 자식 컴포넌트에서 올라온 delete 이벤트 처리
// 실제 데이터 변경은 부모에서만 수행
const deleteCustomer = (id: number) => {
  customers.value = customers.value.filter((c) => c.id !== id)
}
</script>

<template>
  <section class="container">
    <h2>📋 고객 목록</h2>

    <!-- props로 데이터 전달 -->
    <!-- emit으로 이벤트 수신 -->
    <CustomerTable :customers="customers" @delete="deleteCustomer" />
  </section>
</template>

<style scoped>
/* 페이지 전체 컨테이너 */
.container {
  /* 내부 여백 */
  padding: 16px;
}
</style>
