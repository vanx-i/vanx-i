'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalGames: number
  topGames: {
    name: string
    interest_count: number
    release_date: string
    cover_url: string | null
  }[]
  recentUsers: {
    name: string
    email: string
    created_at: string
  }[]
}

export default function AdminPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [bannerMessage, setBannerMessage] = useState('')
  const [bannerActive, setBannerActive] = useState(false)
  const [bannerSaved, setBannerSaved] = useState('')

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.push('/'); return }

    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.error) { router.push('/'); return }
        setStats(data)
        setLoading(false)
      })
  }, [isLoaded, user, router])

  const forceSync = async (endpoint: string, label: string) => {
    setSyncing(true)
    setSyncMessage(`Ejecutando ${label}...`)
    const res = await fetch(endpoint)
    const data = await res.json()
    setSyncMessage(data.message || data.error || 'Completado')
    setSyncing(false)
  }

  if (!isLoaded || loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a1a'}}>
      <p className="text-gray-400 animate-pulse">Cargando panel...</p>
    </main>
  )

  if (!stats) return null

  return (
    <main className="min-h-screen text-white px-4 py-12" style={{backgroundColor: '#0a0a1a'}}>
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">
              Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">administración</span>
            </h1>
            <p className="text-gray-400 mt-1">vanx-i · Solo tú puedes ver esto</p>
          </div>
          <a href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Volver
          </a>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-purple-400">{stats.totalUsers}</p>
            <p className="text-gray-400 text-sm mt-1">Usuarios</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-cyan-400">{stats.totalGames}</p>
            <p className="text-gray-400 text-sm mt-1">Juegos en BD</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-pink-400">{stats.topGames.length}</p>
            <p className="text-gray-400 text-sm mt-1">Juegos con ❤️</p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-orange-400">{stats.recentUsers.length}</p>
            <p className="text-gray-400 text-sm mt-1">Últimos registros</p>
          </div>
        </div>

        {/* CONTROLES AGENTE */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-black mb-4 border-l-4 border-purple-500 pl-4">🤖 Control del agente</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => forceSync('/api/sync-games', 'sync de juegos')}
              disabled={syncing}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
            >
              🔄 Sincronizar juegos
            </button>
            <button
              onClick={() => forceSync('/api/sync-recent', 'sync de recientes')}
              disabled={syncing}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
            >
              🔄 Sincronizar recientes
            </button>
            <button
              onClick={() => forceSync('/api/notify-releases', 'notificaciones')}
              disabled={syncing}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
            >
              📧 Enviar notificaciones
            </button>
          </div>
          {syncMessage && (
            <p className={`mt-3 text-sm font-medium ${syncing ? 'text-gray-400 animate-pulse' : 'text-green-400'}`}>
              {syncMessage}
            </p>
          )}
        </div>

        {/* TOP JUEGOS */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-black mb-4 border-l-4 border-cyan-500 pl-4">🔥 Top juegos más esperados</h2>
          <div className="space-y-3">
            {stats.topGames.map((game, i) => (
              <div key={game.name} className="flex items-center gap-4">
                <span className="text-gray-500 text-sm w-6">{i + 1}</span>
                {game.cover_url && (
                  <img src={`https:${game.cover_url}`} alt={game.name} className="w-8 h-10 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{game.name}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <span className="text-purple-300 text-sm font-bold">💜 {game.interest_count}</span>
              </div>
            ))}
            {stats.topGames.length === 0 && (
              <p className="text-gray-500 text-sm">Aún no hay juegos con favoritos</p>
            )}
          </div>
        </div>

        {/* ÚLTIMOS USUARIOS */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-black mb-4 border-l-4 border-pink-500 pl-4">👥 Últimos usuarios registrados</h2>
          <div className="space-y-3">
            {stats.recentUsers.map(user => (
              <div key={user.email} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-sm flex-shrink-0">
                  {user.name?.[0] || user.email?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name || 'Sin nombre'}</p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
            {/* BANNER DE NOVEDADES */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 mt-10">
          <h2 className="text-xl font-black mb-4 border-l-4 border-cyan-500 pl-4">📢 Banner de novedades</h2>
          <p className="text-gray-400 text-sm mb-4">Escribe un mensaje y actívalo para que aparezca en la web. Desactívalo cuando quieras.</p>
          <textarea
            value={bannerMessage}
            onChange={e => setBannerMessage(e.target.value)}
            placeholder="Ej: ¡Nueva feature! Ahora puedes añadir juegos a Google Calendar directamente desde el modal."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white text-sm placeholder-gray-500 outline-none focus:border-purple-500 transition-colors resize-none h-24 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const res = await fetch('/api/announcement', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: bannerMessage, active: true })
                })
                if (res.ok) setBannerSaved('✅ Banner activado')
                else setBannerSaved('❌ Error al activar')
              }}
              disabled={!bannerMessage}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl text-sm font-bold transition-colors"
            >
              📢 Activar banner
            </button>
            <button
              onClick={async () => {
                const res = await fetch('/api/announcement', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: '', active: false })
                })
                if (res.ok) { setBannerSaved('✅ Banner desactivado'); setBannerMessage('') }
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold transition-colors"
            >
              🚫 Desactivar
            </button>
          </div>
          {bannerSaved && <p className="text-sm mt-3 text-green-400">{bannerSaved}</p>}
        </div>
      </div>
    </main>
  )
}
