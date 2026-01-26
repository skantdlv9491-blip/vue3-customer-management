<script setup lang="ts">
import { ref } from 'vue'
import { useCustomerStore } from '../stores/customerStore.ts'

// ref() : 상태 저장 (DB 가기 전 임시 데이터)
const name = ref('')
const phone = ref('')
const message = ref('')

const { addCustomer } = useCustomerStore()

const submitForm = () => {
  if (!name.value || !phone.value) {
    message.value = '이름과 전화번호를 입력해주세요.'
    return
  }
  // 정규식 검사 : 전화번호 유효성 검사
  const phoneRegex = /^010-\d{4}-\d{4}$/
  if (!phoneRegex.test(phone.value)) {
    message.value = '전화번호 형식은 010-1234-5678 입니다.'
    return
  }

  addCustomer(name.value, phone.value)
  message.value = '등록 완료!'
  name.value = ''
  phone.value = ''
}
</script>

<template>
  <div class="page">
    <h2>고객 정보 등록</h2>

    <div class="form-group">
      <label>이름</label>
      <!-- v-model : 입력값 양방향 바인딩 -->
      <input v-model="name" type="text" placeholder="홍길동" />
    </div>

    <div class="form-group">
      <label>전화번호</label>
      <input v-model="phone" type="text" placeholder="010-1234-5678" />
    </div>

    <!-- 버튼 클릭 이벤트 : 사용자 액션 처리 -->
    <button @click="submitForm">등록하기</button>

    <p class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.page {
  max-width: 500px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  width: 100%;
  padding: 12px;
  background: #2ecc71;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
}

.message {
  margin-top: 15px;
  font-weight: bold;
  color: #e74c3c;
}
</style>
