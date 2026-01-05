import React, { useState } from 'react'
import { Opportunity, addFavorite, removeFavorite } from '../lib/api'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OpportunityCard({ item }: { item: Opportunity }) {
  const { user, token } = useAuth()
  const [isFav, setIsFav] = useState(false) // In real app, check if item.id in user.favorites

  const toggleFav = async () => {
    if (!token) return
    try {
      if (isFav) {
        await removeFavorite(item.id, token)
        setIsFav(false)
      } else {
        await addFavorite(item.id, token)
        setIsFav(true)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const dateLine = item.startDate ? (item.endDate ? `${item.startDate} — ${item.endDate}` : item.startDate) : 'TBA'

  return (
    <article className="border rounded-md bg-white p-4 shadow-sm relative group">
      <div className="flex items-start justify-between">
        <div>
          <Link to={`/opportunities/${item.id}`} className="text-lg font-medium text-slate-800 hover:underline">
            {item.title}
          </Link>
          <div className="text-sm text-slate-500">{item.provider} • {dateLine} • {item.location?.country ?? ''}</div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          {item.verified === true && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Verified</span>}
          {item.verified === 'pending' && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Pending</span>}

          {user && (
            <button onClick={toggleFav} className="mt-1 text-slate-400 hover:text-rose-500 transition-colors">
              <span className="sr-only">Favorite</span>
              {isFav ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-rose-500">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{item.description}</p>
      <div className="mt-3 flex gap-2">
        {item.tags?.slice(0, 3).map((t) => (
          <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{t}</span>
        ))}
      </div>
    </article>
  )
}
