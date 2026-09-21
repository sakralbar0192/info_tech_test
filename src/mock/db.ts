import type { Book, BookListQuery } from '@/api/types'
import { seedCatalog, type CatalogState, type SeededBook } from './seed'


function loadCatalog(): CatalogState {
  return structuredClone(seedCatalog)
}

function matchesQuery(book: SeededBook, query: BookListQuery): boolean {
  if (
    (query.author_id && !book.author_ids.includes(query.author_id))
    || (query.year && book.year !== query.year)
  ) return false

  if (query.search) {
    const needle = query.search.trim().toLocaleLowerCase()
    if (!needle) return true
    if (!book.title.includes(needle)) return false
  }

  return true
}

function toBook(book: SeededBook, catalog: CatalogState): Book {
  return {
    id: book.id,
    title: book.title,
    year: book.year,
    description: book.description,
    isbn: book.isbn,
    cover_url: book.cover_url,
    authors: book.author_ids.flatMap((authorId) => {
      const author = catalog.authors.find((item) => item.id === authorId)
      return author ? [{ id: author.id, full_name: author.full_name }] : []
    }),
  }
}

export function listCatalogBooks(query: BookListQuery = {}): Book[] {
  const catalog = loadCatalog()

  const page = query.page && query.page >= 1 ? query.page : 1
  const perPage = query['per-page'] && query['per-page'] >= 1 ? query['per-page'] : 20
  const filtered = catalog.books.filter((book) => matchesQuery(book, query))

  const start = (page - 1) * perPage
  const items = filtered.slice(start, start + perPage).map((book) => toBook(book, catalog))

  return items
}

