import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createBook } from '@/api/books'
import type { AuthorShort } from '@/api/types'
import { apiMessage } from '@/lib/apiMessage'
import { useSubscriptions } from './useSubscriptions'

export function useBookCreate() {
  const router = useRouter()

  const { sendMessageToSubscribers } = useSubscriptions()

  const title = ref('')
  const year = ref<number | null>(null)
  const description = ref('')
  const isbn = ref('')
  const selectedAuthors = ref<AuthorShort[]>([])
  const cover = ref<File | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})

  function setCover(file: File | null): void {
    cover.value = file
  }

  function fieldError(field: string): string | undefined {
    return fieldErrors.value[field]
  }

  async function submit(): Promise<void> {
    if (!title.value) {
      fieldErrors.value = { title: 'Введите название книги' }
      error.value = null
      return
    }

    if (!year.value) {
      fieldErrors.value = { year: 'Выберите год' }
      error.value = null
      return
    }

    if (!isbn.value) {
      fieldErrors.value = { isbn: 'Введите isbn' }
      error.value = null
      return
    }

    if (!selectedAuthors.value.length) {
      fieldErrors.value = { author_ids: 'Выберите автора или авторов' }
      error.value = null
      return
    }

    if (!cover.value) {
      fieldErrors.value = { cover: 'Загрузите обложку' }
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    fieldErrors.value = {}

    const authorIds = selectedAuthors.value.map((author) => author.id)

    try {
      const book = await createBook({
        title: title.value,
        year: year.value ?? Number.NaN,
        description: description.value || undefined,
        isbn: isbn.value || undefined,
        author_ids: authorIds,
        cover: cover.value,
      })

      sendMessageToSubscribers(authorIds, title.value)

      await router.push({ name: 'book', params: { id: String(book.id) } })
    } catch (cause) {
      error.value = apiMessage(cause, 'Не удалось создать книгу')
    } finally {
      loading.value = false
    }
  }

  return {
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
  }
}
