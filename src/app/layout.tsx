import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Memória do Amor - Eternize Momentos Especiais',
  description: 'Crie uma página digital única e romântica para sua pessoa especial. Com fotos, música e animações emocionantes.',
  keywords: 'amor, romance, presente digital, memórias, fotos, música, relacionamento',
  authors: [{ name: 'Love Memory' }],
  openGraph: {
    title: 'Memória do Amor - Eternize Momentos Especiais',
    description: 'Crie uma página digital única e romântica para sua pessoa especial.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}