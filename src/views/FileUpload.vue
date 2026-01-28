<script setup lang="ts">
// ref: 파일/메시지/로딩 상태를 반응형으로 관리
import { ref } from 'vue'

// 선택된 파일 상태
// - File: 사용자가 선택한 파일 객체
// - null: 아직 파일 선택 안 함
const selectedFile = ref<File | null>(null)

// 사용자에게 보여줄 메시지
const message = ref('')

// 업로드 진행 중 상태
// - true: 업로드 중(버튼 비활성화 등)
// - false: 업로드 가능
const isUploading = ref(false)

// 파일 선택 이벤트 핸들러
// - input type="file"의 change 이벤트로 호출됨
const onFileChange = (event: Event) => {
  // 이벤트 타겟을 파일 input으로 캐스팅
  const target = event.target as HTMLInputElement

  // 파일 리스트가 없거나 비어있으면 중단
  if (!target.files || target.files.length === 0) return

  // 첫 번째 파일만 사용(단일 업로드)
  const file = target.files[0]
  if (!file) return

  // 파일 용량 제한: 5MB
  // - size는 바이트 단위
  if (file.size > 5 * 1024 * 1024) {
    selectedFile.value = null
    message.value = '파일 용량은 5MB 이하만 가능합니다.'
    return
  }

  // 허용 타입 제한(MIME 타입 기준)
  // - 보안적으로는 서버에서도 반드시 재검증 필요
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    selectedFile.value = null
    message.value = 'PNG, JPG, PDF 파일만 업로드 가능합니다.'
    return
  }

  // 검증 통과: 상태 저장
  selectedFile.value = file
  message.value = '파일 선택 완료'
}

// 업로드 처리 함수
// - 지금은 서버가 없어서 시뮬레이션만
// - 나중에 Java(Spring) 붙일 때 여기에 FormData + POST 요청 추가
const upload = async () => {
  // file 변수로 고정하면 TS가 아래에서 File임을 확정해줌
  const file = selectedFile.value

  // 파일이 없으면 중단
  if (!file) {
    message.value = '파일을 먼저 선택해주세요.'
    return
  }

  // 업로드 시작
  isUploading.value = true

  try {
    // TODO: 서버 연동 시 FormData 생성 및 업로드 요청 구현
    await new Promise((r) => setTimeout(r, 600))

    // 완료 메시지
    message.value = `업로드 준비 완료 (${file.name})`
  } finally {
    // 성공/실패 상관없이 업로드 상태 해제
    isUploading.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>파일 업로드</h2>

    <!-- 파일 선택 인풋 -->
    <input type="file" @change="onFileChange" />

    <!-- 파일이 선택된 경우에만 정보 표시 -->
    <div v-if="selectedFile" class="file-info">
      <p>파일명: {{ selectedFile.name }}</p>
      <p>용량: {{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
    </div>

    <!-- 업로드 버튼 -->
    <button class="btn" :disabled="isUploading" @click="upload">
      {{ isUploading ? '업로드 중...' : '업로드' }}
    </button>

    <!-- 안내 메시지 -->
    <p class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.page {
  /* 화면 최대 폭 제한 */
  max-width: 500px;

  /* 가운데 정렬 + 상하 여백 */
  margin: 40px auto;

  /* 카드 배경 */
  background: white;

  /* 내부 여백 */
  padding: 30px;

  /* 모서리 둥글게 */
  border-radius: 10px;
}

.file-info {
  /* 위쪽 여백 */
  margin-top: 15px;

  /* 안내 박스 배경 */
  background: #f7f9fc;

  /* 내부 여백 */
  padding: 10px;

  /* 모서리 둥글게 */
  border-radius: 6px;
}

.btn {
  /* 위쪽 여백 */
  margin-top: 12px;

  /* 버튼 폭 100% */
  width: 100%;

  /* 내부 여백 */
  padding: 12px;

  /* 기본 테두리 제거 */
  border: none;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 커서 변경 */
  cursor: pointer;

  /* 배경색 */
  background: #3498db;

  /* 글자색 */
  color: white;

  /* 글자 크기 */
  font-size: 15px;
}

.btn:disabled {
  /* 비활성일 때 클릭 불가 느낌 */
  cursor: not-allowed;

  /* 흐리게 표시 */
  opacity: 0.6;
}

.message {
  /* 위쪽 여백 */
  margin-top: 10px;

  /* 강조 */
  font-weight: bold;
}
</style>
