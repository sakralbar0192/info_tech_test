import type { Author, AuthorListQuery, AuthorShort, Book, BookListQuery, Paginated } from '@/api/types'
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

export function listCatalogBooks(query: BookListQuery = {}): Paginated<Book> {
  const catalog = loadCatalog()

  const page = query.page && query.page >= 1 ? query.page : 1
  const perPage = query['per-page'] && query['per-page'] >= 1 ? query['per-page'] : 20
  const filtered = catalog.books.filter((book) => matchesQuery(book, query))
  const total = filtered.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const items = filtered.slice(start, start + perPage).map((book) => toBook(book, catalog))

  return {
    items,
    pagination: {
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    },
  }
}

export function listCatalogAuthors(query: AuthorListQuery = {}): Paginated<AuthorShort> {
  const catalog = loadCatalog()

  const page = query.page && query.page >= 1 ? query.page : 1
  const perPage = query['per-page'] && query['per-page'] >= 1 ? query['per-page'] : 20
  const needle = query.search?.trim().toLocaleLowerCase() ?? ''
  const filtered = needle
    ? catalog.authors.filter((author) => author.full_name.toLocaleLowerCase().includes(needle))
    : catalog.authors
  const total = filtered.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const items = filtered.slice(start, start + perPage)

  return {
    items,
    pagination: {
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
    },
  }
}

export function getCatalogBook(id: number): Book | null {
  const catalog = loadCatalog()
  const book = catalog.books.find((item) => item.id === id)
  return book ? toBook(book, catalog) : null
}

export function getCatalogAuthor(id: number): Author | null {
  const catalog = loadCatalog()
  const author = catalog.authors.find((item) => item.id === id)
  if (!author) {
    return null
  }
  const books = catalog.books
    .filter((book) => book.author_ids.includes(id))
    .map((book) => ({ id: book.id, title: book.title, year: book.year }))
  return {
    id: author.id,
    full_name: author.full_name,
    books,
  }
}
