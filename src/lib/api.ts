export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export type Opportunity = {
  id: string
  title: string
  type: 'event' | 'certification'
  provider: string
  startDate?: string
  endDate?: string
  location?: { city?: string; country?: string }
  cost?: number | 'free'
  url: string
  description?: string
  tags?: string[]
  source?: string
  verified?: boolean | 'pending'
  fetchedAt?: string
}

export type PagedResponse<T> = { items: T[]; page: number; total: number }

export async function getOpportunities(query = ''): Promise<PagedResponse<Opportunity>> {
  const params = query ? `?${query}` : ''
  return fetchJSON<PagedResponse<Opportunity>>(`/api/opportunities${params}`)
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  return fetchJSON<Opportunity>(`/api/opportunities/${id}`)
}

export async function submitOpportunity(payload: Partial<Opportunity>) {
  return fetchJSON<{ id: string }>('/api/opportunities', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
}
