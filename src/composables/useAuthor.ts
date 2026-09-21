import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAuthor } from '@/api/authors'
import { ApiError } from '@/api/errors'
import type { Author } from '@/api/types'
import { apiMessage } from '@/lib/apiMessage'
import { readRouteId } from '@/lib/routeQuery'

export function useAuthor() {
  const route = useRoute()
  const author = ref<Author | null>(null)
  const loading = ref(false)
  const notFound = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    const id = readRouteId(route.params.id)
    loading.value = true
    notFound.value = false
    error.value = null
    author.value = null

    if (!id) {
      notFound.value = true
      loading.value = false
      return
    }

    try {
      author.value = await getAuthor(id)
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 404) {
        notFound.value = true
      } else {
        error.value = apiMessage(cause, 'Не удалось загрузить автора')
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

  return { author, loading, notFound, error}
}
