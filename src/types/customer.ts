// export를 쓰는 이유: 여러 컴포넌트/뷰에서 고객 타입을 재사용하기 위해
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
}

// export를 쓰는 이유: 등록 시점엔 id가 없으므로 입력 전용 타입을 재사용하기 위해
export type CustomerInput = Omit<Customer, 'id'>
