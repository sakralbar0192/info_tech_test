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
