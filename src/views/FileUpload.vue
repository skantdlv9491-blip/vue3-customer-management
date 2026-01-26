<script setup lang="ts">
import { ref } from 'vue'

const selectedFile = ref<File | null>(null)
const message = ref('')
const isUpload = ref(false)

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) {
    return
  }

  const file = target.files[0]

  if (!file) {
    return
  }

  // 용량 제한 (5mb)
  if (file.size > 5 * 1024 * 1024) {
    message.value = '파일 용량은 5MB 이하만 가능합니다.'
    return
  }

  // 확장자 제한
  const allwedTypes = ['image/png', 'image/jpeg', 'application/pdf']
  if (!allwedTypes.includes(file.type)) {
    message.value = 'PNG, JPG, PDF 파일만 업로드 가능합니다.'
    return
  }

  selectedFile.value = file
  message.value = '파일 선택 완료'
}

const buildFormData = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'customer-doc')
  return formData
}

const upload = async () => {
  if (!selectedFile.value) {
    message.value = '업로드할 파일을 먼저 선택해주세요.'
    return
  }

  isUpload.value = true
  message.value = ''

  try {
    // TODO: 서버 API 연동 시 사용
    const formData = buildFormData(selectedFile.value)
    console.log(formData)

    // ✅ 지금은 서버가 없으니 "전송 시뮬레이션"만
    // 나중에 Java(Spring) 붙이면 여기서 fetch/axios로 POST 요청하면 됨.
    await new Promise((r) => setTimeout(r, 600))

    message.value = `업로드 준비 완료 (전송할 파일: ${selectedFile.value.name})`
  } finally {
    isUpload.value = false
  }
}
</script>

<template>
  <div class="page">
    <h2>파일 업로드</h2>
    <input type="file" v-on:change="onFileChange" />

    <div v-if="selectedFile" class="file-info">
      <p>파일명 : {{ selectedFile.name }}</p>
      <p>파일명 : {{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
    </div>

    <p class="message">{{ message }}</p>
  </div>

  <button class="btn" :disabled="isUpload" @click="upload">
    {{ isUpload ? '업로드 중...' : '업로드' }}
  </button>
</template>

<style scoped>
.page {
  max-width: 500px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
}

.file-info {
  margin-top: 15px;
  background: #f7f9fc;
  padding: 10px;
  border-radius: 6px;
}

.message {
  margin-top: 10px;
  font-weight: bold;
}

.btn {
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #3498db;
  color: white;
  font-size: 15px;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
