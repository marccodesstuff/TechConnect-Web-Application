import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import OpportunitiesList from './pages/OpportunitiesList'
import OpportunityDetail from './pages/OpportunityDetail'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { AuthProvider, useAuth } from './context/AuthContext'

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">TechConnect</Link>
          <nav className="flex gap-3 items-center">
            <Link to="/opportunities" className="text-sm text-slate-700">Opportunities</Link>
            {user && <Link to="/submit" className="text-sm text-slate-700">Submit</Link>}
            {user?.role === 'ADMIN' && <Link to="/admin" className="text-sm text-slate-700">Admin</Link>}
            {user ? (
              <>
                <span className="text-sm text-slate-500">Hi, {user.username}</span>
                <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-700">Login</Link>
                <Link to="/register" className="text-sm px-3 py-1 bg-blue-600 text-white rounded">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<OpportunitiesList />} />
            <Route path="/opportunities" element={<OpportunitiesList />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
