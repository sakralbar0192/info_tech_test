<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NEmpty, NInput, NPagination, NResult, NSpin } from 'naive-ui'
import AuthorPicker from '@/components/AuthorPicker.vue'
import YearPicker from '@/components/YearPicker.vue'
import { useBookList } from '@/composables/useBookList'

const {
  books,
  loading,
  error,
  pagination,
  page,
  setPage,
  search,
  year,
  selectedAuthors,
  setSearch,
  setYear,
  setSelectedAuthors,
} = useBookList()

const showPagination = computed(() => (pagination.value?.total_pages ?? 0) > 1)
</script>

<template>
  <div class="filters">
    <n-input
      class="filters__search"
      :value="search"
      placeholder="Название"
      clearable
      @update:value="setSearch"
    />
    <YearPicker
      class="filters__year"
      :model-value="year ?? null"
      clearable
      placeholder="Год"
      @update:model-value="setYear"
    />
    <AuthorPicker
      class="filters__author"
      :model-value="selectedAuthors"
      placeholder="Автор"
      @update:model-value="setSelectedAuthors"
    />
  </div>
  <n-spin :show="loading">
    <n-result
      v-if="error"
      status="error"
      title="Не удалось загрузить книги"
      :description="error"
    />
    <n-empty
      v-else-if="!loading && books.length === 0"
      description="Книг нет"
    />
    <div v-else class="grid">
      <router-link
        v-for="book in books"
        :key="book.id"
        :to="{ name: 'book', params: { id: String(book.id) } }"
      >
        <n-card :title="book.title">
          <template #cover>
            <img
              v-if="book.cover_url"
              class="cover"
              :src="book.cover_url"
              :alt="book.title"
            >
          </template>
          {{ book.year }}
        </n-card>
      </router-link>
    </div>
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

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.cover {
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.pager {
  display: flex;
  justify-content: center;
  padding: 0 16px 16px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 16px 0;

  &__search {
    width: 260px;
  }

  &__year {
    width: 120px;
  }

  &__author {
    width: 260px;
  }
}
</style>
