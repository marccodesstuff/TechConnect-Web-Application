import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OpportunityCard from '../OpportunityCard'

const sample = {
  id: '1',
  title: 'Test Opportunity',
  type: 'event',
  provider: 'Test',
  startDate: '2026-01-01',
  url: 'https://example.com',
  description: 'Description',
  verified: 'pending'
}

test('renders card', () => {
  render(
    <MemoryRouter>
      <OpportunityCard item={sample as any} />
    </MemoryRouter>
  )
  expect(screen.getByText('Test Opportunity')).toBeInTheDocument()
  expect(screen.getByText('Description')).toBeInTheDocument()
  expect(screen.getByText(/Pending/i)).toBeInTheDocument()
})
