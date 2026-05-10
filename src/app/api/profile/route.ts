import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    console.log('userId:', userId)
    if (!userId) return NextResponse.json(null)

    const users = await sql`
      SELECT username, bio, public_profile, avatar_url
      FROM users
      WHERE clerk_id = ${userId}
    `

    return NextResponse.json(users[0] || null)
  } catch (error) {
    return NextResponse.json(null)
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { username, bio, publicProfile, avatarUrl } = await request.json()

    // Validar username
    if (username && !/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      return NextResponse.json({ error: 'Username solo puede tener letras, números, - y _. Entre 3 y 20 caracteres.' }, { status: 400 })
    }

    await sql`
      UPDATE users SET
        username = ${username || null},
        bio = ${bio || null},
        public_profile = ${publicProfile},
        avatar_url = ${avatarUrl || null}
      WHERE clerk_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('unique')) {
        return NextResponse.json({ error: 'Ese username ya está en uso' }, { status: 400 })
      }
      console.error(error.message)
    }
    return NextResponse.json({ error: 'Error guardando perfil' }, { status: 500 })
  }
}

