import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen text-white flex items-center justify-center px-4" style={{backgroundColor: '#0a0a1a'}}>
      <div className="text-center max-w-lg mx-auto">
        <div className="text-8xl mb-6">🎮</div>
        <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          Nivel no encontrado
        </h2>
        <p className="text-gray-400 mb-8">
          Esta página no existe o fue eliminada. Puede que el juego que buscas aún no haya salido.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/calendar"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors"
          >
            Ver calendario
          </Link>
        </div>
      </div>
    </main>
  )
}