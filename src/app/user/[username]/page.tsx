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

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  const users = await sql`
    SELECT id, name, username, bio, public_profile, avatar_url
    FROM users
    WHERE username = ${username}
      AND public_profile = true
  `

  if (users.length === 0) notFound()

  const user = users[0]

  const games = await sql`
    SELECT 
      g.id, g.name, g.category, g.platforms,
      g.release_date, g.cover_url, g.hypes, g.interest_count
    FROM games g
    JOIN user_games ug ON ug.game_id = g.id
    WHERE ug.user_id = ${user.id}
      AND ug.status = 'interested'
    ORDER BY g.release_date ASC
  `

  return (
    <main className="min-h-screen text-white px-4 py-12" style={{backgroundColor: '#0a0a1a'}}>
      <div className="max-w-4xl mx-auto">

        <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Volver a vanx-i
        </Link>

        {/* PERFIL */}
        <div className="flex items-center gap-6 mb-10 p-8 rounded-3xl border border-gray-800 bg-gray-900/50">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name || ''}
              className="w-20 h-20 rounded-2xl flex-shrink-0 shadow-xl shadow-purple-500/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-white">{user.name || user.username}</h1>
            {user.username && <p className="text-gray-500 text-sm mt-0.5">@{user.username}</p>}
            {user.bio && <p className="text-gray-300 mt-2 text-sm">{user.bio}</p>}
            <p className="text-gray-500 text-sm mt-2">🎮 {games.length} juegos esperados</p>
          </div>
        </div>

        {/* JUEGOS */}
        <h2 className="text-2xl font-black mb-6 border-l-4 border-purple-500 pl-4">
          Juegos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">esperados</span>
        </h2>

        {games.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-gray-800 bg-gray-900/30">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-gray-400">Este usuario no tiene juegos marcados</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.map((game: any) => (
              <a href={`/game/${game.id}`} key={game.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 border border-gray-800 group-hover:border-purple-500/50 transition-all group-hover:scale-105">
                  {game.cover_url ? (
                    <img src={`https:${game.cover_url}`} alt={game.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-purple-900/50 to-cyan-900/50">🎮</div>
                  )}
                  {game.hypes > 5 && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">🔥</div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    📅 {new Date(game.release_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-gray-600 text-sm mt-12">
          Perfil en <a href="/" className="text-purple-400 hover:text-purple-300">vanx-i</a> · Tu calendario de lanzamientos
        </p>

      </div>
    </main>
  )
}