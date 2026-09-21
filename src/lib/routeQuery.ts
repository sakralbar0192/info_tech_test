export function readQueryString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function readQueryInt(value: unknown): number | undefined {
  const raw = readQueryString(value).trim()
  if (!raw) {
    return undefined
  }
  const parsed = Number(raw)
  return Number.isInteger(parsed) ? parsed : undefined
}

export function readRouteId(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)
  return Number.isInteger(parsed) ? parsed : undefined
}
