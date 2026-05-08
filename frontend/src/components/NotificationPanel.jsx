import { useState, useEffect, useRef } from 'react'
import { Bell, X, AlertTriangle, Info, CheckCircle, Wifi, Thermometer, Wind } from 'lucide-react'
import { mockAlerts, mockActions } from '../mockData.js'

const NOTIF_ICON = {
  sensor_offline: { Icon: Wifi, color: 'text-amber-500', bg: 'bg-amber-50' },
  air_quality:    { Icon: Wind, color: 'text-red-500',   bg: 'bg-red-50' },
  comfort:        { Icon: Thermometer, color: 'text-blue-500', bg: 'bg-blue-50' },
  action_pending: { Icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
  info:           { Icon: Info, color: 'text-navy', bg: 'bg-blue-50' },
  success:        { Icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
}

function buildNotifications() {
  const fromAlerts = mockAlerts.slice(0, 5).map((a, i) => ({
    id: `alert-${i}`,
    type: a.type,
    title: a.type === 'sensor_offline' ? '⚠ Sensor Offline' :
           a.type === 'air_quality' ? '🌬 Air Quality Alert' : '🌡 Comfort Alert',
    message: a.message,
    room: a.room,
    severity: a.severity,
    time: new Date(Date.now() - i * 4 * 60_000),
    read: false,
  }))
  const pendingActions = mockActions.filter(a => a.status === 'pending').map((a, i) => ({
    id: `action-${a.id}`,
    type: 'action_pending',
    title: '📋 Action Awaiting Approval',
    message: a.title,
    room: `Room ${a.room_id}`,
    severity: 'warning',
    time: new Date(Date.now() - (i + 6) * 8 * 60_000),
    read: false,
  }))
  return [...fromAlerts, ...pendingActions]
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(buildNotifications)
  const ref = useRef(null)

  const unread = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // Simulate live incoming notifications every 30s
  useEffect(() => {
    const id = setInterval(() => {
      setNotifications(prev => [{
        id: `live-${Date.now()}`,
        type: 'info',
        title: '📡 Live Update',
        message: `Campus sensor mesh refreshed — ${Math.floor(Math.random()*5)+25}/30 sensors online`,
        room: 'All Blocks',
        severity: 'info',
        time: new Date(),
        read: false,
      }, ...prev.slice(0, 19)])
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id))
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const fmt = (d) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 60_000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    return `${Math.floor(diff / 60)}h ago`
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 hover:bg-page rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-navy" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange rounded-full
                           text-white text-[10px] font-bold flex items-center justify-center px-0.5 animate-bounce">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-11 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-nav font-semibold text-navy">Notifications</p>
              <p className="text-label text-textmute">{unread} unread</p>
            </div>
            <button onClick={markAllRead}
                    className="text-label text-orange hover:underline">
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 && (
              <div className="py-10 text-center text-textmute text-body">
                🎉 You're all caught up!
              </div>
            )}
            {notifications.map(n => {
              const cfg = NOTIF_ICON[n.type] || NOTIF_ICON.info
              const Icon = cfg.Icon
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50
                              ${!n.read ? 'bg-orange/5' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-body font-medium text-navy ${!n.read ? 'font-semibold' : ''}`}>
                        {n.title}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                        className="text-textmute hover:text-red-500 shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <p className="text-label text-textmute mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-label text-textmute">{n.room}</span>
                      <span className="text-label text-textmute">·</span>
                      <span className="text-label text-textmute">{fmt(n.time)}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-orange" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 text-center">
            <button className="text-label text-orange hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
