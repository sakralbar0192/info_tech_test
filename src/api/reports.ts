import { request } from './http'
import type { TopAuthorsReport } from './types'

export function getTopAuthors(year: number): Promise<TopAuthorsReport> {
  return request<TopAuthorsReport>({
    method: 'GET',
    path: '/reports/top-authors',
    query: { year },
  })
}
