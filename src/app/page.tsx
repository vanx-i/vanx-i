export default function Home() {
  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#0a0a1a'}}>

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <img src="/hero-banner.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a1a]" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <img src="/icon-192.png" alt="vanx-i logo" className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-2xl shadow-purple-500/50" />
          <h1 className="text-7xl sm:text-9xl font-black mb-4 leading-none tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">
            vanx-i
          </h1>
          <p className="text-xl sm:text-2xl font-bold mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            <span className="text-white">Tu calendario de lanzamientos de videojuegos.</span>
            <br />
            <span className="text-cyan-300">Sin ruido. Solo lo que te importa.</span>
          </p>
          <a href="/calendar" className="inline-block px-10 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50">
            Ver calendario →
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-24 max-w-6xl mx-auto">
        <div
          className="absolute inset-0 opacity-5 rounded-3xl"
          style={{backgroundImage: 'url(/halftone-bg.png)', backgroundSize: '300px'}}
        />

        <h2 className="text-4xl font-black text-center mb-16 text-white">
          Todo lo que necesitas.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Nada que no necesitas.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

          {/* Feature 1 - Calendario */}
          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <img src="/calendar-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="relative p-6 -mt-16">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-xl font-black mb-2 text-white">Calendario visual</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Todos los lanzamientos organizados por fecha, filtrados por plataforma y ordenados por hype</p>
            </div>
          </div>

          {/* Feature 2 - Notificaciones */}
          <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105">
            <img src="/notifications-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
            <div className="relative p-6 -mt-16">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="text-xl font-black mb-2 text-white">Notificaciones</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Recibe un email cuando sale un juego que tienes marcado como interesado</p>
            </div>
          </div>

          {/* Feature 3 - Agente */}
          <div className="group relative overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:scale-105">
            <img src="/agent-banner.png" alt="" className="w-full h-48 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            <div className="relative p-6">
              <h3 className="text-xl font-black mb-2 text-white">Siempre actualizado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Un agente automático mantiene el calendario al día con los últimos anuncios y conferencias</p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center pb-8 text-gray-600 text-sm border-t border-gray-900 pt-8">
        <img src="/icon-192.png" alt="" className="w-8 h-8 rounded-lg mx-auto mb-3 opacity-50" />
        vanx-i © 2026 · Hecho con 🎮 desde Zaragoza
      </footer>

    </main>
  )
}