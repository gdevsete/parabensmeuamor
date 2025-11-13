'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, LogIn, UserPlus, Sparkles, Camera, Music, Calendar, Shield, Share2, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Decorações de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-md border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-pink-500 mr-3" fill="currentColor" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Memórias do Amor
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <motion.button
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </motion.button>
              </Link>
              
              <Link href="/register">
                <motion.button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-4 h-4 mr-2 inline" />
                  Criar Conta
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-8">
                <Heart className="w-10 h-10 text-white" fill="currentColor" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Eternize Seus
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent block">
                  Momentos Especiais
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Crie páginas digitais únicas e românticas para sua pessoa especial. 
                Com fotos, música, vídeos e animações emocionantes que durarão para sempre.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/register">
                  <motion.button
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-5 h-5 mr-2 inline" />
                    Começar Agora - Grátis
                  </motion.button>
                </Link>
                
                <Link href="/login">
                  <motion.button
                    className="bg-white/80 backdrop-blur-md text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white transition-all border border-gray-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Já tenho conta
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-pink-200">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Galeria de Momentos</h3>
                <p className="text-gray-600">
                  Adicione até 7 fotos e vídeos dos momentos mais especiais que vocês viveram juntos.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-purple-200">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Trilha Sonora</h3>
                <p className="text-gray-600">
                  Adicione a música que representa o amor de vocês para tocar automaticamente.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-indigo-200">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Datas Especiais</h3>
                <p className="text-gray-600">
                  Conte quantos dias estão juntos e crie contadores para eventos importantes.
                </p>
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-pink-200"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Por que escolher Memórias do Amor?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Seguro</h3>
                  <p className="text-gray-600">
                    Suas memórias são salvas com segurança e só você tem acesso.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fácil Compartilhar</h3>
                  <p className="text-gray-600">
                    Compartilhe com um link único ou QR code gerado automaticamente.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Super Rápido</h3>
                  <p className="text-gray-600">
                    Crie sua memória em poucos minutos com nossa interface intuitiva.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para criar sua primeira memória?
              </h2>
              <p className="text-xl text-pink-100 mb-8">
                Milhares de casais já eternizaram seus momentos especiais. Seja o próximo!
              </p>
              
              <Link href="/register">
                <motion.button
                  className="bg-white text-pink-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-50 transition-all shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-5 h-5 mr-2 inline" fill="currentColor" />
                  Criar Minha Memória
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}