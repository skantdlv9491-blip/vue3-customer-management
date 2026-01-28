<script setup lang="ts">
// CustomerTable 컴포넌트를 사용하기 위해 import
// import를 쓰는 이유: 컴포넌트를 현재 파일에서 사용 가능하게 만들기 위함
import CustomerTable from '../components/CustomerTable.vue'

// useCustomerStore를 import하는 이유: 고객 목록/로직을 Pinia에서 가져오기 위해
import { useCustomerStore } from '../stores/customerStore'

// useRouter를 import하는 이유: 수정 버튼 클릭 시 등록 페이지(/register)로 이동하기 위해
import { useRouter } from 'vue-router'

// store 인스턴스
const customerStore = useCustomerStore()

// 라우터 인스턴스
const router = useRouter()

// 삭제 처리(스토어 액션 호출)
const deleteCustomer = (id: number) => {
  customerStore.deleteCustomer(id)
}

// 수정 처리: 수정 대상 설정 + 등록 페이지로 이동
const editCustomer = (id: number) => {
  customerStore.startEdit(id)
  router.push('/register')
}
</script>

<template>
  <section class="container">
    <h2>📋 고객 목록</h2>

    <CustomerTable
      :customers="customerStore.customers"
      @delete="deleteCustomer"
      @edit="editCustomer"
    />
  </section>
</template>

<style scoped>
/* 페이지 전체 컨테이너 */
.container {
  /* 내부 여백 */
  padding: 16px;
}
</style>
