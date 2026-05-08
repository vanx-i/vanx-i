'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Game {
  id: number
  name: string
  category: string
  platforms: string[]
  release_date: string
  cover_url: string | null
  hypes: number
}

const platformLabels: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox One'
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [interestedGames, setInterestedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) router.push('/')
  }, [isLoaded, user, router])

  useEffect(() => {
    if (!user) return
    fetch('/api/user-games/list')
      .then(res => res.json())
      .then(data => {
        setInterestedGames(data)
        setLoading(false)
      })
  }, [user])

  if (!isLoaded || !user) return null

  const nextGame = interestedGames[0]
  const daysUntilNext = nextGame
    ? Math.ceil((new Date(nextGame.release_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#0a0a1a'}}>

      {/* BANNER */}
      <div className="relative h-48 overflow-hidden">
        <img src="/profile-banner.png" alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a1a]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 pb-24">

        {/* AVATAR Y DATOS */}
        <div className="flex items-end gap-6 mb-8">
          <img
            src={user.imageUrl}
            alt={user.fullName || ''}
            className="w-24 h-24 rounded-2xl shadow-2xl shadow-purple-500/30 border-4 border-[#0a0a1a]"
          />
          <div className="pb-2">
            <h1 className="text-3xl font-black text-white">{user.fullName || user.username}</h1>
            <p className="text-gray-400 text-sm">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-purple-400">{interestedGames.length}</p>
            <p className="text-gray-400 text-xs mt-1">Juegos esperados</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-cyan-400">
              {daysUntilNext !== null ? (daysUntilNext <= 0 ? '¡Hoy!' : daysUntilNext) : '-'}
            </p>
            <p className="text-gray-400 text-xs mt-1">Días hasta el próximo</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-pink-400">
              {interestedGames.filter(g => g.hypes > 5).length}
            </p>
            <p className="text-gray-400 text-xs mt-1">🔥 AAA esperados</p>
          </div>
        </div>

        {/* PRÓXIMO JUEGO */}
        {nextGame && (
          <div className="mb-10 p-6 rounded-3xl border border-purple-500/30 bg-purple-900/10 flex gap-4 items-center">
            {nextGame.cover_url ? (
              <img
                src={`https:${nextGame.cover_url}`}
                alt={nextGame.name}
                className="w-16 h-20 object-cover rounded-xl flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-20 bg-purple-900/50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎮</div>
            )}
            <div>
              <p className="text-purple-400 text-xs font-bold mb-1">PRÓXIMO LANZAMIENTO</p>
              <h3 className="text-xl font-black text-white">{nextGame.name}</h3>
              <p className="text-gray-400 text-sm mt-1">
                📅 {new Date(nextGame.release_date).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
                {daysUntilNext !== null && daysUntilNext > 0 && (
                  <span className="text-cyan-400 ml-2">· en {daysUntilNext} días</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* JUEGOS INTERESADOS */}
        <h2 className="text-2xl font-black mb-6 border-l-4 border-purple-500 pl-4">
          Mis juegos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">esperados</span>
        </h2>

        {loading ? (
          <div className="text-gray-400 animate-pulse">Cargando tus juegos...</div>
        ) : interestedGames.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-gray-800 bg-gray-900/30">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-gray-400 mb-4">Aún no tienes juegos marcados</p>
            <a href="/calendar" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors">
              Explorar calendario
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {interestedGames.map(game => (
              <div key={game.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 border border-gray-800 group-hover:border-purple-500/50 transition-all group-hover:scale-105">
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
                      🔥
                    </div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    📅 {new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.platforms?.slice(0, 2).map(p => (
                      <span key={p} className="text-xs text-gray-500">
                        {platformLabels[p] || p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}