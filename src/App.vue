<script setup lang="ts">
// vue-router에서 제공하는 라우터 훅
// - 코드에서 페이지 이동(router.push)을 하기 위해 사용
import { useRouter } from 'vue-router'

/* store import */
/* import를 쓰는 이유: 전역 수정 상태(editingId)를 초기화(clearEdit)하기 위함 */
import { useCustomerStore } from '@/stores/customerStore'

// 라우터 인스턴스 생성
const router = useRouter()

/* store 인스턴스 생성 */
const customerStore = useCustomerStore()

/* 등록 페이지 이동(항상 신규 등록 모드) */
const goRegisterNew = () => {
  /* 이전에 눌렀던 수정 상태가 남아있을 수 있으므로 초기화 */
  customerStore.clearEdit()

  router.push('/register')
}
</script>

<template>
  <div id="app">
    <!-- ===================== -->
    <!-- 상단 공통 헤더 영역 -->
    <!-- ===================== -->
    <header class="header">
      <h1>고객 관리 시스템</h1>
      <p>Vue3 + TypeScript 연습 프로젝트</p>
    </header>

    <!-- ===================== -->
    <!-- 라우터 페이지 렌더링 영역 -->
    <!-- ===================== -->
    <!--
      현재 URL에 따라 선택된 페이지 컴포넌트가
      이 위치에 렌더링됨
      예)
      /register -> CustomerForm.vue
      /upload   -> FileUpload.vue
    -->
    <router-view />

    <!-- ===================== -->
    <!-- 메인 메뉴 영역 -->
    <!-- ===================== -->
    <main class="container">
      <!-- 고객 등록 메뉴 카드 -->
      <section class="card">
        <h2>📋 고객 정보 등록</h2>
        <!-- 클릭 시 고객 등록 페이지로 이동 -->
        <button @click="goRegisterNew">등록하러 가기</button>
      </section>

      <!-- 파일 업로드 메뉴 카드 -->
      <section class="card">
        <h2>📁 파일 업로드</h2>
        <!-- 클릭 시 파일 업로드 페이지로 이동 -->
        <button @click="router.push('/upload')">파일 업로드</button>
      </section>

      <!-- 고객 목록 메뉴 카드 -->
      <section class="card">
        <h2>📞 고객 목록 보기</h2>
        <!-- 클릭 시 고객 목록 페이지로 이동 -->
        <button @click="router.push('/')">목록 보기</button>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ===================== */
/* 전체 앱 기본 스타일 */
/* ===================== */
#app {
  /* 한국 웹사이트에서 많이 쓰는 기본 폰트 */
  font-family: 'Noto Sans KR', sans-serif;

  /* 전체 배경색 (관리자/업무 시스템 느낌) */
  background: #f5f6f8;

  /* 화면 높이를 최소 viewport 높이만큼 확보 */
  min-height: 100vh;
}

/* ===================== */
/* 상단 헤더 스타일 */
/* ===================== */
.header {
  /* 헤더 배경색 */
  background: #2c3e50;

  /* 헤더 텍스트 색상 */
  color: white;

  /* 헤더 내부 여백 */
  padding: 20px;

  /* 텍스트 가운데 정렬 */
  text-align: center;
}

/* ===================== */
/* 메인 메뉴 컨테이너 */
/* ===================== */
.container {
  /* 컨텐츠 최대 폭 제한 (큰 화면에서도 너무 넓어지지 않게) */
  max-width: 900px;

  /* 가운데 정렬 + 위아래 여백 */
  margin: 40px auto;

  /* 카드들을 세로로 배치 */
  display: grid;

  /* 한 줄에 하나씩 카드 배치 */
  grid-template-columns: 1fr;

  /* 카드 사이 간격 */
  gap: 20px;
}

/* ===================== */
/* 메뉴 카드 스타일 */
/* ===================== */
.card {
  /* 카드 배경 */
  background: white;

  /* 카드 내부 여백 */
  padding: 20px;

  /* 카드 모서리 둥글게 */
  border-radius: 10px;

  /* 카드 그림자 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* ===================== */
/* 버튼 기본 스타일 */
/* ===================== */
button {
  /* 위쪽 여백 */
  margin-top: 10px;

  /* 버튼 내부 여백 */
  padding: 10px 15px;

  /* 기본 테두리 제거 */
  border: none;

  /* 버튼 배경색 */
  background: #3498db;

  /* 버튼 글자색 */
  color: white;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 클릭 가능 커서 */
  cursor: pointer;
}

/* 버튼 마우스 오버 효과 */
button:hover {
  /* 마우스 올리면 조금 더 진한 색 */
  background: #2980b9;
}
</style>
