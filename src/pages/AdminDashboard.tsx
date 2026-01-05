import React, { useEffect, useState } from 'react'
import { AnalyticsStats, getStats } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
    const { user, token } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState<AnalyticsStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user || !token) {
            navigate('/login')
            return
        }

        getStats(token)
            .then(setStats)
            .catch(err => setError(err.message || 'Failed to load stats'))
            .finally(() => setLoading(false))
    }, [user, token, navigate])

    if (loading) return <div className="text-center py-10">Loading dashboard...</div>
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>
    if (!stats) return null

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow border text-center">
                    <div className="text-gray-500 mb-2">Total Opportunities</div>
                    <div className="text-4xl font-bold text-sky-600">{stats.totalOpportunities}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border text-center">
                    <div className="text-gray-500 mb-2">Active Opportunities</div>
                    <div className="text-4xl font-bold text-emerald-600">{stats.totalActiveOpportunities}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border text-center">
                    <div className="text-gray-500 mb-2">Types Count</div>
                    <div className="text-4xl font-bold text-purple-600">{Object.keys(stats.opportunitiesByType).length}</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-xl font-semibold mb-6">Opportunities by Type</h2>
                <div className="space-y-4">
                    {Object.entries(stats.opportunitiesByType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between border-b pb-2">
                            <span className="font-medium text-gray-700">{type}</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
