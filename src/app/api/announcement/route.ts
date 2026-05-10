import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const announcements = await sql`
      SELECT * FROM announcements 
      WHERE active = true 
      ORDER BY created_at DESC 
      LIMIT 1
    `
    return NextResponse.json(announcements[0] || null, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    return NextResponse.json(null)
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { message, active } = await request.json()

    // Desactivar todos los anteriores
    await sql`UPDATE announcements SET active = false`

    if (message && active) {
      await sql`
        INSERT INTO announcements (message, active)
        VALUES (${message}, true)
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}