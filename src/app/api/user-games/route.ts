import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { gameId, userEmail, userName } = await request.json()

    // Buscar o crear usuario en nuestra BD
    const users = await sql`
      SELECT id FROM users WHERE clerk_id = ${userId}
    `

    let dbUserId: number

    if (users.length === 0) {
      const newUser = await sql`
        INSERT INTO users (clerk_id, email, name)
        VALUES (${userId}, ${userEmail || userId}, ${userName || userId})
        RETURNING id
      `
      dbUserId = newUser[0].id
    } else {
      await sql`
        UPDATE users SET email = ${userEmail || userId}, name = ${userName || userId}
        WHERE clerk_id = ${userId}
      `
      dbUserId = users[0].id
    }

    // Comprobar si ya está marcado
    const existing = await sql`
      SELECT id FROM user_games 
      WHERE user_id = ${dbUserId} AND game_id = ${gameId}
    `

    if (existing.length > 0) {
      // Si ya existe, lo eliminamos (toggle)
      await sql`
        DELETE FROM user_games 
        WHERE user_id = ${dbUserId} AND game_id = ${gameId}
      `
      return NextResponse.json({ status: 'removed' })
    }

    // Si no existe, lo añadimos
    await sql`
      INSERT INTO user_games (user_id, game_id, status)
      VALUES (${dbUserId}, ${gameId}, 'interested')
    `

    return NextResponse.json({ status: 'added' })
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json({ error: 'Error guardando juego' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json([])
    }

    const games = await sql`
      SELECT ug.game_id FROM user_games ug
      JOIN users u ON u.id = ug.user_id
      WHERE u.clerk_id = ${userId}
    `

    return NextResponse.json(games.map((g: Record<string, any>) => g.game_id))
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json([])
  }
}