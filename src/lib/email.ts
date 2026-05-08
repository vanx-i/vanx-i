import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendGameReleaseEmail(
  userEmail: string,
  userName: string,
  gameName: string,
  gameDate: string,
  coverUrl: string | null,
  category: string
) {
  await resend.emails.send({
    from: 'vanx-i <onboarding@resend.dev>',
    to: userEmail,
    subject: `🎮 ¡Hoy sale ${gameName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0a1a; color: white; border-radius: 16px; overflow: hidden;">
        
        <div style="background: linear-gradient(135deg, #7c3aed, #06b6d4); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; color: white;">🎮 vanx-i</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Tu calendario de lanzamientos</p>
        </div>

        <div style="padding: 32px;">
          <p style="color: #a78bfa; font-size: 14px; margin: 0 0 8px;">¡HOY ES EL DÍA!</p>
          <h2 style="color: white; font-size: 24px; margin: 0 0 16px;">${gameName}</h2>
          
          ${coverUrl ? `
            <img 
              src="https:${coverUrl}" 
              alt="${gameName}"
              style="width: 120px; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 16px;"
            />
          ` : ''}

          <div style="background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #e2e8f0; font-size: 14px;">📅 Fecha de lanzamiento: <strong>${gameDate}</strong></p>
            <p style="margin: 8px 0 0; color: #e2e8f0; font-size: 14px;">🎯 Categoría: <strong>${category}</strong></p>
          </div>

          <p style="color: #9ca3af; font-size: 14px;">
            Marcaste este juego como interesado en vanx-i. ¡Que lo disfrutes!
          </p>

          <a 
            href="https://vanx-i.netlify.app/calendar"
            style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px;"
          >
            Ver calendario →
          </a>
        </div>

        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <p style="color: #4b5563; font-size: 12px; margin: 0;">vanx-i © 2026 · Hecho con 🎮 desde Zaragoza</p>
        </div>

      </div>
    `
  })
}