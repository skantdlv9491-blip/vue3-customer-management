/* fileURLToPath/URL을 import하는 이유: ESM 환경에서 절대 경로를 안전하게 만들기 위해 */
import { fileURLToPath, URL } from 'node:url'

/* defineConfig를 import하는 이유: Vite 설정 객체의 타입/자동완성/검증을 받기 위해 */
import { defineConfig } from 'vite'

/* vue 플러그인을 import하는 이유: Vue SFC(.vue)를 Vite가 처리할 수 있게 하기 위해 */
import vue from '@vitejs/plugin-vue'

/* vueDevTools를 import하는 이유: 개발 중 Vue DevTools 기능을 쉽게 쓰기 위해 */
import vueDevTools from 'vite-plugin-vue-devtools'

/* export default를 쓰는 이유: Vite가 이 설정을 기본 설정으로 읽어가기 때문 */
export default defineConfig({
  /* plugins를 쓰는 이유: Vue SFC 처리 + devtools 기능을 Vite에 추가하기 위해 */
  plugins: [vue(), vueDevTools()],

  /* resolve를 쓰는 이유: import 경로 해석 규칙(alias 등)을 정의하기 위해 */
  resolve: {
    /* alias를 쓰는 이유: src를 기준으로 절대경로(@/...) import를 가능하게 하기 위해 */
    alias: {
      /* @를 src로 매핑하는 이유: '@/components/...' 형태로 경로를 짧고 안정적으로 쓰기 위함 */
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
