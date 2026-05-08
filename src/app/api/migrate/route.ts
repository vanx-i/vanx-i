import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sql`ALTER TABLE games ADD COLUMN IF NOT EXISTS hypes INTEGER DEFAULT 0`
    await sql`ALTER TABLE games ADD COLUMN IF NOT EXISTS follows INTEGER DEFAULT 0`
    await sql`ALTER TABLE games ADD COLUMN IF NOT EXISTS rating NUMERIC(4,1) DEFAULT 0`
    await sql`ALTER TABLE games ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0`
    return NextResponse.json({ message: 'Migración completada correctamente' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
  }
}