import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getForumThread, createForumPost, ForumThread } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'

export default function ThreadDetail() {
    const { id } = useParams()
    const { token } = useAuth()
    const [thread, setThread] = useState<ForumThread | null>(null)
    const [reply, setReply] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchThread = () => {
        if (!id) return
        getForumThread(id).then(setThread).finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchThread()
    }, [id])

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!id || !token) return
        try {
            await createForumPost(id, reply, token)
            setReply('')
            fetchThread() // Refresh to show new post
        } catch (err) {
            alert('Failed to reply')
        }
    }

    if (loading) return <div className="p-6">Loading thread...</div>
    if (!thread) return <div className="p-6">Thread not found</div>

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/forum" className="text-sky-600 hover:underline mb-4 block">← Back to Forums</Link>

            {/* OP */}
            <div className="bg-white p-6 rounded border mb-6">
                <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>
                <div className="text-slate-500 text-sm mb-6 border-b pb-2">
                    Posted by {thread.author?.username} on {new Date(thread.createdAt).toLocaleString()}
                </div>
                <div className="prose max-w-none text-slate-800 whitespace-pre-wrap">
                    {thread.content}
                </div>
            </div>

            {/* Replies */}
            <div className="space-y-4 mb-8">
                <h3 className="font-bold text-lg text-slate-700">{thread.posts?.length || 0} Replies</h3>
                {thread.posts?.map(post => (
                    <div key={post.id} className="bg-slate-50 p-4 rounded border">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                            <span className="font-bold text-slate-700">{post.author?.username}</span>
                            <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="whitespace-pre-wrap text-slate-800">{post.content}</div>
                    </div>
                ))}
            </div>

            {/* Reply Form */}
            {token ? (
                <form onSubmit={handleReply} className="bg-white p-4 rounded border sticky bottom-4 shadow-lg">
                    <textarea
                        className="w-full border p-2 rounded mb-2 h-24"
                        placeholder="Write a reply..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        required
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Post Reply</Button>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-100 p-4 rounded text-center text-slate-500">
                    Log in to reply
                </div>
            )}
        </div>
    )
}
