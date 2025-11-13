'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import LZString from 'lz-string'
import MediaGallery from '@/components/MediaGallery'
import MusicPlayer from '@/components/MusicPlayer'
import Countdown from '@/components/Countdown'
import QRCodeGenerator from '@/components/QRCodeGenerator'

interface Memory {
  id: string
  title: string
  message: string
  photos: string[] // URLs das fotos
  videos: string[] // URLs dos vídeos  
  music?: string // URL da música
  specialDate: string
  createdAt: string
}

export default function MemoriaPage() {
  const params = useParams()
  const memoryId = params.id as string
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [showQRCode, setShowQRCode] = useState(false)

  useEffect(() => {
    const fetchMemory = async () => {
      if (typeof window !== 'undefined') {
        // Primeiro, tentar buscar dados da URL
        const urlParams = new URLSearchParams(window.location.search)
        const compressedData = urlParams.get('data')
        
        if (compressedData) {
          try {
            // Descomprimir dados da URL
            const decodedData = LZString.decompressFromEncodedURIComponent(compressedData)
            if (decodedData) {
              const memoryData: Memory = JSON.parse(decodedData)
              setMemory(memoryData)
              setLoading(false)
              return
            }
          } catch (error) {
            console.error('Erro ao descomprimir dados da URL:', error)
          }
        }

        // Se não encontrou na URL, buscar no banco de dados
        try {
          const response = await fetch(`/api/memories/${memoryId}`)
          if (response.ok) {
            const memoryData = await response.json()
            setMemory(memoryData)
            setLoading(false)
            return
          }
        } catch (error) {
          console.error('Erro ao buscar memória na API:', error)
        }

        // Fallback: buscar no localStorage
        try {
          const savedMemories = localStorage.getItem('memories')
          if (savedMemories) {
            const memories: Memory[] = JSON.parse(savedMemories)
            const foundMemory = memories.find(m => m.id === memoryId)
            if (foundMemory) {
              setMemory(foundMemory)
            }
          }
        } catch (error) {
          console.error('Erro ao acessar localStorage:', error)
        }
      }
      setLoading(false)
    }

    fetchMemory()
  }, [memoryId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua memória do amor...</p>
        </motion.div>
      </div>
    )
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Heart className="text-pink-400 mx-auto mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Memória não encontrada</h1>
          <p className="text-gray-600 mb-6">Esta memória pode ter expirado ou o link está incorreto.</p>
          <Link href="/">
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Criar Nova Memória
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 text-2xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50 
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* Header com botão voltar */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Voltar</span>
            </motion.button>
          </Link>

          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowQRCode(true)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:bg-white/90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={20} />
              <span className="font-medium">QR Code</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Conteúdo da Memória */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Título e Mensagem */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-6">
              {memory.title}
            </h1>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200 max-w-2xl mx-auto">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {memory.message}
              </p>
            </div>
          </motion.div>

          {/* Galeria de Fotos e Vídeos */}
          {(memory.photos.length > 0 || memory.videos.length > 0) && (
            <motion.div
              className="mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  📸🎥 Nossas Memórias 📸🎥
                </h2>
              </div>
              <MediaGallery 
                photos={memory.photos} 
                videos={memory.videos}
                autoPlay={true} 
                interval={3500} 
              />
            </motion.div>
          )}

          {/* Player de Música */}
          {memory.music && (
            <motion.div
              className="mb-8 max-w-2xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Nossa Música</h2>
              </div>
              <MusicPlayer audioUrl={memory.music} autoPlay={true} />
            </motion.div>
          )}

          {/* Countdown */}
          {memory.specialDate && (
            <motion.div
              className="mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Countdown targetDate={new Date(memory.specialDate)} />
            </motion.div>
          )}

          {/* Data de Criação */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-500 text-sm">
              💕 Criado com amor em {new Date(memory.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQRCode && (
        <QRCodeGenerator 
          url={currentUrl}
          memoryTitle={memory.title}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  )
}