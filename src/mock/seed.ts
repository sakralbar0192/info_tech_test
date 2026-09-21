import type { AuthorShort, Book } from '@/api/types'

export type SeededBook = Omit<Book, 'authors'> & {
  author_ids: number[]
}

export type CatalogState = {
  books: SeededBook[]
  authors: AuthorShort[]
}

function cover(label: string): string {
  return `https://placehold.co/200x300/png?text=${encodeURIComponent(label)}`
}

export const seedCatalog: CatalogState = {
  authors: [
    { id: 1, full_name: 'Автор 1' },
    { id: 2, full_name: 'Автор 2' },
  ],
  books: [
    {
      id: 1,
      title: 'Заголовок книги 1',
      year: 2007,
      description: 'Описание книги 1',
      isbn: '12345678901',
      cover_url: cover('Обложка книги 1'),
      author_ids: [1],
    },
    {
      id: 2,
      title: 'Заголовок книги 2',
      year: 2007,
      description: 'Описание книги 2',
      isbn: '12345678902',
      cover_url: cover('Обложка книги 2'),
      author_ids: [1],
    },
    {
      id: 3,
      title: 'Заголовок книги 3',
      year: 2007,
      description: 'Описание книги 3',
      isbn: '12345678903',
      cover_url: cover('Обложка книги 3'),
      author_ids: [1],
    },
    {
      id: 4,
      title: 'Заголовок книги 4',
      year: 2007,
      description: 'Описание книги 4',
      isbn: '12345678904',
      cover_url: cover('Обложка книги 4'),
      author_ids: [1],
    },
    {
      id: 5,
      title: 'Заголовок книги 5',
      year: 2007,
      description: 'Описание книги 5',
      isbn: '12345678905',
      cover_url: cover('Обложка книги 5'),
      author_ids: [1],
    },
    {
      id: 6,
      title: 'Заголовок книги 6',
      year: 2017,
      description: 'Описание книги 6',
      isbn: '12345678906',
      cover_url: cover('Обложка книги 6'),
      author_ids: [2],
    },
    {
      id: 7,
      title: 'Заголовок книги 7',
      year: 2017,
      description: 'Описание книги 7',
      isbn: '12345678907',
      cover_url: cover('Обложка книги 7'),
      author_ids: [2],
    },
    {
      id: 8,
      title: 'Заголовок книги 8',
      year: 2023,
      description: 'Описание книги 8',
      isbn: '12345678908',
      cover_url: cover('Обложка книги 8'),
      author_ids: [2],
    },
    {
      id: 9,
      title: 'Заголовок книги 9',
      year: 2023,
      description: 'Описание книги 9',
      isbn: '12345678909',
      cover_url: cover('Обложка книги 9'),
      author_ids: [2],
    },
    {
      id: 10,
      title: 'Заголовок книги 10',
      year: 1992,
      description: 'Описание книги 10',
      isbn: '123456789010',
      cover_url: cover('Обложка книги 10'),
      author_ids: [2],
    },
  ]
}
