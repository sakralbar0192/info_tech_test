import { request } from './http'
import type { Book, BookForm, BookListQuery, Paginated } from './types'

function toBookFormData(form: BookForm): FormData {
  const data = new FormData()

  data.append('title', form.title)
  data.append('year', String(form.year))
  data.append('cover', form.cover)

  if (form.description !== undefined) data.append('description', form.description)
  if (form.isbn) data.append('isbn', form.isbn)

  for (const id of form.author_ids) {
    data.append('author_ids[]', String(id))
  }

  return data
}

export async function listBooks(query: BookListQuery = {}): Promise<Paginated<Book>> {
  const data = await request<Paginated<Book>>({
    method: 'GET',
    path: '/books',
    query,
  })
  return data
}

export async function getBook(id: number): Promise<Book> {
  const book = await request<Book>({
    method: 'GET',
    path: `/books/${id}`,
  })
  return book
}

export async function createBook(form: BookForm): Promise<Book> {
  const book = await request<Book>({
    method: 'POST',
    path: '/books',
    form: toBookFormData(form),
  })
  return book
}
