<script setup lang="ts">
/* CustomerTable 컴포넌트를 사용하기 위해 import */
/* import를 쓰는 이유: 목록 테이블 UI를 현재 페이지에서 렌더링하기 위함 */
import CustomerTable from '@/components/CustomerTable.vue'

/* Pinia store를 사용하기 위해 import */
/* import를 쓰는 이유: 고객 목록/삭제/수정 시작 로직을 전역 상태에서 가져오기 위함 */
import { useCustomerStore } from '@/stores/customerStore'

/* computed/ref/watch를 사용하기 위해 import */
/* import를 쓰는 이유:
  - 검색어/정렬/페이지 상태(ref)
  - 필터/정렬/페이징 결과(computed)
  - 상태 변경 시 URL 쿼리 동기화(watch)
*/
import { computed, ref, watch } from 'vue'

/* useRoute/useRouter를 import하는 이유:
  - 현재 URL 쿼리(q/sort/page)를 읽어서 초기화하기 위함(useRoute)
  - 상태 변경을 URL에 반영하기 위함(router.replace)
  - 수정 클릭 시 /register 이동하기 위함(router.push)
*/
import { useRoute, useRouter } from 'vue-router'

/* store 인스턴스 생성 */
const customerStore = useCustomerStore()

/* router/route 인스턴스 생성 */
const router = useRouter()
const route = useRoute()

/* 정렬 옵션 타입 */
type SortKey = 'latest' | 'nameAsc' | 'emailAsc'

/* 페이지당 개수 */
/* 상수로 분리한 이유: 추후 UI에서 변경 옵션이 생겨도 한 곳만 바꾸면 되게 하기 위함 */
const PAGE_SIZE = 5

/* URL 쿼리 → 초기 상태 세팅 */
const keyword = ref<string>((route.query.q as string) ?? '')

const sortKey = ref<SortKey>(
  route.query.sort === 'latest' || route.query.sort === 'nameAsc' || route.query.sort === 'emailAsc'
    ? (route.query.sort as SortKey)
    : 'latest',
)

/* page 쿼리는 숫자로만 관리 */
const currentPage = ref<number>(Number(route.query.page) || 1)

/* 검색어 정리(공백 제거 + 소문자 변환) */
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase())

/* 검색어 기준 필터링 결과 */
const filteredCustomers = computed(() => {
  if (!normalizedKeyword.value) return customerStore.customers

  return customerStore.customers.filter((c) => {
    const name = c.name.toLowerCase()
    const email = c.email.toLowerCase()
    const phone = c.phone.toLowerCase()

    return (
      name.includes(normalizedKeyword.value) ||
      email.includes(normalizedKeyword.value) ||
      phone.includes(normalizedKeyword.value)
    )
  })
})

/* 필터링된 결과를 정렬해서 최종 목록 만들기 */
const sortedCustomers = computed(() => {
  /* 원본 배열을 직접 정렬하면(store 상태를) 망가뜨리므로 복사해서 정렬 */
  const list = [...filteredCustomers.value]

  /* 정렬 기준 분기 */
  if (sortKey.value === 'latest') {
    /* 최신순: addCustomer에서 unshift로 넣어서 이미 최신이 위 */
    return list
  }

  if (sortKey.value === 'nameAsc') {
    /* 이름 오름차순 */
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }

  /* 이메일 오름차순 */
  return list.sort((a, b) => a.email.localeCompare(b.email))
})

/* 전체 페이지 수 */
const totalPages = computed(() => {
  /* 최소 1페이지 보장 */
  return Math.max(1, Math.ceil(sortedCustomers.value.length / PAGE_SIZE))
})

/* 검색/정렬로 목록이 바뀌면 현재 페이지가 범위를 벗어날 수 있으니 보정 */
watch(sortedCustomers, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  /* 검색어가 바뀌면 1페이지로 보내고 싶으면 아래 주석 해제
  currentPage.value = 1
  */
})

/* 페이징된 최종 목록 */
const pagedCustomers = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedCustomers.value.slice(start, start + PAGE_SIZE)
})

/* 상태(keyword/sort/page) 변경 → URL 쿼리 반영 */
watch([keyword, sortKey, currentPage], () => {
  router.replace({
    query: {
      /* 검색어가 비어있으면 q 제거 */
      q: keyword.value.trim() ? keyword.value : undefined,

      /* 기본 정렬(latest)이면 sort 제거 */
      sort: sortKey.value !== 'latest' ? sortKey.value : undefined,

      /* 1페이지면 page 제거 */
      page: currentPage.value > 1 ? String(currentPage.value) : undefined,
    },
  })
})

/* URL 쿼리 변경(뒤로가기/새로고침) → 상태 반영 */
watch(
  () => route.query,
  (query) => {
    const nextKeyword = (query.q as string) ?? ''
    if (keyword.value !== nextKeyword) keyword.value = nextKeyword

    const nextSort: SortKey =
      query.sort === 'latest' || query.sort === 'nameAsc' || query.sort === 'emailAsc'
        ? (query.sort as SortKey)
        : 'latest'
    if (sortKey.value !== nextSort) sortKey.value = nextSort

    const nextPage = Number(query.page) || 1
    if (currentPage.value !== nextPage) currentPage.value = nextPage
  },
)

