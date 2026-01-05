import React, { useState } from 'react'
import { submitOpportunity, Opportunity } from '../lib/api'
import Input from '../components/ui/Input'

export default function Submit() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState<Opportunity['type']>('HACKATHON')
  const [provider, setProvider] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (!title || !provider || !url || !startDate || !endDate) {
        setError('Please fill required fields (Title, Provider, URL, and Dates)')
        setSubmitting(false)
        return
      }
      const payload = { title, type, provider, startDate: startDate || undefined, endDate: endDate || undefined, url, description }
      const res = await submitOpportunity(payload)
      setSuccess(res.id)
      setTitle('')
      setProvider('')
      setUrl('')
      setDescription('')
    } catch (err: any) {
      setError(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Submit an Opportunity</h1>
      <form role="form" onSubmit={onSubmit} className="bg-white p-6 rounded-md border space-y-4">
        {success && <div className="text-sm text-emerald-700">Submitted successfully (id: {success})</div>}
        {error && <div role="alert" className="text-sm text-rose-700">{error}</div>}

        <label className="block text-sm">Title *</label>
        <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

        <label className="block text-sm">Type</label>
        <select value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as any)} className="w-full border rounded px-2 py-1 text-sm">
          <option value="HACKATHON">Hackathon</option>
          <option value="CERTIFICATION">Certification</option>
          <option value="PROMO">Promo</option>
        </select>

        <label className="block text-sm">Provider *</label>
        <Input value={provider} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProvider(e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Start date</label>
            <Input type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">End date</label>
            <Input type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} />
          </div>
        </div>

        <label className="block text-sm">URL *</label>
        <Input value={url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)} />

        <label className="block text-sm">Description</label>
        <textarea value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />

        <div className="flex items-center justify-between">
          <button type="submit" disabled={submitting} className="bg-sky-600 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </form>
    </div>
  )
}
