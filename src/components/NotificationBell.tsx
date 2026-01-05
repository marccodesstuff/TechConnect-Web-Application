import React, { useEffect, useState } from 'react'
import { getNotifications, markNotificationRead, Notification } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function NotificationBell() {
    const { token } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        if (token) {
            getNotifications(token).then(setNotifications).catch(console.error)
            // Poll every minute
            const interval = setInterval(() => {
                getNotifications(token).then(setNotifications).catch(console.error)
            }, 60000)
            return () => clearInterval(interval)
        }
    }, [token])

    const unreadCount = notifications.filter(n => !n.read).length

    const handleMarkRead = async (id: number) => {
        try {
            await markNotificationRead(id, token!)
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 relative hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
            >
                <span>🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-md z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b dark:border-slate-700 font-bold text-sm">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                        <div>
                            {notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b dark:border-slate-700 text-sm ${n.read ? 'opacity-50' : 'bg-slate-50 dark:bg-slate-700'}`}>
                                    <div className="mb-1">{n.message}</div>
                                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                                        {!n.read && (
                                            <button onClick={() => handleMarkRead(n.id)} className="text-blue-600 hover:underline">
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
