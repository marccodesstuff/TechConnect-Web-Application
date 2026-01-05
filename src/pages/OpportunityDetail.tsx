import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getOpportunity,
  Opportunity,
  joinTeamLobby,
  getTeamRequests,
  leaveTeamLobby,
  addInsight,
  getInsights,
  TeamRequestResponse,
  InsightResponse
} from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const [item, setItem] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)

  // Social State
  const [teamRequests, setTeamRequests] = useState<TeamRequestResponse[]>([])
  const [insights, setInsights] = useState<InsightResponse[]>([])
  const [message, setMessage] = useState('')
  const [insightComment, setInsightComment] = useState('')
  const [insightVerdict, setInsightVerdict] = useState<'RECOMMENDED' | 'MIXED' | 'NOT_RECOMMENDED'>('RECOMMENDED')

  useEffect(() => {
    if (!id) return
    getOpportunity(id)
      .then((res) => {
        setItem(res)
        // Fetch social data based on type
        if (res.type === 'HACKATHON') {
          getTeamRequests(id).then(setTeamRequests)
        } else if (['CERTIFICATION', 'PROMO'].includes(res.type)) {
          getInsights(id).then(setInsights)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const handleJoinTeam = async () => {
    if (!id || !token) return
    try {
      await joinTeamLobby(id, message, token)
      const fresh = await getTeamRequests(id)
      setTeamRequests(fresh)
      setMessage('')
    } catch (e) {
      alert('Failed to join lobby')
    }
  }

  const handleLeaveTeam = async () => {
    if (!id || !token) return
    try {
      await leaveTeamLobby(id, token)
      const fresh = await getTeamRequests(id)
      setTeamRequests(fresh)
    } catch (e) {
      alert('Failed to leave lobby')
    }
  }

  const handleAddInsight = async () => {
    if (!id || !token) return
    try {
      await addInsight(id, { verdict: insightVerdict, comment: insightComment, tags: [] }, token)
      const fresh = await getInsights(id)
      setInsights(fresh)
      setInsightComment('')
    } catch (e) {
      alert('Failed to add insight')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!item) return <div>Not found</div>

  const isHackathon = item.type === 'HACKATHON'
  const isReviewable = ['CERTIFICATION', 'PROMO'].includes(item.type)

  return (
    <div className="space-y-6">
      <article className="bg-white rounded-md border p-6">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-sm text-slate-500 mt-2">{item.provider} • {item.startDate ?? 'TBA'}</div>
        <div className="mt-4 text-slate-700">{item.description}</div>
        <div className="mt-4">
          <a href={item.url} target="_blank" rel="noreferrer" className="text-sky-600 underline">Open provider page</a>
        </div>
      </article>

      {/* Team Formation Module */}
      {isHackathon && (
        <div className="bg-white rounded-md border p-6">
          <h2 className="text-xl font-bold mb-4">Looking for Team?</h2>
          <div className="space-y-4">
            {teamRequests.length === 0 && <p className="text-slate-500">No one is looking yet. Be the first!</p>}
            {teamRequests.map((req) => (
              <div key={req.id} className="border p-3 rounded bg-slate-50 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sky-700">{req.username}</div>
                  <div className="text-slate-600">{req.message}</div>
                </div>
                {user?.username === req.username && (
                  <button onClick={handleLeaveTeam} className="text-red-500 text-sm hover:underline">Remove</button>
                )}
              </div>
            ))}

            {token ? (
              <div className="flex gap-2 mt-4">
                <input
                  className="border p-2 rounded flex-1"
                  placeholder="I'm a backend dev looking for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleJoinTeam} className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
                  Post Request
                </button>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">Log in to post a team request.</div>
            )}
          </div>
        </div>
      )}

      {/* Community Insights Module */}
      {isReviewable && (
        <div className="bg-white rounded-md border p-6">
          <h2 className="text-xl font-bold mb-4">Community Insights</h2>
          <div className="grid gap-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border p-4 rounded bg-slate-50">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{insight.username}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${insight.verdict === 'RECOMMENDED' ? 'bg-green-100 text-green-700' :
                      insight.verdict === 'NOT_RECOMMENDED' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                    {insight.verdict}
                  </span>
                </div>
                <p className="text-slate-700">{insight.comment}</p>
              </div>
            ))}

            {token && (
              <div className="border-t pt-4 mt-2">
                <h3 className="font-semibold mb-2">Add your insight</h3>
                <div className="flex gap-2 mb-2">
                  <select
                    className="border p-2 rounded"
                    value={insightVerdict}
                    onChange={(e) => setInsightVerdict(e.target.value as any)}
                  >
                    <option value="RECOMMENDED">Recommended</option>
                    <option value="MIXED">Mixed</option>
                    <option value="NOT_RECOMMENDED">Not Recommended</option>
                  </select>
                </div>
                <textarea
                  className="w-full border p-2 rounded"
                  placeholder="Share your experience..."
                  value={insightComment}
                  onChange={(e) => setInsightComment(e.target.value)}
                />
                <button
                  onClick={handleAddInsight}
                  className="mt-2 bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
                >
                  Submit Insight
                </button>
              </div>
            )}
            {!token && <div className="text-slate-500 text-sm">Log in to share insights.</div>}
          </div>
        </div>
      )}
    </div>
  )
}

