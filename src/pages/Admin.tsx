import React, { useEffect, useState } from 'react'
import { Opportunity } from '../lib/api'

export default function Admin() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/opportunities?status=pending')
      .then((r) => r.json())
      .then((data) => setItems(data.items))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  async function verify(id: string, action: 'approve' | 'deny') {
    await fetch(`/api/admin/opportunities/${id}/verify`, { method: 'POST', body: JSON.stringify({ action }), headers: { 'Content-Type': 'application/json' } })
    setItems((s) => s.filter((it) => it.id !== id))
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin — Pending Verifications</h1>
      <div className="space-y-3">
        {items.length === 0 && <div>No pending items</div>}
        {items.map((it) => (
          <div key={it.id} className="bg-white p-4 rounded-md border flex justify-between items-start">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-slate-500">{it.provider} • {it.type}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => verify(it.id, 'deny')} className="px-3 py-1 border rounded">Deny</button>
              <button onClick={() => verify(it.id, 'approve')} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
