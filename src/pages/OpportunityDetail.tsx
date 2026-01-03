import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOpportunity, Opportunity } from '../lib/api'

export default function OpportunityDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getOpportunity(id)
      .then((res) => setItem(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!item) return <div>Not found</div>

  return (
    <article className="bg-white rounded-md border p-6">
      <h1 className="text-2xl font-semibold">{item.title}</h1>
      <div className="text-sm text-slate-500 mt-2">{item.provider} • {item.startDate ?? 'TBA'}</div>
      <div className="mt-4 text-slate-700">{item.description}</div>
      <div className="mt-4">
        <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-600 underline">Open provider page</a>
      </div>
    </article>
  )
}
