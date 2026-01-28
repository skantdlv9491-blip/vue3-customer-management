<script setup lang="ts">
// 타입을 import하는 이유: props 타입을 안전하게 고정하기 위해
import type { Customer } from '../types/customer'

// defineProps를 쓰는 이유: 부모에서 내려준 고객 목록을 받기 위해
const props = defineProps<{
  customers: Customer[]
}>()

// defineEmits를 쓰는 이유: 자식에서 부모에게 삭제/수정 요청을 이벤트로 알리기 위해
const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'edit', id: number): void
}>()

// 삭제 요청
const onDelete = (id: number) => {
  emit('delete', id)
}

// 수정 요청
const onEdit = (id: number) => {
  emit('edit', id)
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
        <td class="actions">
          <button class="btnEdit" type="button" @click="onEdit(c.id)">수정</button>
          <button class="btnDelete" type="button" @click="onDelete(c.id)">삭제</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
/* 테이블 레이아웃 */
.table {
  /* 너비 100% */
  width: 100%;

  /* 경계선 병합 */
  border-collapse: collapse;
}

/* 헤더/셀 공통 */
th,
td {
  /* 내부 여백 */
  padding: 8px;

  /* 테두리 */
  border: 1px solid #ddd;

  /* 텍스트 정렬 */
  text-align: left;
}

/* 버튼 영역 */
.actions {
  /* 버튼들을 가로로 배치 */
  display: flex;

  /* 버튼 사이 간격 */
  gap: 8px;

  /* 세로 중앙 정렬 */
  align-items: center;
}

/* 수정 버튼 */
.btnEdit {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 4px 8px;

  /* 테두리 제거 */
  border: none;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #111;

  /* 글자색 */
  color: #fff;
}

/* 삭제 버튼 */
.btnDelete {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 4px 8px;

  /* 테두리 제거 */
  border: none;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #ff4d4f;

  /* 글자색 */
  color: #fff;
}
</style>
