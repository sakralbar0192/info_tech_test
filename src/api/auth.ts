import { request } from './http'
import type { LoginData, LoginRequest } from './types'

export function login(body: LoginRequest): Promise<LoginData> {
  return request<LoginData>({
    method: 'POST',
    path: '/auth/login',
    json: body,
  })
}
