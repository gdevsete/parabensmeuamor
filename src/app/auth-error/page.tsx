'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Erro de Autenticação
          </h1>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro durante a autenticação:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <code className="text-red-800">
              {error || 'Erro desconhecido'}
            </code>
          </div>
          <a 
            href="/login" 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Voltar ao Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Carregando...
            </h1>
          </div>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}