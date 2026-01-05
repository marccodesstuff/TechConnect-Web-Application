import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import OpportunitiesList from './pages/OpportunitiesList'
import OpportunityDetail from './pages/OpportunityDetail'
import Submit from './pages/Submit'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Forum from './pages/Forum'
import ThreadDetail from './pages/ThreadDetail'

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme() // Use theme

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg">TechConnect</Link>
          <nav className="flex gap-3 items-center">
            <Link to="/opportunities" className="text-sm text-slate-700 dark:text-slate-300">Opportunities</Link>
            <Link to="/forum" className="text-sm text-slate-700 dark:text-slate-300 font-medium text-sky-600 dark:text-sky-400">Forums</Link>
            {user && <Link to="/submit" className="text-sm text-slate-700 dark:text-slate-300">Submit</Link>}
            {user?.role === 'ADMIN' && <Link to="/admin" className="text-sm text-slate-700 dark:text-slate-300">Admin</Link>}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <span className="text-sm text-slate-500 dark:text-slate-400">Hi, {user.username}</span>
                <button onClick={logout} className="text-sm text-red-600 hover:text-red-500 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-slate-700 dark:text-slate-300">Login</Link>
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
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<OpportunitiesList />} />
              <Route path="/opportunities" element={<OpportunitiesList />} />
              <Route path="/opportunities/:id" element={<OpportunityDetail />} />
              <Route path="/submit" element={<Submit />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/thread/:id" element={<ThreadDetail />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
