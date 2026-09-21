import type { AuthorListQuery, BookListQuery } from '@/api/types'
import { http, HttpResponse } from 'msw'
import { listCatalogAuthors, listCatalogBooks } from './db'

const API = '/api/v1'

function ok<T>(data: T, status = 200) {
  return HttpResponse.json({ success: true, data }, { status })
}

function readInt(raw: string | null): number | undefined {
  if (raw == null || raw === '') {
    return undefined
  }
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

function bookQueryFromUrl(url: URL): BookListQuery {
  return {
    page: readInt(url.searchParams.get('page')),
    'per-page': readInt(url.searchParams.get('per-page')),
    author_id: readInt(url.searchParams.get('author_id')),
    year: readInt(url.searchParams.get('year')),
    search: url.searchParams.get('search') ?? undefined,
  }
}

function authorQueryFromUrl(url: URL): AuthorListQuery {
  return {
    page: readInt(url.searchParams.get('page')),
    'per-page': readInt(url.searchParams.get('per-page')),
    search: url.searchParams.get('search') ?? undefined,
  }
}

export const handlers = [
  http.get(`${API}/books`, ({ request }) => {
    const query = bookQueryFromUrl(new URL(request.url))
    return ok(listCatalogBooks(query))
  }),
  http.get(`${API}/authors`, ({ request }) => {
    const query = authorQueryFromUrl(new URL(request.url))
    return ok(listCatalogAuthors(query))
  }),
]
