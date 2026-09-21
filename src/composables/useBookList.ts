import { computed, ref, watch } from 'vue'
import { listBooks } from '@/api/books'
import type { Book, Pagination } from '@/api/types'
import { ApiError } from '@/api/errors'
import { readQueryInt } from '@/lib/routeQuery'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'

const PER_PAGE = 5

export function useBookList() {
  const route = useRoute()
  const router = useRouter()

  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination | null>(null)
  const search = ref()
  const year = ref()
  const authorId = ref()

  const page = computed(() => {
    const value = readQueryInt(route.query.page)
    return value && value >= 1 ? value : 1
  })

  function setPage(nextPage: number): void {
    const query: LocationQueryRaw = {}
    if (nextPage > 1) {
      query.page = String(nextPage)
    }
    router.replace({ query })
  }

  async function load(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const data = await listBooks({
        page: page.value,
        'per-page': PER_PAGE,
        search: search.value,
        year: year.value,
        author_id: authorId.value,
      })
      books.value = data.items
      pagination.value = data.pagination
    } catch (cause) {
      books.value = []
      pagination.value = null
      error.value = cause instanceof ApiError ? cause.message : 'Не удалось загрузить книги'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => [page.value] as const,
    () => {
      load()
    },
    { immediate: true },
  )

  return {
    books,
    loading,
    error,
    search,
    year,
    page,
    pagination,
    setPage
  }
}
