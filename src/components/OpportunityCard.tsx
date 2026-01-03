import React from 'react'
import { Opportunity } from '../lib/api'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function OpportunityCard({ item }: { item: Opportunity }) {
  const dateLine = item.startDate ? (item.endDate ? `${item.startDate} — ${item.endDate}` : item.startDate) : 'TBA'
  return (
    <article className="border rounded-md bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <Link to={`/opportunities/${item.id}`} className="text-lg font-medium text-slate-800 hover:underline">
            {item.title}
          </Link>
          <div className="text-sm text-slate-500">{item.provider} • {dateLine} • {item.location?.country ?? ''}</div>
        </div>
        <div className="text-right">
          {item.verified === true && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Verified</span>}
          {item.verified === 'pending' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Pending</span>}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{item.description}</p>
      <div className="mt-3 flex gap-2">
        {item.tags?.slice(0, 3).map((t) => (
          <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{t}</span>
        ))}
      </div>
    </article>
  )
}
