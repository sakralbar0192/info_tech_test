<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import AuthorPicker from '@/components/AuthorPicker.vue'
import YearPicker from '@/components/YearPicker.vue'
import { useBookCreate } from '@/composables/useBookCreate'

const {
  title,
  year,
  description,
  isbn,
  selectedAuthors,
  loading,
  error,
  fieldError,
  setCover,
  submit,
} = useBookCreate()

function onCoverChange(event: Event): void {
  const input = event.target as HTMLInputElement
  setCover(input.files?.[0] ?? null)
}
</script>

<template>
  <n-form @submit.prevent="submit" class="form">
    <n-form-item
      label="Название"
      :validation-status="fieldError('title') ? 'error' : undefined"
      :feedback="fieldError('title')"
    >
      <n-input v-model:value="title" />
    </n-form-item>
    <n-form-item
      label="Год"
      :validation-status="fieldError('year') ? 'error' : undefined"
      :feedback="fieldError('year')"
    >
      <YearPicker v-model="year" />
    </n-form-item>
    <n-form-item
      label="Описание"
      :validation-status="fieldError('description') ? 'error' : undefined"
      :feedback="fieldError('description')"
    >
      <n-input
        v-model:value="description"
        type="textarea"
      />
    </n-form-item>
    <n-form-item
      label="ISBN"
      :validation-status="fieldError('isbn') ? 'error' : undefined"
      :feedback="fieldError('isbn')"
    >
      <n-input v-model:value="isbn" />
    </n-form-item>
    <n-form-item
      label="Авторы"
      :validation-status="fieldError('author_ids') ? 'error' : undefined"
      :feedback="fieldError('author_ids')"
    >
      <AuthorPicker
        v-model="selectedAuthors"
        multiple
      />
    </n-form-item>
    <n-form-item
      label="Обложка"
      :validation-status="fieldError('cover') ? 'error' : undefined"
      :feedback="fieldError('cover')"
    >
      <input
        type="file"
        accept="image/*"
        @change="onCoverChange"
      >
    </n-form-item>
    <p
      v-if="error"
      class="error"
    >
      {{ error }}
    </p>
    <n-button
      type="primary"
      attr-type="submit"
      :loading="loading"
    >
      Создать
    </n-button>
  </n-form>
</template>

<style scoped>
.form {
  padding: 16px;
  max-width: 500px;
}

.error {
  margin: 0 0 12px;
  color: #d03050;
}
</style>
