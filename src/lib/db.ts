import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY,
      igdb_id INTEGER UNIQUE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      platforms TEXT[],
      release_date DATE,
      cover_url VARCHAR(500),
      summary TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      hypes INTEGER DEFAULT 0
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      clerk_id VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      platforms TEXT[],
      notify_by_email BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS user_games (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'interested',
      notified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, game_id)
    )
  `
}

export { sql }