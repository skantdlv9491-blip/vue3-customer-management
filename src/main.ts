// Vue 애플리케이션 인스턴스를 생성하는 함수
// - createApp(App)을 호출하면 Vue 앱 객체가 만들어짐
import { createApp } from 'vue'

// 루트 컴포넌트(App.vue)
// - 화면의 최상위(레이아웃) 컴포넌트
// - 모든 페이지는 App.vue 내부의 <router-view /> 자리에 렌더링됨
import App from './App.vue'

// 라우터 설정 모듈 import
// - ./router 는 보통 src/router/index.ts를 가리킴
// - index.ts가 export default router를 하고 있으므로 default import로 가져올 수 있음
import router from './router'

// Vue 앱 생성
// - App.vue를 루트로 설정
// - .use(router)로 라우터를 앱에 장착 (페이지 이동 가능)
// - .mount('#app')로 index.html의 <div id="app">에 렌더링 시작
createApp(App).use(router).mount('#app')
