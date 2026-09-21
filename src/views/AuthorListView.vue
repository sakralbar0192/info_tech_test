<script setup lang="ts">
import { computed } from 'vue'
import { NEmpty, NPagination, NResult, NSpin } from 'naive-ui'
import { useAuthorList } from '@/composables/useAuthorList'

const {
  authors,
  pagination,
  loading,
  error,
  page,
  setPage,
} = useAuthorList()

const showPagination = computed(() => (pagination.value?.total_pages ?? 0) > 1)
</script>

<template>
  <n-spin :show="loading">
    <n-result
      v-if="error"
      status="error"
      title="Не удалось загрузить авторов"
      :description="error"
    />
    <n-empty
      v-else-if="!loading && authors.length === 0"
      description="Авторов нет"
    />
    <ul
      v-else
      class="list"
    >
      <li
        v-for="author in authors"
        :key="author.id"
      >
        <router-link :to="{ name: 'author', params: { id: String(author.id) } }">
          {{ author.full_name }}
        </router-link>
      </li>
    </ul>
  </n-spin>
  <div
    v-if="showPagination"
    class="pager"
  >
    <n-pagination
      :page="page"
      :page-count="pagination?.total_pages ?? 1"
      @update:page="setPage"
    />
  </div>
</template>

<style scoped>
.list {
  margin: 0;
  padding: 16px;
  list-style: none;
}

.list li {
  margin: 0 0 8px;
}

.list a {
  color: inherit;
}

.pager {
  display: flex;
  justify-content: center;
  padding: 0 16px 16px;
}
</style>
