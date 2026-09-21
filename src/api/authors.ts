import { request } from './http'
import type { Author, AuthorListQuery, AuthorShort, Paginated } from './types'

export function listAuthors(
  query: AuthorListQuery = {},
): Promise<Paginated<AuthorShort>> {
  return request<Paginated<AuthorShort>>({
    method: 'GET',
    path: '/authors',
    query,
  })
}

export async function getAuthor(id: number): Promise<Author> {
  const author = await request<Author>({
    method: 'GET',
    path: `/authors/${id}`,
  })
  return author
}
