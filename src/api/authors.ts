import { request } from './http'
import type { AuthorListQuery, AuthorShort, Paginated } from './types'

export function listAuthors(
  query: AuthorListQuery = {},
): Promise<Paginated<AuthorShort>> {
  return request<Paginated<AuthorShort>>({
    method: 'GET',
    path: '/authors',
    query,
  })
}
