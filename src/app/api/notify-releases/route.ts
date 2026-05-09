import { sql } from '@/lib/db'
import { sendGameReleaseEmail, sendGameReminderEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const releases = await sql`
      SELECT 
        g.id as game_id,
        g.name as game_name,
        g.cover_url,
        g.category,
        g.release_date,
        u.email as user_email,
        u.name as user_name,
        ug.id as user_game_id
      FROM games g
      JOIN user_games ug ON ug.game_id = g.id
      JOIN users u ON u.id = ug.user_id
      WHERE DATE(g.release_date) = ${today}
        AND ug.notified = false
        AND ug.status = 'interested'
    `

    const reminders = await sql`
      SELECT 
        g.id as game_id,
        g.name as game_name,
        g.cover_url,
        g.category,
        g.release_date,
        u.email as user_email,
        u.name as user_name,
        ug.id as user_game_id,
        ug.notify_days_before
      FROM games g
      JOIN user_games ug ON ug.game_id = g.id
      JOIN users u ON u.id = ug.user_id
      WHERE DATE(g.release_date) = CURRENT_DATE + ug.notify_days_before * INTERVAL '1 day'
        AND ug.status = 'interested'
        AND ug.notified = false
    `

    let notified = 0

    for (const release of releases) {
      try {
        await sendGameReleaseEmail(
          release.user_email,
          release.user_name,
          release.game_name,
          new Date(release.release_date).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
          release.cover_url,
          release.category,
          release.game_id
        )
        await sql`UPDATE user_games SET notified = true WHERE id = ${release.user_game_id}`
        notified++
      } catch (emailError) {
        console.error(`Error enviando email a ${release.user_email}:`, emailError)
      }
    }

    for (const reminder of reminders) {
      try {
        await sendGameReminderEmail(
          reminder.user_email,
          reminder.user_name,
          reminder.game_name,
          new Date(reminder.release_date).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
          reminder.cover_url,
          reminder.category,
          reminder.notify_days_before,
          reminder.game_id
        )
        notified++
      } catch (emailError) {
        console.error(`Error enviando recordatorio a ${reminder.user_email}:`, emailError)
      }
    }

    return NextResponse.json({ message: `${notified} notificaciones enviadas` })
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return NextResponse.json({ error: 'Error enviando notificaciones' }, { status: 500 })
  }
}