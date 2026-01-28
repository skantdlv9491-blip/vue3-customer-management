// 고객 데이터 구조를 전역에서 재사용하기 위해 interface를 export
// export를 쓰는 이유: 여러 컴포넌트에서 동일한 타입을 공유하기 위함
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
}
