import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const games = await sql`SELECT * FROM games WHERE id = ${id}`
  if (games.length === 0) return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 })

  const game = games[0]
  const date = new Date(game.release_date).toISOString().split('T')[0].replace(/-/g, '')

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//vanx-i//ES
BEGIN:VEVENT
UID:vanxi-${game.id}@vanx-i.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${date}
DTEND;VALUE=DATE:${date}
SUMMARY:🎮 ${game.name} - Lanzamiento
DESCRIPTION:${game.name} sale hoy. Más info en https://vanx-i.app/game/${game.id}
URL:https://vanx-i.app/game/${game.id}
END:VEVENT
END:VCALENDAR`

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${game.name}.ics"`
    }
  })
}