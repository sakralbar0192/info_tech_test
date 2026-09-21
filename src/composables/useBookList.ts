import {  onMounted, ref } from 'vue'
import { listBooks } from '@/api/books'
import type { Book, } from '@/api/types'
import { ApiError } from '@/api/errors'

const PER_PAGE = 20

export function useBookList() {
  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const data = await listBooks({
        page: 1,
        'per-page': PER_PAGE,
      })
      books.value = data
    } catch (cause) {
      books.value = []
      error.value = cause instanceof ApiError ? cause.message : 'Не удалось загрузить книги'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return {
    books,
    loading,
    error,
  }
}
