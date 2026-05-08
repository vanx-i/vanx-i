import { initDB } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await initDB()
    return NextResponse.json({ message: 'Base de datos inicializada correctamente' })
  } catch (error) {
    console.error('Error inicializando DB:', error)
    return NextResponse.json({ error: 'Error inicializando la base de datos' }, { status: 500 })
  }
}