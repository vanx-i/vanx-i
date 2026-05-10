import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Header from './Header'
import Banner from './Banner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'vanx-i | Calendario de videojuegos',
  description: 'Tu calendario personalizado de lanzamientos de videojuegos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'vanx-i',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header />
          <Banner />
          {children}
          {/* Buy Me a Coffee */}
          
            <a href="https://www.buymeacoffee.com/vanxi"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 hover:scale-105 transition-transform shadow-2xl shadow-black/50 rounded-xl overflow-hidden">
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Mantén vanx-i vivo&emoji=&slug=vanxi&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff"
              alt="Buy Me A Coffee"
            />
          </a>
        </body>
      </html>
    </ClerkProvider>
  )
}