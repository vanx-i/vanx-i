import type { Config } from "@netlify/functions"

export default async function handler() {
  const response = await fetch(`${process.env.URL}/api/notify-releases`)
  const data = await response.json()
  console.log('Notificaciones:', data)
}

export const config: Config = {
  schedule: "0 7 * * *"
}