// Vue의 ref import
// - ref는 반응형(reactive) 상태를 만들기 위한 함수
// - ref로 만든 값이 바뀌면 Vue가 화면을 자동 갱신함
import { ref } from 'vue'

// export interface:
// - 타입스크립트 타입을 다른 파일에서도 쓰게 "내보내는" 것
// - CustomerForm/CustomerList/추후 서버 DTO에서도 동일 타입을 사용할 수 있음
export interface Customer {
  id: number
  name: string
  phone: string
}

// customers 상태(전역 공유)
// - 이 값은 여러 컴포넌트에서 동시에 참조해도 같은 값(싱글톤처럼 동작)
// - 나중에 DB 붙이면: 초기값을 서버 응답으로 채우거나, 조회 API로 대체 가능
const customers = ref<Customer[]>([
  {
    id: 1,
    name: '홍길동',
    phone: '010-1234-5678',
  },
])

// export const:
// - 이 함수를 다른 컴포넌트에서 import하여 사용할 수 있음
// - useCustomerStore()를 호출하면 customers/addCustomer 등을 사용할 수 있음
export const useCustomerStore = () => {
  // 고객 추가 함수
  // - 지금은 프론트 메모리 배열에 push
  // - 나중에는 서버 POST 후 성공 시 목록을 갱신하는 구조로 확장 가능
  const addCustomer = (name: string, phone: string) => {
    customers.value.push({
      id: customers.value.length + 1,
      name,
      phone,
    })
  }

  // store에서 외부로 제공할 값/함수 반환
  return {
    customers,
    addCustomer,
  }
}