/* 삭제 처리 */
const deleteCustomer = (id: number) => {
  customerStore.deleteCustomer(id)
}

/* 수정 처리: 수정 대상 설정 + 등록 페이지로 이동 */
const editCustomer = (id: number) => {
  customerStore.startEdit(id)
  router.push('/register')
}

/* 검색어 초기화 */
const clearKeyword = () => {
  keyword.value = ''

  /* 검색 초기화 시 1페이지로 이동 */
  currentPage.value = 1
}
</script>

<template>
  <section class="container">
    <div class="header">
      <h2>📋 고객 목록</h2>
      <p class="count">총 {{ sortedCustomers.length }}명</p>
    </div>

    <div class="toolbar">
      <div class="searchBar">
        <input class="searchInput" v-model="keyword" placeholder="이름 / 이메일 / 전화번호 검색" />

        <button class="clearBtn" type="button" @click="clearKeyword" :disabled="!keyword.trim()">
          초기화
        </button>
      </div>

      <div class="sortBar">
        <label class="sortLabel">정렬</label>

        <select class="sortSelect" v-model="sortKey">
          <option value="latest">최신순</option>
          <option value="nameAsc">이름순</option>
          <option value="emailAsc">이메일순</option>
        </select>
      </div>
    </div>

    <CustomerTable :customers="pagedCustomers" @delete="deleteCustomer" @edit="editCustomer" />

    <div class="pagination">
      <button class="pageBtn" type="button" @click="currentPage -= 1" :disabled="currentPage === 1">
        이전
      </button>

      <span class="pageInfo">{{ currentPage }} / {{ totalPages }}</span>

      <button
        class="pageBtn"
        type="button"
        @click="currentPage += 1"
        :disabled="currentPage === totalPages"
      >
        다음
      </button>
    </div>
  </section>
</template>

<style scoped>
/* 페이지 전체 컨테이너 */
.container {
  /* 내부 여백 */
  padding: 16px;
}

/* 상단 제목/카운트 영역 */
.header {
  /* 가로 배치 */
  display: flex;

  /* 양 끝 정렬 */
  justify-content: space-between;

  /* 세로 중앙 정렬 */
  align-items: center;

  /* 아래 여백 */
  margin-bottom: 12px;
}

/* 검색 결과 카운트 텍스트 */
.count {
  /* 글자 크기 */
  font-size: 14px;

  /* 글자색 */
  color: #666;

  /* 기본 여백 제거 */
  margin: 0;
}

/* 검색 + 정렬 툴바 */
.toolbar {
  /* 세로 배치 */
  display: flex;

  /* 세로 간격 */
  flex-direction: column;

  /* 요소 간격 */
  gap: 10px;

  /* 아래 여백 */
  margin-bottom: 12px;
}

/* 검색바 영역 */
.searchBar {
  /* 가로 배치 */
  display: flex;

  /* 요소 간격 */
  gap: 8px;
}

/* 검색 입력창 */
.searchInput {
  /* 남는 공간 전부 차지 */
  flex: 1;

  /* 내부 여백 */
  padding: 8px;

  /* 테두리 */
  border: 1px solid #ccc;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* padding 포함 계산 */
  box-sizing: border-box;
}

/* 초기화 버튼 */
.clearBtn {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 8px 12px;

  /* 테두리 */
  border: 1px solid #ddd;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #fff;

  /* 글자색 */
  color: #111;
}

/* 초기화 버튼 비활성화 */
.clearBtn:disabled {
  /* 투명도 */
  opacity: 0.5;

  /* 클릭 불가 커서 */
  cursor: not-allowed;
}

/* 정렬 영역 */
.sortBar {
  /* 가로 배치 */
  display: flex;

  /* 세로 중앙 정렬 */
  align-items: center;

  /* 요소 간격 */
  gap: 8px;
}

/* 정렬 라벨 */
.sortLabel {
  /* 글자 크기 */
  font-size: 14px;

  /* 글자색 */
  color: #333;
}

/* 정렬 셀렉트 */
.sortSelect {
  /* 내부 여백 */
  padding: 6px 8px;

  /* 테두리 */
  border: 1px solid #ccc;

  /* 모서리 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #fff;
}

/* 페이징 영역 */
.pagination {
  /* 가로 배치 */
  display: flex;

  /* 가운데 정렬 */
  justify-content: center;

  /* 세로 중앙 정렬 */
  align-items: center;

  /* 요소 간격 */
  gap: 10px;

  /* 위 여백 */
  margin-top: 12px;
}

/* 페이징 버튼 */
.pageBtn {
  /* 클릭 커서 */
  cursor: pointer;

  /* 내부 여백 */
  padding: 6px 10px;

  /* 테두리 */
  border: 1px solid #ddd;

  /* 둥글게 */
  border-radius: 6px;

  /* 배경색 */
  background-color: #fff;

  /* 글자색 */
  color: #111;
}

/* 페이징 버튼 비활성화 */
.pageBtn:disabled {
  /* 투명도 */
  opacity: 0.5;

  /* 클릭 불가 커서 */
  cursor: not-allowed;
}

/* 페이지 정보 */
.pageInfo {
  /* 글자 크기 */
  font-size: 14px;

  /* 글자색 */
  color: #333;
}
</style>
