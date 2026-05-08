'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

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

export default function CalendarPage() {
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

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

  const platformLabels: Record<string, string> = {
    'PC (Microsoft Windows)': 'PC',
    'PlayStation 5': 'PS5',
    'Nintendo Switch': 'Switch',
    'Xbox Series X|S': 'Xbox',
    'Xbox One': 'Xbox One'
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Calendario de lanzamientos
            </h1>
            <p className="text-gray-400 mt-1">{filteredGames.length} juegos próximos</p>
          </div>
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Volver
          </a>
        </div>

        {/* Filtros plataforma */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PLATFORMS.map(platform => (
            <button
              key={platform}
              onClick={() => togglePlatform(platform)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedPlatforms.includes(platform)
                  ? 'bg-purple-600 text-white'
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
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {/* Leyenda hypes */}
        <div className="flex gap-4 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span> AAA / Alto hype</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-cyan-700 inline-block"></span> Hype medio</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-700 inline-block"></span> Indie / Sin hype</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Cargando juegos...</div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-4">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              locale="es"
              height="auto"
              dayMaxEvents={3}
              eventClick={(info) => {
                setSelectedGame(info.event.extendedProps.game)
              }}
              eventClassNames="cursor-pointer"
              displayEventTime={false}
            />
          </div>
        )}

        {/* Modal juego seleccionado */}
        {selectedGame && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedGame(null)}
          >
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              {selectedGame.cover_url && (
                <img
                  src={`https:${selectedGame.cover_url}`}
                  alt={selectedGame.name}
                  className="w-32 h-40 object-cover rounded-xl mb-4 mx-auto"
                />
              )}
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{selectedGame.name}</h2>
                {selectedGame.hypes > 20 && <span className="text-orange-400 text-lg">🔥</span>}
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm">
                  {selectedGame.category}
                </span>
                {selectedGame.platforms?.slice(0, 3).map(p => (
                  <span key={p} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-gray-400 text-sm mb-3">
                📅 {new Date(selectedGame.release_date).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
              {selectedGame.follows > 0 && (
                <p className="text-gray-400 text-sm mb-3">
                  👥 {selectedGame.follows} personas siguiendo este juego
                </p>
              )}
              {selectedGame.rating > 0 && (
                <p className="text-gray-400 text-sm mb-3">
                  ⭐ {Number(selectedGame.rating).toFixed(1)} / 100 · {selectedGame.rating_count} valoraciones
                </p>
              )}
              {selectedGame.summary && (
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {selectedGame.summary}
                </p>
              )}
              <button
                onClick={() => setSelectedGame(null)}
                className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}