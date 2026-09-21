<script setup lang="ts">
import { NResult, NSpin } from 'naive-ui'
import { useBook } from '@/composables/useBook'

const {
  book,
  loading,
  notFound,
  error,
} = useBook()
</script>

<template>
  <n-spin :show="loading">
    <n-result
      v-if="notFound"
      status="404"
      title="Книга не найдена"
    />
    <n-result
      v-else-if="error"
      status="error"
      title="Не удалось загрузить книгу"
      :description="error"
    />
    <article
      v-else-if="book"
      class="book"
    >
      <div class="media">
        <img
          class="cover"
          :src="book.cover_url"
          :alt="book.title"
        >
      </div>
      <div class="meta">
        <h1 class="title">{{ book.title }}</h1>
        <p>{{ book.year }}</p>
        <p>{{ book.description }}</p>
        <p>ISBN {{ book.isbn }}</p>
        <p class="authors">
          <router-link
            v-for="author in book.authors"
            :key="author.id"
            class="authors__link"
            :to="{ name: 'author', params: { id: String(author.id) } }"
          >
            {{ author.full_name }}
          </router-link>
        </p>
      </div>
    </article>
  </n-spin>
  <router-view />
</template>

<style scoped>
.book {
  display: grid;
  grid-template-columns: minmax(160px, 240px) 1fr;
  gap: 24px;
  padding: 16px;
}

.cover {
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}


.title {
  margin: 0 0 12px;
  font-size: 1.5rem;
}

.authors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.authors__link {
  color: inherit;
}
</style>
