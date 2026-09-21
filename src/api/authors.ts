import { request } from './http'
import type { AuthorListQuery, AuthorShort } from './types'

export function listAuthors(
  query: AuthorListQuery = {},
): Promise<AuthorShort[]> {
  return request<AuthorShort[]>({
    method: 'GET',
    path: '/authors',
    query,
  })
}
