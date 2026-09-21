const EMULATOR_KEY = 'XXXXXXXXXXXXYYYYYYYYYYYYZZZZZZZZXXXXXXXXXXXXYYYYYYYYYYYYZZZZZZZZ'
const API_URL = 'https://smspilot.ru/api.php'

export type SmsSendResult =  { ok: true }  | { ok: false; message: string }

function hasSend(body: unknown): boolean {
  return typeof body === 'object'
    && body !== null
    && 'send' in body
    && Array.isArray((body as { send: unknown }).send)
}

export async function sendPilotSms(options: { to: string[]; text: string }): Promise<SmsSendResult> {
  const params = new URLSearchParams({
    send: options.text,
    to: options.to.join(','),
    apikey: import.meta.env.VITE_SMSPILOT_APIKEY || EMULATOR_KEY,
    format: 'json',
  })

  try {
    const response = await fetch(`${API_URL}?${params}`, {
      signal: AbortSignal.timeout(5000),
    })
    const body: unknown = await response.json()
    if (hasSend(body)) {
      return { ok: true }
    }
    return { ok: false, message: 'SMS (эмулятор)' }
  } catch {
    return { ok: false, message: 'SMS (эмулятор)' }
  }
}
