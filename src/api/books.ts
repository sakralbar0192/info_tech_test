import { request } from './http'
import type { Book, BookListQuery, Paginated } from './types'


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
