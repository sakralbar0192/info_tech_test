import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import { listAuthors } from '@/api/authors'
import type { AuthorShort, Pagination } from '@/api/types'
import { apiMessage } from '@/lib/apiMessage'
import { readQueryInt } from '@/lib/routeQuery'

const PER_PAGE = 5

export function useAuthorList() {
  const route = useRoute()
  const router = useRouter()

  const authors = ref<AuthorShort[]>([])
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const page = computed(() => {
    const value = readQueryInt(route.query.page)
    return value && value >= 1 ? value : 1
  })

  let searchDebounce: number | undefined

  function replaceListQuery(next: { page: number }): void {
    const query: LocationQueryRaw = {}
    if (next.page > 1) {
      query.page = String(next.page)
    }
    router.replace({ query })
  }

  function setPage(nextPage: number): void {
    window.clearTimeout(searchDebounce)
    replaceListQuery({page: nextPage })
  }

  async function load(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const data = await listAuthors({
        page: page.value,
        'per-page': PER_PAGE,
      })
      authors.value = data.items
      pagination.value = data.pagination
    } catch (cause) {
      authors.value = []
      pagination.value = null
      error.value = apiMessage(cause, 'Не удалось загрузить авторов')
    } finally {
      loading.value = false
    }
  }

  watch(
    () => page.value,
    load,
    { immediate: true },
  )

  onUnmounted(() => {
    window.clearTimeout(searchDebounce)
  })

  return {
    authors,
    loading,
    error,
    page,
    pagination,
    setPage,
  }
}
