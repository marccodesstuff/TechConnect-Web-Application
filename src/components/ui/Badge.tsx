import React from 'react'

export default function Badge({ children }: { children: React.ReactNode }) {
  return <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{children}</span>
}
