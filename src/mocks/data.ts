import { Opportunity } from '../lib/api'

export const sampleOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Free Cloud Fundamentals Certification (Provider A)',
    type: 'certification',
    provider: 'Provider A',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    location: { country: 'Global' },
    cost: 'free',
    url: 'https://provider-a.example/cert/free-cloud',
    description: 'A free certification on cloud fundamentals offered by Provider A.',
    tags: ['cloud', 'certification'],
    source: 'provider-a',
    verified: true,
    fetchedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Global Hackathon 2026',
    type: 'event',
    provider: 'Global Org',
    startDate: '2026-05-20',
    endDate: '2026-05-22',
    location: { city: 'Online', country: 'Global' },
    cost: 0,
    url: 'https://globalhack.example/events/2026',
    description: 'Join the Global Hackathon with free registration and prizes.',
    tags: ['hackathon', 'online', 'prize'],
    source: 'global-hackathon-feed',
    verified: 'pending',
    fetchedAt: new Date().toISOString()
  }
]
