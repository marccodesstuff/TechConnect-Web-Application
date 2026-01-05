import React from 'react'
import Input from './ui/Input'

export default function Filters({ query, setQuery, type, setType, tag, setTag }: {
  query: string;
  setQuery: (s: string) => void;
  type?: string;
  setType?: (t?: string) => void;
  tag?: string;
  setTag?: (t: string) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-md border">
      <h3 className="font-semibold mb-2">Filters</h3>
      <label className="block text-sm mb-2">Search</label>
      <Input value={query} onChange={(e) => setQuery((e.target as HTMLInputElement).value)} placeholder="Search by title..." />

      <label className="block text-sm mt-3 mb-2">Tag</label>
      <Input value={tag || ''} onChange={(e) => setTag && setTag((e.target as HTMLInputElement).value)} placeholder="Filter by tag..." />

      <label className="block text-sm mt-3 mb-2">Type</label>
      <select value={type ?? ''} onChange={(e) => setType && setType(e.target.value || undefined)} className="w-full border rounded px-2 py-1 text-sm">
        <option value="">All</option>
        <option value="HACKATHON">Hackathon</option>
        <option value="CERTIFICATION">Certification</option>
        <option value="PROMO">Promo</option>
      </select>
    </div>
  )
}
