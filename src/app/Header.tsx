'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Header() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  return (
    <header className="flex justify-end items-center px-6 py-4 gap-4 bg-gray-950 border-b border-gray-800">
      <a href="/" className="flex items-center gap-2 mr-auto hover:opacity-80 transition-opacity">
        <img src="/icon-192.png" alt="vanx-i" className="w-8 h-8 rounded-lg" />
        <span className="text-purple-400 font-bold text-lg">vanx-i</span>
      </a>
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <a href="/calendar" className="text-gray-400 hover:text-white transition-colors text-sm">
            Calendario
          </a>
          <a href="/profile" className="text-gray-400 hover:text-white transition-colors text-sm">
            Mi perfil
          </a>
          <UserButton />
        </div>
      ) : (
        <>
          <a href="/calendar" className="text-gray-400 hover:text-white transition-colors text-sm">
            Calendario
          </a>
          <SignInButton mode="modal">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">
              Iniciar sesión
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-sm font-medium transition-colors">
              Registrarse
            </button>
          </SignUpButton>
        </>
      )}
    </header>
  )
}