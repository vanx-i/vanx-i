'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useUser } from '@clerk/nextjs'

interface Game {
  id: number
  name: string
  category: string
  platforms: string[]
  release_date: string
  cover_url: string | null
  summary: string | null
  hypes: number
  follows: number
  rating: number
  rating_count: number
}

const PLATFORMS = ['PC (Microsoft Windows)', 'PlayStation 5', 'Nintendo Switch', 'Xbox Series X|S', 'Xbox One']

const platformLabels: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox One'
}

const platformColors: Record<string, string> = {
  'PC (Microsoft Windows)': 'bg-blue-500/20 text-blue-300',
  'PlayStation 5': 'bg-blue-700/20 text-blue-400',
  'Nintendo Switch': 'bg-red-500/20 text-red-300',
  'Xbox Series X|S': 'bg-green-500/20 text-green-300',
  'Xbox One': 'bg-green-700/20 text-green-400'
}

export default function CalendarPage() {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'calendar' | 'list'>('list')
  const { user } = useUser()
  const [interestedGames, setInterestedGames] = useState<number[]>([])
  const [loadingInterest, setLoadingInterest] = useState(false)

useEffect(() => {
  fetch('/api/user-games')
    .then(res => res.json())
    .then(data => setInterestedGames(data))
}, [])

const toggleInterest = async (gameId: number) => {
  if (!user) return
  setLoadingInterest(true)
  try {
    const res = await fetch('/api/user-games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId,
        userEmail: user.primaryEmailAddress?.emailAddress,
        userName: user.fullName || user.username
      })
    })
    const data = await res.json()
    if (data.status === 'added') {
      setInterestedGames(prev => [...prev, gameId])
    } else {
      setInterestedGames(prev => prev.filter(id => id !== gameId))
    }
  } finally {
    setLoadingInterest(false)
  }
}
  useEffect(() => {
    fetch('/api/games')
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setLoading(false)
      })
  }, [])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const filteredGames = selectedPlatforms.length === 0
    ? games
    : games.filter(game =>
        game.platforms?.some(p => selectedPlatforms.includes(p))
      )

  const events = [...filteredGames]
    .sort((a, b) => b.hypes - a.hypes)
    .map(game => ({
      id: String(game.id),
      title: game.name,
      date: game.release_date,
      backgroundColor: game.hypes > 5 ? '#7c3aed' : game.hypes > 1 ? '#0e7490' : '#374151',
      borderColor: game.hypes > 5 ? '#7c3aed' : game.hypes > 1 ? '#0e7490' : '#374151',
      extendedProps: { game }
    }))

  // Agrupar juegos por mes para vista lista
  const gamesByMonth = filteredGames.reduce((acc, game) => {
    const date = new Date(game.release_date)
    const key = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(game)
    return acc
  }, {} as Record<string, Game[]>)

  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#0a0a1a'}}>

      {/* HERO CALENDARIO */}
      <section className="relative h-48 flex items-center overflow-hidden">
        <img src="/calendar-banner.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-transparent to-[#0a0a1a]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a1a]" />
        <div className="relative z-10 px-6 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-black text-white">
            Calendario de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">lanzamientos</span>
          </h1>
          <p className="text-gray-400 mt-1">{filteredGames.length} juegos próximos</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-24">

        {/* CONTROLES */}
        <div className="flex flex-wrap items-center gap-3 mb-6">

          {/* Filtros plataforma */}
          <div className="flex flex-wrap gap-2 flex-1">
            {PLATFORMS.map(platform => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {platformLabels[platform]}
              </button>
            ))}
            {selectedPlatforms.length > 0 && (
              <button
                onClick={() => setSelectedPlatforms([])}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-900 text-gray-500 hover:text-white transition-colors"
              >
                Limpiar ✕
              </button>
            )}
          </div>

          {/* Toggle vista */}
          <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              🎮 Lista
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                view === 'calendar' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📅 Calendario
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 animate-pulse">Cargando juegos...</div>
          </div>
        ) : view === 'calendar' ? (

          /* VISTA CALENDARIO */
          <div className="bg-gray-900/50 backdrop-blur rounded-3xl p-4 border border-gray-800">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              locale="es"
              height="auto"
              dayMaxEvents={3}
              displayEventTime={false}
              eventClick={(info) => setSelectedGame(info.event.extendedProps.game)}
              eventClassNames="cursor-pointer rounded-lg"
            />
          </div>

        ) : (

          /* VISTA LISTA ESTILO NETFLIX */
          <div className="space-y-12">
            {Object.entries(gamesByMonth).map(([month, monthGames]) => (
              <div key={month}>
                <h2 className="text-2xl font-black mb-4 capitalize text-white border-l-4 border-purple-500 pl-4">
                  {month}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {monthGames.map(game => (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="group cursor-pointer"
                    >
                      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 border border-gray-800 group-hover:border-purple-500/50 transition-all group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-purple-500/20">
                        {game.cover_url ? (
                          <img
                            src={`https:${game.cover_url}`}
                            alt={game.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50">
                            🎮
                          </div>
                        )}
                        {game.hypes > 5 && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            🔥 HOT
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-xs font-bold leading-tight">{game.name}</p>
                        </div>
                      </div>
                      <div className="mt-2 px-1">
                        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedGame && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex gap-4 mb-4">
              {selectedGame.cover_url ? (
                <img
                  src={`https:${selectedGame.cover_url}`}
                  alt={selectedGame.name}
                  className="w-24 h-32 object-cover rounded-xl flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-32 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  🎮
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-2">
                  <h2 className="text-xl font-black text-white leading-tight">{selectedGame.name}</h2>
                  {selectedGame.hypes > 5 && <span className="text-orange-400 flex-shrink-0">🔥</span>}
                </div>
                <p className="text-purple-400 text-sm font-medium mb-2">{selectedGame.category}</p>
                <p className="text-gray-400 text-sm">
                  📅 {new Date(selectedGame.release_date).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                {selectedGame.follows > 0 && (
                  <p className="text-gray-400 text-sm mt-1">👥 {selectedGame.follows} siguiendo</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {selectedGame.platforms?.map(p => (
                <span key={p} className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[p] || 'bg-gray-800 text-gray-300'}`}>
                  {platformLabels[p] || p}
                </span>
              ))}
            </div>

            {selectedGame.summary && (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 mb-4">
                {selectedGame.summary}
              </p>
            )}

            <div className="flex gap-3">
              {user ? (
                <button
                  onClick={() => toggleInterest(selectedGame.id)}
                  disabled={loadingInterest}
                  className={`flex-1 py-2.5 rounded-xl transition-all text-sm font-bold ${
                    interestedGames.includes(selectedGame.id)
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white'
                  }`}
                >
                  {interestedGames.includes(selectedGame.id) ? '💜 Me interesa' : '🤍 Me interesa'}
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-xl bg-gray-800/50 text-gray-500 text-sm text-center">
                  Inicia sesión para marcar favoritos
                </div>
              )}
              <button
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}