<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h1>404</h1>
  <p>Страница не найдена</p>
  <button @click="router.push('/books')">К списку книг</button>
</template>

<style scoped></style>
