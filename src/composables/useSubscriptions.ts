import { sendPilotSms } from '@/sms/smspilot'

const STORAGE_KEY = 'book-catalog:subscriptions'

type SubscriptionsData = Record<number, string[]>

function load(): SubscriptionsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) as SubscriptionsData
  } catch {
    return {}
  }
}

function save(data: SubscriptionsData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}


export function useSubscriptions() {
  function subscribe(authorId: number, phoneValue: string): void {
    const current = load()
    const next = {
      ...current,
      [authorId]: current?.[authorId]?.includes(phoneValue)
        ? current[authorId]
        : [...(current?.[authorId] || []), phoneValue],
    }
    save(next)
  }

  function getAuthorSubscribers(authorId: number): string[] {
    const current = load()
    return current?.[authorId] || []
  }

  async function sendMessageToSubscribers(authorIds: number[], bookTitle: string): Promise<void> {
    authorIds.forEach(async authorId => {
      const authorSubscribers = getAuthorSubscribers(authorId)

      if (authorSubscribers.length) {
        const sms = await sendPilotSms({
          to: authorSubscribers,
          text: `Новая книга: ${bookTitle}`,
        })

        console.log(sms)
      }
    })
  }

  return { subscribe, sendMessageToSubscribers }
}
