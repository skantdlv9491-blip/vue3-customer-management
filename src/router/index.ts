// vue-router에서 라우터 생성에 필요한 함수들을 import
// - createRouter: 라우터 인스턴스를 생성
// - createWebHistory: URL을 깔끔하게 쓰는 history 모드 (# 없음)
import { createRouter, createWebHistory } from 'vue-router'

// 페이지(views) 단위 컴포넌트 import
// - 이 컴포넌트들이 URL에 매핑되어 실제 화면으로 렌더링됨
import CustomerList from '@/views/CustomerList.vue'
import CustomerForm from '@/views/CustomerForm.vue'
import FileUpload from '@/views/FileUpload.vue'

// 라우팅 테이블
// - path: URL 경로
// - component: 해당 URL에서 보여줄 컴포넌트(페이지)
const routes = [
  {
    // 기본 진입 경로
    path: '/',
    // 고객 목록 페이지
    component: CustomerList,
  },
  {
    // 고객 등록 페이지
    path: '/register',
    component: CustomerForm,
  },
  {
    // 파일 업로드 페이지
    path: '/upload',
    component: FileUpload,
  },
]

// 라우터 인스턴스 생성
const router = createRouter({
  // history 모드 사용: /register 처럼 깔끔한 URL
  history: createWebHistory(),
  // 위에서 정의한 routes를 라우터에 등록
  routes,
})

// export default:
// - 이 파일의 대표 export(기본 내보내기)
// - import 시 이름을 자유롭게 지을 수 있음
//   예) import router from './router'
export default router
