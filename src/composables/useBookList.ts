import { computed, ref, watch } from 'vue'
import { listBooks } from '@/api/books'
import type { AuthorShort, Book, Pagination } from '@/api/types'
import { ApiError } from '@/api/errors'
import { readQueryInt, readQueryString } from '@/lib/routeQuery'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'

const PER_PAGE = 5

export function useBookList() {
  const route = useRoute()
  const router = useRouter()

  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination | null>(null)
  const search = computed(() => readQueryString(route.query.search))
  const year = computed(() => readQueryInt(route.query.year))
  const authorId = computed(() => readQueryInt(route.query.author_id))
  const selectedAuthors = ref<AuthorShort[]>([])


  const page = computed(() => {
    const value = readQueryInt(route.query.page)
    return value && value >= 1 ? value : 1
  })

  function replaceListQuery(next: {
    search: string
    year: number | undefined
    authorId: number | undefined
    page: number
  }): void {
    const query: LocationQueryRaw = {}
    if (next.search !== '') {
      query.search = next.search
    }
    if (next.year !== undefined) {
      query.year = String(next.year)
    }
    if (next.authorId !== undefined) {
      query.author_id = String(next.authorId)
    }
    if (next.page > 1) {
      query.page = String(next.page)
    }
    router.replace({ query })
  }

  function setSearch(value: string): void {
    replaceListQuery({
      search: value,
      year: year.value,
      authorId: authorId.value,
      page: 1,
    })
  }

  function setYear(value: number | null): void {
    replaceListQuery({
      search: search.value,
      year: value !== null && Number.isInteger(value) ? value : undefined,
      authorId: authorId.value,
      page: 1,
    })
  }

  function setSelectedAuthors(next: AuthorShort[]): void {
    selectedAuthors.value = next
    replaceListQuery({
      search: search.value,
      year: year.value,
      authorId: next[0]?.id,
      page: 1,
    })
  }

  function setPage(nextPage: number): void {
    replaceListQuery({
      search: search.value,
      year: year.value,
      authorId: authorId.value,
      page: nextPage,
    })
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
    () => [search.value, year.value, page.value, authorId.value],
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
    selectedAuthors,
    setPage,
    setSearch,
    setYear,
    setSelectedAuthors,
  }
}
