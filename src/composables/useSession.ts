import { computed, ref } from 'vue'
import { setAuthToken } from '@/api/http'
import type { LoginRequest } from '@/api/types'
import { login } from '@/api/auth'

type SessionSnapshot = {
  token: string
  role: string
  username: string
}

const session = ref<SessionSnapshot | null>(null)
setAuthToken(session.value?.token ?? null)

export function isSignedIn(): boolean {
  return session.value !== null
}

export function useSession() {
  const username = computed(() => session.value?.username ?? null)

  async function signIn(body: LoginRequest): Promise<void> {
    const data = await login(body)
    setAuthToken(data.token)
    session.value = {
      token: data.token,
      role: data.user.role,
      username: data.user.username,
    }
  }

  function signOut(): void {
    setAuthToken(null)
    session.value = null
  }

  return { username, signIn, signOut }
}
