import React, { useEffect, useState, useMemo } from 'react'
import { getOpportunities, Opportunity } from '../lib/api'
import OpportunityCard from '../components/OpportunityCard'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export default function OpportunitiesList() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounced(query, 350)
  const [type, setType] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const [total, setTotal] = React.useState(0)

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (debouncedQuery) q.set('query', debouncedQuery)
    if (type) q.set('type', type)
    q.set('page', String(page))
    q.set('size', '10')
    getOpportunities(q.toString())
      .then((res) => { setItems(res.items); setTotal(res.total) })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [page, debouncedQuery, type])

  const results = useMemo(() => items, [items])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <Filters query={query} setQuery={setQuery} type={type} setType={setType} />
      </aside>

      <section className="md:col-span-3">
        <div className="space-y-4">
          {loading && <div className="text-center py-6">Loading...</div>}
          {!loading && results.length === 0 && <div className="text-center py-6">No results</div>}
          {!loading && results.map((it) => (
            <OpportunityCard key={it.id} item={it} />
          ))}
        </div>
        <div className="mt-6">
          <Pagination page={page} total={total} onPage={(p) => setPage(p)} />
        </div>
      </section>
    </div>
  )
}
