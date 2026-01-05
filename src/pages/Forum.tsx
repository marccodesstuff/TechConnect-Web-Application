import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getForumCategories, getForumThreads, ForumCategory, ForumThread, createForumThread } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Forum() {
    const { token } = useAuth()
    const [categories, setCategories] = useState<ForumCategory[]>([])
    const [activeCategory, setActiveCategory] = useState<ForumCategory | null>(null)
    const [threads, setThreads] = useState<ForumThread[]>([])
    const [loading, setLoading] = useState(true)

    // New Thread State
    const [isCreating, setIsCreating] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')

    useEffect(() => {
        getForumCategories().then(cats => {
            setCategories(cats)
            if (cats.length > 0) {
                setActiveCategory(cats[0])
            }
        }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (activeCategory) {
            getForumThreads(activeCategory.id).then(setThreads)
        }
    }, [activeCategory])

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!activeCategory || !token) return
        try {
            await createForumThread(activeCategory.id, newTitle, newContent, token)
            setIsCreating(false)
            setNewTitle('')
            setNewContent('')
            // Refresh
            const fresh = await getForumThreads(activeCategory.id)
            setThreads(fresh)
        } catch (err) {
            alert('Failed to create thread')
        }
    }

    if (loading) return <div className="p-6">Loading forums...</div>

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-1/4 bg-white p-4 rounded border h-fit">
                <h2 className="font-bold text-lg mb-4">Categories</h2>
                <ul className="space-y-2">
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <button
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-3 py-2 rounded ${activeCategory?.id === cat.id ? 'bg-sky-50 text-sky-700 font-medium' : 'hover:bg-slate-50'}`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{activeCategory?.name}</h1>
                        <p className="text-slate-500">{activeCategory?.description}</p>
                    </div>
                    {token && !isCreating && (
                        <Button onClick={() => setIsCreating(true)}>New Thread</Button>
                    )}
                </div>

                {isCreating && (
                    <div className="bg-white p-6 rounded border mb-6">
                        <h3 className="font-bold mb-4">Create New Thread</h3>
                        <form onSubmit={handleCreateThread} className="space-y-4">
                            <Input placeholder="Thread Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                            <textarea
                                className="w-full border p-2 rounded h-32"
                                placeholder="What's on your mind?"
                                value={newContent}
                                onChange={e => setNewContent(e.target.value)}
                                required
                            />
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                <Button type="submit">Post Thread</Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {threads.length === 0 && <div className="text-slate-500 p-8 text-center bg-white rounded border">No threads yet. Be the first!</div>}
                    {threads.map(thread => (
                        <Link to={`/forum/thread/${thread.id}`} key={thread.id} className="block bg-white p-4 rounded border hover:border-sky-500 transition-colors">
                            <h3 className="font-semibold text-lg">{thread.title}</h3>
                            <div className="text-sm text-slate-500 mt-1 flex justify-between">
                                <span>by {thread.author?.username || 'Unknown'} • {new Date(thread.createdAt).toLocaleDateString()}</span>
                                <span>{thread.viewCount} views</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
