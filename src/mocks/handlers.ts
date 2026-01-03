import { http, HttpResponse } from 'msw'
import { sampleOpportunities } from './data'

export const handlers = [
  http.get('/api/opportunities', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const size = Number(url.searchParams.get('size') || '10')
    const query = url.searchParams.get('query') || ''
    let items = sampleOpportunities
    if (query) {
      items = items.filter((it) => it.title.toLowerCase().includes(query.toLowerCase()) || (it.tags || []).some((t) => t.includes(query)))
    }
    const start = (page - 1) * size
    const pageItems = items.slice(start, start + size)
    return HttpResponse.json({ items: pageItems, page, total: items.length })
  }),

  http.get('/api/opportunities/:id', ({ params }) => {
    const { id } = params as { id: string }
    const found = sampleOpportunities.find((it) => it.id === id)
    if (!found) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(found)
  }),

  http.post('/api/opportunities', async ({ request }) => {
    const body = await request.json() as any
    const id = String(Date.now())
    const created = { ...body, id, verified: 'pending', fetchedAt: new Date().toISOString() }
    sampleOpportunities.unshift(created)
    return HttpResponse.json({ id }, { status: 201 })
  }),

  // Admin endpoints
  http.get('/api/admin/opportunities', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    const items = sampleOpportunities.filter((it) => it.verified === 'pending')
    return HttpResponse.json({ items })
  }),

  http.post('/api/admin/opportunities/:id/verify', async ({ params, request }) => {
    const { id } = params as { id: string }
    const body = await request.json() as any
    const action = body.action as 'approve' | 'deny'
    const idx = sampleOpportunities.findIndex((it) => it.id === id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    if (action === 'approve') sampleOpportunities[idx].verified = true
    if (action === 'deny') sampleOpportunities.splice(idx, 1)
    return HttpResponse.json({ status: action })
  })
]
