'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Eye, Share2, Edit, Trash2, Calendar, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface Memory {
  id: string
  title: string
  partnerName: string
  startDate: string
  description?: string
  photos: string[]
  videos: string[]
  musicUrl?: string
  musicName?: string
  shareUrl?: string
  viewCount: number
  createdAt: string
  isPublic: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchMemories()
    }
  }, [status, router])

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories')
      const data = await response.json()

      if (response.ok) {
        setMemories(data.memories)
      } else {
        setError(data.error || 'Erro ao carregar memórias')
      }
    } catch (error) {
      setError('Erro ao carregar memórias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  const copyShareUrl = (shareUrl: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/memoria/${shareUrl}`)
    // Você pode adicionar um toast aqui
  }

  if (status === 'loading' || isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-pink-500 mr-3" fill="currentColor" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Memórias do Amor
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{session?.user?.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {session?.user?.name?.split(' ')[0]}! 💕
          </h2>
          <p className="text-gray-600">
            Suas memórias românticas estão aqui. Crie novas ou gerencie as existentes.
          </p>
        </div>

        {/* Criar Nova Memória */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/criar">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Criar Nova Memória</h3>
                  <p className="opacity-90">
                    Compartilhe momentos especiais com quem você ama
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  <Plus className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Lista de Memórias */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {memories.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma memória criada ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Que tal criar sua primeira memória romântica?
            </p>
            <Link href="/criar">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all">
                Criar Primeira Memória
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                {/* Preview da primeira foto */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                  {memory.photos.length > 0 ? (
                    <img
                      src={memory.photos[0]}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Heart className="w-12 h-12 text-pink-300" fill="currentColor" />
                    </div>
                  )}
                  
                  {/* Badge de visualizações */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {memory.viewCount}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                    {memory.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    <span>{memory.partnerName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(memory.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {memory.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {memory.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{memory.photos.length} fotos</span>
                    <span>{memory.videos.length} vídeos</span>
                    {memory.musicUrl && <span>🎵</span>}
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-2">
                    <Link href={`/memoria/${memory.shareUrl}`} className="flex-1">
                      <button className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => copyShareUrl(memory.shareUrl || '')}
                      className="flex-1 bg-pink-100 text-pink-700 px-3 py-2 rounded-lg text-sm hover:bg-pink-200 transition-colors flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}