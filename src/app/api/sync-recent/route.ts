import { getRecentGames } from '@/lib/igdb'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const games = await getRecentGames()

    if (!games || games.length === 0) {
      return NextResponse.json({ message: 'No se encontraron juegos recientes' })
    }

    let inserted = 0

    for (const game of games) {
      if (!game.first_release_date) continue

      const releaseDate = new Date(game.first_release_date * 1000).toISOString().split('T')[0]
      const coverUrl = game.cover?.url?.replace('t_thumb', 't_cover_big') || null
      const platforms = game.platforms?.map((p: { name: string }) => p.name) || []
      const category = game.genres?.[0]?.name || 'Sin categoría'
      const hypes = game.hypes || 0
      const follows = game.follows || 0
      const rating = game.rating || 0
      const ratingCount = game.rating_count || 0

      await sql`
        INSERT INTO games (igdb_id, name, category, platforms, release_date, cover_url, summary, hypes, follows, rating, rating_count)
        VALUES (
          ${game.id},
          ${game.name},
          ${category},
          ${platforms},
          ${releaseDate},
          ${coverUrl},
          ${game.summary || null},
          ${hypes},
          ${follows},
          ${rating},
          ${ratingCount}
        )
        ON CONFLICT (igdb_id) DO UPDATE SET
          name = EXCLUDED.name,
          release_date = EXCLUDED.release_date,
          cover_url = EXCLUDED.cover_url,
          hypes = EXCLUDED.hypes,
          follows = EXCLUDED.follows,
          rating = EXCLUDED.rating,
          rating_count = EXCLUDED.rating_count,
          updated_at = NOW()
      `
      inserted++
    }

    return NextResponse.json({ message: `${inserted} juegos recientes sincronizados` })
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json({ error: 'Error sincronizando juegos recientes' }, { status: 500 })
  }
}