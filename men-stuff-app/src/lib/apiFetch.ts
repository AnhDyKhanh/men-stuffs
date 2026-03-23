// lib/apiFetch.ts
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiFetchOptions<T> {
  method?: HttpMethod
  body?: T
}

export async function apiFetch<TBody = unknown>(
  url: string,
  options: ApiFetchOptions<TBody> = {}
) {
  const { method = 'GET', body } = options

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error?.error ?? `Request failed: ${res.status}`)
  }

  return res.json()
}