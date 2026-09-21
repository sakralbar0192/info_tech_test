// Тип ошибки с API
export type ErrorItem = {
  field: string
  message: string
}

// Типы книг

export type Book = {
  id: number
  title: string
  year: number
  description: string
  isbn: string
  cover_url: string
  authors: AuthorShort[]
}

export type BookListQuery = {
  page?: number
  'per-page'?: number
  author_id?: number
  year?: number
  search?: string
}

// Типы авторов

export type AuthorShort = {
  id: number
  full_name: string
}

export type AuthorListQuery = {
  page?: number
  'per-page'?: number
  search?: string
}

// Вспомогательные типы

export type Pagination = {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export type Paginated<T> = {
  items: T[]
  pagination: Pagination
}
