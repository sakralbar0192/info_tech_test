import type { ErrorItem } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly errors: ErrorItem[]

  constructor(status: number, errors: ErrorItem[], message?: string) {
    super(message ?? errors[0]?.message ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}
