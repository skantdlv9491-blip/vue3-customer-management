// defineStore를 import하는 이유: Pinia 스토어(전역 상태/로직)를 만들기 위해
import { defineStore } from 'pinia'

// 타입을 import하는 이유: 상태와 액션 파라미터를 타입으로 고정하기 위해
import type { Customer, CustomerInput } from '@/types/customer'

/* ===============================
  localStorage 키
  ===============================
  - 키를 고정하는 이유: 저장/복원 위치를 일관되게 유지하기 위함
  - v1을 붙이는 이유: 나중에 데이터 구조 변경 시 버전 관리하기 위함
*/
const STORAGE_KEY = 'vue3-customer-management.customers.v1'

/* ===============================
  기본 샘플 데이터
  ===============================
  - 최초 실행/손상 데이터 복구 시 사용할 기본값
*/
const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 1, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 2, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 3, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 4, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 5, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 6, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 7, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 8, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 9, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 10, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 11, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 12, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 13, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 14, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 15, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 16, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 17, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 18, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 19, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 20, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 21, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 22, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
  { id: 23, name: '홍길동', email: 'hong@test.com', phone: '010-1111-2222' },
  { id: 24, name: '김철수', email: 'kim@test.com', phone: '010-3333-4444' },
]

/* ===============================
  타입 가드: unknown -> Customer 여부 확인
  ===============================
  - unknown을 쓰는 이유: any 금지 규칙을 지키면서 런타임 검증을 하기 위함
*/
const isCustomer = (value: unknown): value is Customer => {
  if (typeof value !== 'object' || value === null) return false

  // Record<string, unknown>로 변환하는 이유: 안전하게 프로퍼티 접근하기 위함
  const v = value as Record<string, unknown>

  return (
    typeof v.id === 'number' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    typeof v.phone === 'string'
  )
}

/* ===============================
  customers 로드 함수
  ===============================
  - try/catch를 쓰는 이유: JSON 파싱 실패/손상 데이터에서 앱이 죽지 않게 하기 위함
*/
const loadCustomers = (): Customer[] => {
  try {
    // localStorage에서 문자열로 가져오기
    const raw = localStorage.getItem(STORAGE_KEY)

    // 저장된 값이 없으면(최초 실행) 기본 샘플 데이터 반환
    if (!raw) return DEFAULT_CUSTOMERS

    // JSON 파싱 결과는 unknown으로 받는 이유: 런타임 데이터는 신뢰할 수 없기 때문
    const parsed: unknown = JSON.parse(raw)

    // 배열이 아니면 기본 샘플 데이터 반환
    if (!Array.isArray(parsed)) return DEFAULT_CUSTOMERS

    // 타입 가드로 Customer만 남기기
    const safe = parsed.filter(isCustomer)

    // 유효 데이터가 0이면 기본 샘플 데이터 반환
    return safe.length ? safe : DEFAULT_CUSTOMERS
  } catch {
    // 알 수 없는 오류/손상 데이터면 샘플 데이터로 초기화
    return DEFAULT_CUSTOMERS
  }
}

/* ===============================
  customers 저장 함수
  ===============================
  - 함수로 분리한 이유: add/update/delete 어디서든 동일 로직 재사용하기 위함
*/
const saveCustomers = (customers: Customer[]) => {
  // JSON 문자열로 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

// export를 쓰는 이유: 다른 뷰/컴포넌트에서 이 store를 import해서 쓰기 위해
export const useCustomerStore = defineStore('customer', {
  // state를 쓰는 이유: 전역에서 공유할 고객 목록 + 현재 수정 대상 id를 관리하기 위해
  state: () => ({
    // customers를 loadCustomers()로 초기화하는 이유: 새로고침해도 데이터가 유지되게 하기 위함
    customers: loadCustomers(),

    // 수정 모드에서 어떤 고객을 수정 중인지 추적하기 위한 id
    // localStorage로 저장하지 않는 이유: 새로고침 시 수정모드가 남아 UX가 꼬이는 것을 방지하기 위함
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

      // 변경 후 저장
      saveCustomers(this.customers)
    },

    // 삭제(Delete)
    deleteCustomer(id: number) {
      // id가 다른 것만 남겨서 삭제 처리
      this.customers = this.customers.filter((c) => c.id !== id)

      // 삭제한 게 현재 수정 대상이면 수정 모드 해제
      if (this.editingId === id) this.editingId = null

      // 변경 후 저장
      saveCustomers(this.customers)
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

      // 변경 후 저장
      saveCustomers(this.customers)
    },

    /* (선택) 저장 데이터 초기화 - 개발 중 테스트용 */
    resetCustomers() {
      this.customers = [...DEFAULT_CUSTOMERS]
      this.editingId = null
      saveCustomers(this.customers)
    },
  },
})
