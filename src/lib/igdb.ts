const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token'
const IGDB_URL = 'https://api.igdb.com/v4'

async function getTwitchToken(): Promise<string> {
  const response = await fetch(
    `${TWITCH_AUTH_URL}?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  const data = await response.json()
  return data.access_token
}

export async function getUpcomingGames() {
  const token = await getTwitchToken()
  const now = Math.floor(Date.now() / 1000)
  const sixMonthsLater = now + 60 * 60 * 24 * 180

  const response = await fetch(`${IGDB_URL}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: `
      fields name, summary, cover.url, first_release_date, genres.name, platforms.name, hypes, follows, rating, rating_count;
      where first_release_date > ${now}
        & first_release_date < ${sixMonthsLater}
        & platforms = (6,48,49,130,167,169);
      sort follows desc;
      limit 500;
    `
  })

  const games = await response.json()
  return games
}