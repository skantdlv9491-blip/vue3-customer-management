<script setup lang="ts">
// ref: 입력값/메시지 같은 상태를 반응형으로 관리
import { ref } from 'vue'

// store import
// - useCustomerStore()로 고객 목록 추가 기능을 사용
import { useCustomerStore } from '../stores/customerStore'

// 이름 입력값 상태
const name = ref('')

// 전화번호 입력값 상태
const phone = ref('')

// 사용자에게 보여줄 안내 메시지
const message = ref('')

// store에서 addCustomer 함수만 꺼내오기
const { addCustomer } = useCustomerStore()

// 등록 처리 함수
const submitForm = () => {
  // 필수값 검증: 이름/전화번호가 비어 있으면 중단
  if (!name.value || !phone.value) {
    message.value = '이름과 전화번호를 입력해주세요.'
    return
  }

  // 전화번호 형식 검증 정규식
  // - 010-1234-5678 형태만 허용
  const phoneRegex = /^010-\d{4}-\d{4}$/

  // 정규식 불일치면 중단
  if (!phoneRegex.test(phone.value)) {
    message.value = '전화번호 형식은 010-1234-5678 입니다.'
    return
  }

  // store에 고객 추가 (전역 상태 갱신)
  addCustomer(name.value, phone.value)

  // 성공 메시지
  message.value = '등록 완료!'

  // 입력칸 초기화
  name.value = ''
  phone.value = ''
}
</script>

<template>
  <div class="page">
    <h2>고객 정보 등록</h2>

    <div class="form-group">
      <label>이름</label>
      <!-- v-model: input 값 ↔ name 상태 자동 동기화 -->
      <input v-model="name" type="text" placeholder="홍길동" />
    </div>

    <div class="form-group">
      <label>전화번호</label>
      <!-- v-model: input 값 ↔ phone 상태 자동 동기화 -->
      <input v-model="phone" type="text" placeholder="010-1234-5678" />
    </div>

    <!-- 클릭 이벤트로 submitForm 실행 -->
    <button @click="submitForm">등록하기</button>

    <!-- message 상태를 화면에 표시 -->
    <p class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
/* page: 카드형 폼 컨테이너 */
.page {
  /* 폼 최대 폭 제한 */
  max-width: 500px;

  /* 가운데 정렬 + 상하 여백 */
  margin: 40px auto;

  /* 카드 배경 */
  background: white;

  /* 내부 여백 */
  padding: 30px;

  /* 모서리 둥글게 */
  border-radius: 10px;

  /* 그림자: 떠 보이는 카드 느낌 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* form-group: 라벨과 인풋 묶음 */
.form-group {
  /* 세로 배치 */
  display: flex;

  /* 자식 요소를 세로 방향으로 쌓기 */
  flex-direction: column;

  /* 아래 여백 */
  margin-bottom: 15px;
}

label {
  /* 라벨 굵게 */
  font-weight: bold;

  /* 라벨과 input 사이 여백 */
  margin-bottom: 5px;
}

input {
  /* 입력창 내부 여백 */
  padding: 10px;

  /* 테두리 */
  border: 1px solid #ccc;

  /* 모서리 둥글게 */
  border-radius: 6px;
}

button {
  /* 버튼 폭을 폼에 맞게 100% */
  width: 100%;

  /* 버튼 내부 여백 */
  padding: 12px;

  /* 기본 테두리 제거 */
  border: none;

  /* 버튼 배경색 */
  background: #2ecc71;

  /* 버튼 글자색 */
  color: white;

  /* 글자 크기 */
  font-size: 16px;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 마우스 올리면 클릭 가능한 커서 */
  cursor: pointer;
}

button:hover {
  /* 마우스 오버 시 배경 조금 더 진하게 */
  background: #27ae60;
}

.message {
  /* 위 여백 */
  margin-top: 15px;

  /* 강조 */
  font-weight: bold;

  /* 메시지 색 */
  color: #e74c3c;
}
</style>
