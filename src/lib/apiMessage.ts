import { ApiError } from '@/api/errors'

export function apiMessage(cause: unknown, fallback: string): string {
  return cause instanceof ApiError ? cause.message : fallback
}
