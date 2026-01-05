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
    type: mappedType,
    tags: payload.tags
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

export async function addFavorite(id: string | number, token: string) {
  return fetchJSON(`/api/opportunities/${id}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function removeFavorite(id: string | number, token: string) {
  return fetchJSON(`/api/opportunities/${id}/favorite`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export type AnalyticsStats = {
  totalOpportunities: number
  totalActiveOpportunities: number
  opportunitiesByType: Record<string, number>
}

export async function getStats(token: string): Promise<AnalyticsStats> {
  const response = await fetchJSON<BackendResponse<AnalyticsStats>>('/api/analytics/stats', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export type Notification = {
  id: number
  message: string
  read: boolean
  createdAt: string
}

export async function getNotifications(token: string): Promise<Notification[]> {
  const response = await fetchJSON<BackendResponse<Notification[]>>('/api/notifications', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export async function markNotificationRead(id: number, token: string) {
  return fetchJSON(`/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// Team Requests
export type TeamRequestResponse = {
  id: number
  opportunityId: number
  username: string
  message: string
  createdAt: string
}

export async function joinTeamLobby(opportunityId: string | number, message: string, token: string) {
  return fetchJSON(`/api/opportunities/${opportunityId}/team-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message })
  })
}

export async function leaveTeamLobby(opportunityId: string | number, token: string) {
  return fetchJSON(`/api/opportunities/${opportunityId}/team-requests`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function getTeamRequests(opportunityId: string | number): Promise<TeamRequestResponse[]> {
  const res = await fetchJSON<BackendResponse<TeamRequestResponse[]>>(`/api/opportunities/${opportunityId}/team-requests`)
  return res.data
}

// Insights
export type InsightRequest = {
  verdict: 'RECOMMENDED' | 'MIXED' | 'NOT_RECOMMENDED'
  comment: string
  tags: string[]
}

export type InsightResponse = {
  id: number
  opportunityId: number
  username: string
  verdict: 'RECOMMENDED' | 'MIXED' | 'NOT_RECOMMENDED'
  comment: string
  tags: string[]
  createdAt: string
}

export async function addInsight(opportunityId: string | number, request: InsightRequest, token: string) {
  return fetchJSON(`/api/opportunities/${opportunityId}/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(request)
  })
}

export async function getInsights(opportunityId: string | number): Promise<InsightResponse[]> {
  const res = await fetchJSON<BackendResponse<InsightResponse[]>>(`/api/opportunities/${opportunityId}/insights`)
  return res.data
}

// Forum
export type ForumCategory = {
  id: number
  name: string
  description: string
  slug: string
}

export type ForumPost = {
  id: number
  content: string
  author: { username: string } // Backend returns User object, simplified here
  createdAt: string
}

export type ForumThread = {
  id: number
  title: string
  content: string
  author: { username: string }
  viewCount: number
  createdAt: string
  updatedAt: string
  posts: ForumPost[]
}

export async function getForumCategories(): Promise<ForumCategory[]> {
  const res = await fetchJSON<BackendResponse<ForumCategory[]>>('/api/forum/categories')
  return res.data
}

export async function getForumThreads(categoryId: number): Promise<ForumThread[]> {
  const res = await fetchJSON<BackendResponse<ForumThread[]>>(`/api/forum/categories/${categoryId}/threads`)
  return res.data
}

export async function createForumThread(categoryId: number, title: string, content: string, token: string) {
  return fetchJSON(`/api/forum/categories/${categoryId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content })
  })
}

export async function getForumThread(id: string | number): Promise<ForumThread> {
  const res = await fetchJSON<BackendResponse<ForumThread>>(`/api/forum/threads/${id}`)
  return res.data
}

export async function createForumPost(threadId: string | number, content: string, token: string) {
  return fetchJSON(`/api/forum/threads/${threadId}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content })
  })
}
