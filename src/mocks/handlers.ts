import { rest } from 'msw'
import { sampleOpportunities } from './data'

export const handlers = [
  rest.get('/api/opportunities', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page') || '1')
    const size = Number(req.url.searchParams.get('size') || '10')
    const query = req.url.searchParams.get('query') || ''
    let items = sampleOpportunities
    if (query) {
      items = items.filter((it) => it.title.toLowerCase().includes(query.toLowerCase()) || (it.tags || []).some((t) => t.includes(query)))
    }
    const start = (page - 1) * size
    const pageItems = items.slice(start, start + size)
    return res(ctx.status(200), ctx.json({ items: pageItems, page, total: items.length }))
  }),

  rest.get('/api/opportunities/:id', (req, res, ctx) => {
    const { id } = req.params as { id: string }
    const found = sampleOpportunities.find((it) => it.id === id)
    if (!found) return res(ctx.status(404), ctx.json({ message: 'Not found' }))
    return res(ctx.status(200), ctx.json(found))
  }),

  rest.post('/api/opportunities', async (req, res, ctx) => {
    const body = await req.json()
    const id = String(Date.now())
    const created = { ...body, id, verified: 'pending', fetchedAt: new Date().toISOString() }
    sampleOpportunities.unshift(created)
    return res(ctx.status(201), ctx.json({ id }))
  }),

  // Admin endpoints
  rest.get('/api/admin/opportunities', (req, res, ctx) => {
    const status = req.url.searchParams.get('status') || 'pending'
    const items = sampleOpportunities.filter((it) => it.verified === 'pending')
    return res(ctx.status(200), ctx.json({ items }))
  }),

  rest.post('/api/admin/opportunities/:id/verify', async (req, res, ctx) => {
    const { id } = req.params as { id: string }
    const body = await req.json()
    const action = body.action as 'approve' | 'deny'
    const idx = sampleOpportunities.findIndex((it) => it.id === id)
    if (idx === -1) return res(ctx.status(404), ctx.json({ message: 'Not found' }))
    if (action === 'approve') sampleOpportunities[idx].verified = true
    if (action === 'deny') sampleOpportunities.splice(idx, 1)
    return res(ctx.status(200), ctx.json({ status: action }))
  })
]
