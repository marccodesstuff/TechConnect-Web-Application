import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import OpportunitiesList from './pages/OpportunitiesList'
import OpportunityDetail from './pages/OpportunityDetail'
import Submit from './pages/Submit'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="font-bold text-lg">TechConnect</Link>
            <nav className="flex gap-3">
              <Link to="/opportunities" className="text-sm text-slate-700">Opportunities</Link>
              <Link to="/submit" className="text-sm text-slate-700">Submit</Link>
              <a href="#" className="text-sm text-slate-700">Admin</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<OpportunitiesList />} />
            <Route path="/opportunities" element={<OpportunitiesList />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
