import type { Config } from "@netlify/functions"

export default async function handler() {
  const response = await fetch(`${process.env.URL}/api/sync-games`)
  const data = await response.json()
  console.log('Sync:', data)
}

export const config: Config = {
  schedule: "0 1 * * *"
}