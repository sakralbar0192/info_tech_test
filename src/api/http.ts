import { ApiError } from './errors'
import type { ErrorItem } from './types'

export type RequestOptions = {
  path: string
  method: 'GET' | 'POST'
}

const BASE_URL = '/api/v1'

function isApiErrorBody(body: unknown): body is { errors: ErrorItem[] } {
  if (typeof body !== 'object' || body === null || !('errors' in body)) {
    return false
  }
  return Array.isArray((body as { errors: unknown }).errors)
}

async function readError(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json()
    if (isApiErrorBody(body)) return new ApiError(response.status, body.errors)
  } catch {}

  return new ApiError(response.status, [
    { field: '', message: response.statusText || `HTTP ${response.status}` },
  ])
}

async function readResponse(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw await readError(response)
  }

  const payload: unknown = await response.json()
  if (isApiErrorBody(payload) && (payload as { success?: boolean }).success === false) {
    throw new ApiError(response.status, payload.errors)
  }

  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as { data: unknown }).data
  }

  throw new ApiError(response.status, [
    { field: '', message: 'Missing data' },
  ])
}

export async function request<T>(options: RequestOptions): Promise<T> {
  const {method, path} = options
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, { method })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error'
    throw new ApiError(0, [{ field: '', message }])
  }

  return readResponse(response) as T
}
