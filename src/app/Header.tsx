'use client'

import { useAuth } from '@clerk/nextjs'
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Header() {
  const { isSignedIn } = useAuth()

  return (
    <header className="flex justify-end items-center px-6 py-4 gap-4 bg-gray-950 border-b border-gray-800">
      <span className="text-purple-400 font-bold text-lg mr-auto">vanx-i</span>
      {!isSignedIn ? (
        <>
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
      ) : (
        <UserButton />
      )}
    </header>
  )
}