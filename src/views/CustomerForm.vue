<script setup lang="ts">
// ref를 import하는 이유: 입력값을 반응형으로 관리하기 위해
import { ref, watch, computed } from 'vue'

// useRouter를 import하는 이유: 등록/수정 후 목록으로 이동하기 위해
import { useRouter } from 'vue-router'

// store를 import하는 이유: 등록/수정/수정대상 정보를 Pinia에서 관리하기 위해
import { useCustomerStore } from '../stores/customerStore'

// 타입을 import하는 이유: 저장할 입력 데이터 구조를 고정하기 위해
import type { CustomerInput } from '../types/customer'

// 라우터 인스턴스
const router = useRouter()

// store 인스턴스
const customerStore = useCustomerStore()

// 입력값 상태
const name = ref('')
const email = ref('')
const phone = ref('')

// 에러 메시지 상태
const errors = ref<{
  name?: string
  email?: string
  phone?: string
}>({})

// 수정 대상(customerStore.editingCustomer)이 바뀔 때 폼을 채우기 위해 watch 사용
watch(
  () => customerStore.editingCustomer,
  (c) => {
    if (c) {
      name.value = c.name
      email.value = c.email
      phone.value = c.phone
    } else {
      name.value = ''
      email.value = ''
      phone.value = ''
    }
    errors.value = {}
  },
  { immediate: true },
)

// 이메일 형식 체크용 정규식 (실무 최소)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 전화번호 형식 검증 정규식
// - 010-1234-5678 형태만 허용
const phoneRegex = /^010\d{4}\d{4}$/

// 유효성 검사
const validate = (): boolean => {
  const e: typeof errors.value = {}

  if (!name.value.trim()) {
    e.name = '이름은 필수입니다.'
  }

  if (!email.value.trim()) {
    e.email = '이메일은 필수입니다.'
  } else if (!emailRegex.test(email.value)) {
    e.email = '이메일 형식이 올바르지 않습니다.'
  }

  if (!phone.value.trim()) {
    e.phone = '전화번호는 필수입니다.'
  }

  // 정규식 불일치면 중단
  if (!phoneRegex.test(phone.value)) {
    e.phone = '전화번호 형식은 01012345678 입니다.'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

// submit 가능 여부(버튼 비활성화용)
const canSubmit = computed(() => {
  return name.value && email.value && phone.value
})

// 제출
const onSubmit = () => {
  if (!validate()) return

  const payload: CustomerInput = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
  }

  if (customerStore.editingId !== null) {
    customerStore.updateCustomer(payload)
  } else {
    customerStore.addCustomer(payload)
  }

  router.push('/')
}

// 취소
const onCancel = () => {
  customerStore.clearEdit()
  router.push('/')
}
</script>

<template>
  <section class="container">
    <h2>📝 고객 {{ customerStore.editingId !== null ? '수정' : '등록' }}</h2>

    <form class="form" @submit.prevent="onSubmit">
      <div class="row">
        <label class="label">이름</label>
        <input class="input" v-model="name" />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="row">
        <label class="label">이메일</label>
        <input class="input" v-model="email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="row">
        <label class="label">전화번호</label>
        <input class="input" v-model="phone" />
        <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
      </div>

      <div class="actions">
        <button class="btnPrimary" type="submit" :disabled="!canSubmit">
          {{ customerStore.editingId !== null ? '수정 완료' : '등록' }}
        </button>

        <button class="btnGhost" type="button" @click="onCancel">취소</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
/* 페이지 컨테이너 */
.container {
  /* 내부 여백 */
  padding: 16px;
}

/* 폼 컨테이너 */
.form {
  /* 내부 여백 */
  padding: 12px;

  /* 테두리 */
  border: 1px solid #ddd;

  /* 모서리 둥글게 */
  border-radius: 8px;
}

/* 입력 행 */
.row {
  /* 아래 간격 */
  margin-bottom: 10px;
}

/* 라벨 */
.label {
  /* 블록 처리 */
  display: block;

  /* 글자 굵기 */
  font-weight: 600;

  /* 아래 여백 */
  margin-bottom: 6px;
}

/* 입력창 */
.input {
  /* 너비 100% */
  width: 100%;

  /* 내부 여백 */
  padding: 8px;

  /* 테두리 */
  border: 1px solid #ccc;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* padding 포함 계산 */
  box-sizing: border-box;
}

/* 버튼 영역 */
.actions {
  /* 가로 배치 */
  display: flex;

  /* 버튼 간격 */
  gap: 8px;

  /* 위 여백 */
  margin-top: 12px;
}

/* 기본 버튼 */
.btnPrimary {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 8px 12px;

  /* 테두리 제거 */
  border: none;

  /* 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #111;

  /* 글자색 */
  color: #fff;
}

/* 보조 버튼 */
.btnGhost {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 8px 12px;

  /* 테두리 */
  border: 1px solid #ddd;

  /* 둥글게 */
  border-radius: 6px;

  /* 배경 */
  background-color: #fff;

  /* 글자색 */
  color: #111;
}

/* 에러 메시지 */
.error {
  /* 글자색 */
  color: #ff4d4f;

  /* 글자 크기 */
  font-size: 12px;

  /* 위 여백 */
  margin-top: 4px;
}

/* 비활성 버튼 */
button:disabled {
  /* 투명도 */
  opacity: 0.5;

  /* 클릭 불가 커서 */
  cursor: not-allowed;
}
</style>
