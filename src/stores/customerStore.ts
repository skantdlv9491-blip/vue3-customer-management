import { ref } from 'vue'

export interface Customer {
  id: number
  name: string
  phone: string
}

const customers = ref<Customer[]>([
  { id: 1, name: '홍길동', phone: '010-1234-5678' },
  { id: 2, name: '김영희', phone: '010-9876-5432' },
])

export const useCustomerStore = () => {
  const addCustomer = (name: string, phone: string) => {
    customers.value.push({
      id: customers.value.length + 1,
      name,
      phone,
    })
  }

  return {
    customers,
    addCustomer,
  }
}
