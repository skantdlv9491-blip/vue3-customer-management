// defineStore를 import하는 이유: Pinia 스토어(전역 상태/로직)를 만들기 위해
import { defineStore } from 'pinia'

// 타입을 import하는 이유: 상태와 액션 파라미터를 타입으로 고정하기 위해
import type { Customer, CustomerInput } from '../types/customer'

// export를 쓰는 이유: 다른 뷰/컴포넌트에서 이 store를 import해서 쓰기 위해
export const useCustomerStore = defineStore('customer', {
  // state를 쓰는 이유: 전역에서 공유할 고객 목록 + 현재 수정 대상 id를 관리하기 위해
  state: () => ({
    customers: [
      { id: 1, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
      { id: 2, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
    ] as Customer[],

    // 수정 모드에서 어떤 고객을 수정 중인지 추적하기 위한 id
    editingId: null as number | null,
  }),

  // getters를 쓰는 이유: editingId에 해당하는 고객 객체를 쉽게 가져오기 위해
  getters: {
    // 현재 수정 대상 고객(없으면 null)
    editingCustomer(state): Customer | null {
      // editingId가 없으면 수정 모드가 아님
      if (state.editingId === null) return null

      // editingId와 같은 고객 찾기
      return state.customers.find((c) => c.id === state.editingId) ?? null
    },
  },

  // actions를 쓰는 이유: 상태 변경 로직을 한 곳에서 통제하기 위해
  actions: {
    // 등록(Create)
    addCustomer(input: CustomerInput) {
      // 다음 id를 만들기 위해 현재 최대 id 계산
      const maxId = this.customers.reduce((max, c) => (c.id > max ? c.id : max), 0)

      // 최신이 위로 오게 unshift
      this.customers.unshift({
        id: maxId + 1,
        ...input,
      })
    },

    // 삭제(Delete)
    deleteCustomer(id: number) {
      // id가 다른 것만 남겨서 삭제 처리
      this.customers = this.customers.filter((c) => c.id !== id)

      // 삭제한 게 현재 수정 대상이면 수정 모드 해제
      if (this.editingId === id) this.editingId = null
    },

    // 수정 대상 선택(수정 모드 시작)
    startEdit(id: number) {
      // 수정할 고객 id를 저장
      this.editingId = id
    },

    // 수정 모드 종료(선택 해제)
    clearEdit() {
      // 수정 대상 id 제거
      this.editingId = null
    },

    // 수정(Update) - editingId 기반으로 대상 수정
    updateCustomer(input: CustomerInput) {
      // 수정 대상이 없으면 종료
      if (this.editingId === null) return

      // 수정 대상 id를 안전하게 보관(이 시점에 null 아님)
      const id = this.editingId

      // 수정 대상 인덱스 찾기
      const idx = this.customers.findIndex((c) => c.id === id)

      // 대상이 없으면 종료
      if (idx < 0) return

      // 기존 id 유지하면서 업데이트
      this.customers[idx] = {
        id,
        ...input,
      }

      // 수정 모드 종료
      this.editingId = null
    },
  },
})
