<script setup lang="ts">
import { useAuthor } from '@/composables/useAuthor';
import {  NResult, NSpin } from 'naive-ui'

const {
  author,
  loading,
  notFound,
  error,
} = useAuthor()

</script>

<template>
  <n-spin :show="loading">
    <n-result
      v-if="notFound"
      status="404"
      title="Автор не найден"
    />
    <n-result
      v-else-if="error"
      status="error"
      title="Не удалось загрузить автора"
      :description="error"
    />
    <article
      v-else-if="author"
      class="author"
    >
      <h1 class="title">{{ author.full_name }}</h1>
      <ul class="books">
        <li
          v-for="book in author.books"
          :key="book.id"
        >
          <router-link :to="{ name: 'book', params: { id: String(book.id) } }">
            {{ book.title }}
          </router-link>
          &nbsp;
          <span>{{ book.year }}</span>
        </li>
      </ul>
    </article>
  </n-spin>
  <router-view />
</template>

<style scoped>
.author {
  padding: 16px;
}

.title {
  margin: 0 0 16px;
  font-size: 1.5rem;
}

.books {
  margin: 0;
  padding: 0;
  list-style: none;
}

.books a {
  color: inherit;
}
</style>
