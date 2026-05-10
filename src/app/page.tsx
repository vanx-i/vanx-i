'use client'

import { useEffect, useState } from 'react'

interface TopGame {
  id: number
  name: string
  category: string
  platforms: string[]
  release_date: string
  cover_url: string | null
  hypes: number
  interest_count: number
}

const platformLabels: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox One'
}

export default function Home() {
  const [topGames, setTopGames] = useState<TopGame[]>([])

  useEffect(() => {
    fetch('/api/games/top')
      .then(res => res.json())
      .then(data => setTopGames(data))
  }, [])

  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#0a0a1a'}}>

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src="/hero-banner.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a1a]" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <img src="/icon-192.png" alt="vanx-i logo" className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-2xl shadow-purple-500/50" />
          <h1 className="text-7xl sm:text-9xl font-black mb-4 leading-none tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            vanx-i
          </h1>
          <p className="text-xl sm:text-2xl font-bold mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            <span className="text-white">Tu calendario de lanzamientos de videojuegos.</span>
            <br />
            <span className="text-cyan-300">Sin ruido. Solo lo que te importa.</span>
            <span className="block text-sm text-gray-300 mt-2 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,1)] bg-black/30 px-4 py-2 rounded-xl backdrop-blur">
              Más de 500 juegos actualizados cada noche desde IGDB. Sin noticias, sin clickbait, sin publicidad.
            </span>
          </p>
          <a href="/calendar" className="inline-block px-10 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50">
            Ver calendario →
          </a>
          <div className="mt-6 p-4 bg-black/30 backdrop-blur rounded-2xl border border-purple-500/20 text-sm text-gray-300 max-w-md mx-auto">
            <p className="text-purple-400 font-bold mb-2">🔒 Al registrarte gratis puedes:</p>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Marcar juegos favoritos y recibir emails</span>
              <span className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Ver solo los juegos de tus plataformas</span>
              <span className="flex items-center gap-2"><span className="text-cyan-400">✓</span> Tu perfil personalizado con tus lanzamientos</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 5 MÁS ESPERADOS */}
      {topGames.length > 0 && (
        <section className="relative px-4 pt-8 pb-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">
              🔥 Lo más <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">esperado</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Los juegos más esperados por la comunidad vanx-i</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {topGames.map((game, index) => (
              <a href={`/game/${game.id}`} key={game.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 border border-gray-800 group-hover:border-purple-500/50 transition-all group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-purple-500/20">
                  {game.cover_url ? (
                    <img src={`https:${game.cover_url}`} alt={game.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50">
                      🎮
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </div>
                  {game.interest_count > 0 && (
                    <div className="absolute bottom-2 right-2 bg-purple-600/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      💜 {game.interest_count}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs font-bold leading-tight">{game.name}</p>
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    📅 {new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {game.platforms?.slice(0, 2).map(p => (
                      <span key={p} className="text-xs text-gray-600">{platformLabels[p] || p}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="/calendar" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              Ver todos los lanzamientos →
            </a>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="relative px-4 py-24 max-w-6xl mx-auto">
        <div className="absolute inset-0 opacity-5 rounded-3xl" style={{backgroundImage: 'url(/halftone-bg.png)', backgroundSize: '300px'}} />
        <h2 className="text-4xl font-black text-center mb-16 text-white">
          Todo lo que necesitas.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Nada que no necesitas.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <img src="/calendar-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="relative p-6 -mt-16">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-black mb-2 text-white">Calendario visual</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Todos los lanzamientos organizados por fecha, filtrados por plataforma y ordenados por hype</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105">
            <img src="/notifications-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="relative p-6 -mt-16">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-xl font-black mb-2 text-white">Notificaciones</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Recibe un email cuando sale un juego que tienes marcado como interesado</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <img src="/agent-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            <div className="relative p-6">
              <h3 className="text-xl font-black mb-2 text-white">Siempre actualizado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Un agente automático mantiene el calendario al día con los últimos anuncios y conferencias</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center pb-8 text-gray-600 text-sm border-t border-gray-900 pt-8">
        <img src="/icon-192.png" alt="" className="w-8 h-8 rounded-lg mx-auto mb-3 opacity-50" />
        vanx-i © 2026 · Hecho con 🎮 desde Zaragoza
      </footer>

    </main>
  )
}