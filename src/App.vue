<!--npm run dev-->
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div id="app">
    <header class="header">
      <h1>고객 관리 시스템</h1>
      <p>Vue3 + TypeScript 연습 프로젝트</p>
    </header>
    <router-view />
    <main class="container">
      <selection class="card">
        <h2>📋 고객 정보 등록</h2>
        <button @click="router.push('/register')">등록하러 가기</button>
      </selection>
      <selection class="card">
        <h2>📁 파일 업로드</h2>
        <button @click="router.push('/upload')">파일 업로드</button>
      </selection>
      <selection class="card">
        <h2>📞 고객 목록 보기</h2>
        <button @click="router.push('/')">목록 보기</button>
      </selection>
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Noto Sns KR', sans-serif;
  background-color: #f5f6f8;
  min-height: 100vh;
}

.header {
  background: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
}

.container {
  max-width: 900px;
  margin: 40px auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  background: #3498db;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #2980b9;
}
</style>
