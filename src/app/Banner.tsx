'use client'

import { useEffect, useState } from 'react'

interface Announcement {
  id: number
  message: string
}

export default function Banner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/announcement')
      .then(res => res.json())
      .then(data => setAnnouncement(data))
  }, [])

  if (!announcement || dismissed) return null

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg flex-shrink-0">📢</span>
        <p className="text-sm font-medium line-clamp-2 sm:truncate">{announcement.message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/70 hover:text-white transition-colors flex-shrink-0 text-lg"
      >
        ✕
      </button>
    </div>
  )
}