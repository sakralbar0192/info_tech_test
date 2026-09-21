import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ApiError } from '@/api/errors'
import type { Book } from '@/api/types'
import { readRouteId } from '@/lib/routeQuery'
import { getBook } from '@/api/books'
import { apiMessage } from '@/lib/apiMessage'

export function useBook() {
  const route = useRoute()

  const book = ref<Book | null>(null)
  const loading = ref(false)
  const notFound = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    const id = readRouteId(route.params.id)
    loading.value = true
    notFound.value = false
    error.value = null
    book.value = null

    if (!id) {
      notFound.value = true
      loading.value = false
      return
    }

    try {
      book.value = await getBook(id)
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 404) {
        notFound.value = true
      } else {
        error.value = apiMessage(cause, 'Не удалось загрузить книгу')
      }
    } finally {
      loading.value = false
    }
  }

  watch(
    () => route.params.id,
    load,
    { immediate: true },
  )

  return {
    book,
    loading,
    notFound,
    error,
  }
}
