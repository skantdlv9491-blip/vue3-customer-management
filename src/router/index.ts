import { createRouter, createWebHistory } from 'vue-router'
import CustomerForm from '../views/CustomerForm.vue'
import FileUpload from '../views/FileUpload.vue'
import CustomerList from '../views/CustomerList.vue'

const routes = [
  { path: '/', component: CustomerList },
  { path: '/register', component: CustomerForm },
  { path: '/upload', component: FileUpload },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
