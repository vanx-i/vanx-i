'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const platformLabels: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox One'
}

export default function GamePage() {
  const { user } = useUser()
  const [game, setGame] = useState<any>(null)
  const [isInterested, setIsInterested] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCalMenu, setShowCalMenu] = useState(false)

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    fetch(`/api/games/${id}`)
      .then(res => res.json())
      .then(data => setGame(data))
  }, [])

  useEffect(() => {
    if (!game) return
    fetch('/api/user-games')
      .then(res => res.json())
      .then(data => setIsInterested(data.includes(game.id)))
  }, [game])

  const toggleInterest = async () => {
    if (!user || !game) return
    setLoading(true)
    try {
      const res = await fetch('/api/user-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.fullName || user.username
        })
      })
      const data = await res.json()
      setIsInterested(data.status === 'added')
    } finally {
      setLoading(false)
    }
  }

  if (!game) return (
    <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a1a'}}>
      <p className="text-gray-400 animate-pulse">Cargando...</p>
    </main>
  )

  const gameDate = new Date(game.release_date).toLocaleDateString('en-CA').replace(/-/g, '')

  return (
    <main className="min-h-screen text-white px-4 py-12" style={{backgroundColor: '#0a0a1a'}}>
      <div className="max-w-2xl mx-auto">

        <Link href="/calendar" className="text-gray-500 hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Volver al calendario
        </Link>

        <div className="flex gap-6 mb-8">
          {game.cover_url ? (
            <img src={`https:${game.cover_url}`} alt={game.name} className="w-36 h-48 object-cover rounded-2xl flex-shrink-0 shadow-2xl shadow-purple-500/20" />
          ) : (
            <div className="w-36 h-48 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">🎮</div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-black text-white">{game.name}</h1>
              {game.hypes > 5 && <span className="text-orange-400">🔥</span>}
            </div>
            <p className="text-purple-400 font-medium mb-3">{game.category}</p>
            <p className="text-gray-300 mb-3">
              📅 {new Date(game.release_date).toLocaleDateString('es-ES', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {game.platforms?.map((p: string) => (
                <span key={p} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium">
                  {platformLabels[p] || p}
                </span>
              ))}
            </div>
            {game.interest_count > 0 && (
              <p className="text-purple-300 text-sm font-medium">💜 {game.interest_count} {game.interest_count === 1 ? 'persona espera' : 'personas esperan'} este juego</p>
            )}
          </div>
        </div>

        {game.summary && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-gray-300 leading-relaxed">{game.summary}</p>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex flex-wrap gap-2">
          {user ? (
            <button
              onClick={toggleInterest}
              disabled={loading}
              className={`flex-1 py-2.5 rounded-xl transition-all text-sm font-bold ${
                isInterested ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white'
              }`}
            >
              {isInterested ? '🤍 Me interesa' : '🖤 Me interesa'}
            </button>
          ) : (
            <div className="flex-1 py-2.5 rounded-xl bg-gray-800/50 text-gray-500 text-sm text-center">
              Inicia sesión para marcar favoritos
            </div>
          )}

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowCalMenu(!showCalMenu) }}
              className="px-3 py-2.5 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-sm font-medium text-gray-400"
            >
              📅
            </button>
            {showCalMenu && (
              <div className="absolute bottom-full pb-2 right-0 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl w-44 z-10">
                
                <a  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=🎮+${encodeURIComponent(game.name)}&dates=${gameDate}/${gameDate}&details=${encodeURIComponent(`Lanzamiento de ${game.name}. Más info en https://vanx-i.app/game/${game.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700 text-white text-sm transition-colors"
                >
                  <span>📅</span> Google Calendar
                </a>
                
                <a  href={`/api/games/ics?id=${game.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700 text-white text-sm transition-colors"
                >
                  <span>🍎</span> Apple Calendar
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const url = `https://vanx-i.app/game/${game.id}`
              const text = `🎮 ¡Echa un ojo a este juego!\n${game.name} · Sale el ${new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}\n👉 ${url}`
              navigator.clipboard.writeText(text)
              alert('¡Copiado al portapapeles!')
            }}
            className="px-3 py-2.5 bg-gray-800 hover:bg-cyan-600 hover:text-white rounded-xl transition-all text-sm font-medium text-gray-400"
          >
            🔗
          </button>

        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Compartido desde <span className="text-purple-400">vanx-i</span> · Tu calendario de lanzamientos
        </p>

      </div>
    </main>
  )
}