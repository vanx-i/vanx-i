export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-6xl mb-6">🎮</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          vanx-i
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Tu calendario personalizado de lanzamientos de videojuegos. Sin ruido. Solo lo que te importa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors">
            Crear cuenta gratis
          </a>
          <a href="/calendar" className="px-8 py-3 border border-gray-700 hover:border-purple-500 rounded-xl font-semibold transition-colors">
            Ver calendario
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-semibold mb-2">Calendario visual</h3>
          <p className="text-gray-400 text-sm">Todos los lanzamientos organizados por fecha</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🔔</div>
          <h3 className="font-semibold mb-2">Notificaciones</h3>
          <p className="text-gray-400 text-sm">Recibe un email cuando sale un juego que te interesa</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold mb-2">Actualización automática</h3>
          <p className="text-gray-400 text-sm">Un agente mantiene el calendario al día solo</p>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-20 text-gray-600 text-sm">
        vanx-i © 2026 · Hecho con 🎮 y mucho café
      </p>
    </main>
  )
}