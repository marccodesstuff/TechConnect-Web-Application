import React from 'react'

export default function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / 10))
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-3 py-1 border rounded">Prev</button>
      <span className="text-sm">Page {page} of {pages}</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
    </div>
  )
}
