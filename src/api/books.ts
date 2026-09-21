import { request } from './http'
import type { Book, BookListQuery } from './types'


export async function listBooks(query: BookListQuery = {}): Promise<Book[]> {
  const data = await request<Book[]>({
    method: 'GET',
    path: '/books',
    query,
  })
  return data
}
