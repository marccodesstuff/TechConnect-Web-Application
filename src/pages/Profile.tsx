import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
    const { user } = useAuth()

    // In a real app, we would fetch the user's favorites from the backend here.
    // For this MVP, we will show a placeholder.

    if (!user) {
        return <div>Please login to view your profile.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow border mb-6">
                <h2 className="text-xl font-semibold mb-4">Account Details</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
            <div className="bg-slate-100 p-8 rounded-lg text-center text-slate-500">
                <p>You haven't saved any opportunities yet.</p>
                <Link to="/opportunities" className="text-blue-600 hover:underline mt-2 inline-block">Browse Opportunities</Link>
            </div>
        </div>
    )
}
