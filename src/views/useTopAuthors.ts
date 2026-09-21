import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { TopAuthor } from '@/api/types'
import { apiMessage } from '@/lib/apiMessage'
import { readQueryInt } from '@/lib/routeQuery'
import { getTopAuthors } from '@/api/reports'

export function useTopAuthors() {
  const route = useRoute()
  const router = useRouter()

  const items = ref<TopAuthor[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const year = computed(() => readQueryInt(route.query.year))

  function setYear(value: number | null): void {
    const query: LocationQueryRaw = {}
    if (value !== null && Number.isInteger(value)) {
      query.year = String(value)
    }
    router.replace({ query })
  }

  async function load(): Promise<void> {
    if (!year.value) {
      items.value = []
      error.value = null
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await getTopAuthors(year.value)
      items.value = data.items
    } catch (cause) {
      items.value = []
      error.value = apiMessage(cause, 'Не удалось загрузить отчёт')
    } finally {
      loading.value = false
    }
  }

  watch(
    year,
    load,
    { immediate: true },
  )

  return {
    items,
    loading,
    error,
    year,
    setYear,
  }
}
