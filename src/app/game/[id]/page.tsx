import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const platformLabels: Record<string, string> = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X|S': 'Xbox',
  'Xbox One': 'Xbox One'
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const games = await sql`SELECT * FROM games WHERE id = ${id}`

  if (games.length === 0) notFound()

  const game = games[0]

  return (
    <main className="min-h-screen text-white px-4 py-12" style={{backgroundColor: '#0a0a1a'}}>
      <div className="max-w-2xl mx-auto">

        <Link href="/calendar" className="text-gray-500 hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Volver al calendario
        </Link>

        <div className="flex gap-6 mb-8">
          {game.cover_url ? (
            <img
              src={`https:${game.cover_url}`}
              alt={game.name}
              className="w-36 h-48 object-cover rounded-2xl flex-shrink-0 shadow-2xl shadow-purple-500/20"
            />
          ) : (
            <div className="w-36 h-48 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
              🎮
            </div>
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
            {game.follows > 0 && (
              <p className="text-gray-400 text-sm">👥 {game.follows} siguiendo</p>
            )}
          </div>
        </div>

        {game.summary && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-gray-300 leading-relaxed">{game.summary}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/calendar"
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors text-center"
          >
            Ver en el calendario
          </Link>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Compartido desde <span className="text-purple-400">vanx-i</span> · Tu calendario de lanzamientos
        </p>

      </div>
    </main>
  )
}