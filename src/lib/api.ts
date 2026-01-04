export interface BackendResponse<T> {
  status: number;
  message: string;
  data: T;
}

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export type Opportunity = {
  id: number | string
  title: string
  type: 'HACKATHON' | 'CERTIFICATION' | 'PROMO' | 'event' | 'certification' | 'promo'
  description?: string
  startDate?: string
  endDate?: string
  // Fields for MSW/Legacy compatibility
  provider?: string
  location?: { city?: string; country?: string }
  cost?: number | 'free'
  url?: string
  tags?: string[]
  source?: string
  verified?: boolean | 'pending'
  fetchedAt?: string
}

export type PagedResponse<T> = { items: T[]; page: number; total: number }

export async function getOpportunities(query = ''): Promise<PagedResponse<Opportunity>> {
  const params = query ? `?${query}` : ''
  const response = await fetchJSON<BackendResponse<Opportunity[]> | PagedResponse<Opportunity>>(`/api/opportunities${params}`)

  // Handle backend wrapper if present
  if ('data' in response && Array.isArray(response.data)) {
    return {
      items: response.data,
      page: 1,
      total: response.data.length
    }
  }

  // Handle MSW/Legacy direct response
  return response as PagedResponse<Opportunity>
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  const response = await fetchJSON<BackendResponse<Opportunity> | Opportunity>(`/api/opportunities/${id}`)
  if ('data' in response && !Array.isArray(response.data)) {
    return response.data as Opportunity
  }
  return response as Opportunity
}

export async function submitOpportunity(payload: Partial<Opportunity>) {
  // Map types for backend
  let mappedType = payload.type;
  if (mappedType === 'event') mappedType = 'HACKATHON';
  if (mappedType === 'certification') mappedType = 'CERTIFICATION';

  // Filter for backend-only fields
  const backendPayload = {
    title: payload.title,
    description: payload.description,
    startDate: payload.startDate,
    endDate: payload.endDate,
    type: mappedType
  };

  const response = await fetchJSON<BackendResponse<{ id: string | number }> | { id: string | number }>('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(backendPayload),
    headers: { 'Content-Type': 'application/json' }
  })

  if ('data' in response && response.data) {
    return { id: String(response.data.id) };
  }
  return { id: String((response as any).id) };
}
