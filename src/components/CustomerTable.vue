<script setup lang="ts">
// Vue에서 props/emit 타입 안전하게 쓰기 위해 import
import type { Customer } from '@/types/customer'

// 부모로부터 데이터만 받기 때문에 props 사용
// props는 단방향 데이터 흐름(부모 → 자식)을 유지하기 위해 사용
const props = defineProps<{
  customers: Customer[]
}>()

// 자식에서 이벤트를 부모로 올리기 위해 emit 사용
// emit은 상태 변경을 부모에게 위임하기 위한 공식 패턴
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

// 삭제 버튼 클릭 시 부모에게 id 전달
const onDelete = (id: number) => {
  emit('delete', id)
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>이름</th>
        <th>이메일</th>
        <th>전화번호</th>
        <th>관리</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="c in props.customers" :key="c.id">
        <td>{{ c.name }}</td>
        <td>{{ c.email }}</td>
        <td>{{ c.phone }}</td>
        <td>
          <button @click="onDelete(c.id)">삭제</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* 테이블 전체 레이아웃 */
.table {
  /* 테이블 너비를 부모 기준 100%로 설정 */
  width: 100%;

  /* 셀 경계선 병합 */
  border-collapse: collapse;
}

/* 테이블 헤더, 바디 공통 셀 스타일 */
th,
td {
  /* 셀 내부 여백 */
  padding: 8px;

  /* 셀 테두리 */
  border: 1px solid #ddd;

  /* 텍스트 정렬 */
  text-align: left;
}

/* 삭제 버튼 스타일 */
button {
  /* 클릭 가능 커서 */
  cursor: pointer;

  /* 배경색 */
  background-color: #ff4d4f;

  /* 글자색 */
  color: white;

  /* 테두리 제거 */
  border: none;

  /* 내부 여백 */
  padding: 4px 8px;
}
</style>
