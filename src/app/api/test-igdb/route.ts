import { NextResponse } from 'next/server'

export async function GET() {
  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  const tokenData = await tokenRes.json()

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: `
      fields name, hypes, follows;
      where hypes > 0;
      sort hypes desc;
      limit 10;
    `
  })

  const data = await response.json()
  return NextResponse.json(data)
}