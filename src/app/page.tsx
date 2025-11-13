'use client'

import { useState, useEffect } from 'react'
import { Heart, Music, Camera, Clock, Sparkles, Upload, Play, Pause, ArrowLeft, Share } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import MediaGallery from '@/components/MediaGallery'
import MusicPlayer from '@/components/MusicPlayer'
import Countdown from '@/components/Countdown'

interface Memory {
  id: string
  title: string
  message: string
  photos: File[]
  videos: File[]
  music?: File
  countdownDate?: Date
  specialDate: string
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [memory, setMemory] = useState<Memory>({
    id: '',
    title: '',
    message: '',
    photos: [],
    videos: [],
    specialDate: ''
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEmojiRain, setShowEmojiRain] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ff6347', '#ff4500']
    })
  }

  const triggerEmojiRain = () => {
    setShowEmojiRain(true)
    setTimeout(() => setShowEmojiRain(false), 5000)
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const photos: File[] = []
      const videos: File[] = []
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          photos.push(file)
        } else if (file.type.startsWith('video/')) {
          videos.push(file)
        }
      })
      
      setMemory(prev => ({
        ...prev,
        photos: [...prev.photos, ...photos].slice(0, 7),
        videos: [...prev.videos, ...videos].slice(0, 3)
      }))
      triggerConfetti()
    }
  }

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setMemory(prev => ({ ...prev, music: file }))
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      triggerConfetti()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Emoji Rain Effect */}
      {showEmojiRain && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="emoji-rain absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {['💕', '💖', '💝', '💗', '💓', '❤️', '🌹', '✨'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 text-2xl"
            initial={{ y: "100vh", x: Math.random() * 1200 }}
            animate={{ 
              y: "-100px", 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              rotate: 360 
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-500 mr-2 animate-pulse-heart" size={40} />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Memória do Amor
            </h1>
            <Heart className="text-pink-500 ml-2 animate-pulse-heart" size={40} />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie uma página digital única e emocionante para eternizar seus momentos especiais
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg' 
                      : 'bg-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step}
                </motion.div>
                {step < 4 && (
                  <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-pink-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200">
                <div className="text-center mb-8">
                  <Sparkles className="text-pink-500 mx-auto mb-4 animate-bounce-gentle" size={48} />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Informações Básicas</h2>
                  <p className="text-gray-600">Vamos começar com o título e mensagem especial</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Memória
                    </label>
                    <input
                      type="text"
                      value={memory.title}
                      onChange={(e) => setMemory(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Nosso Primeiro Encontro ❤️"
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem Especial
                    </label>
                    <textarea
                      value={memory.message}
                      onChange={(e) => setMemory(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Escreva uma mensagem carinhosa que toque o coração..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors resize-none text-gray-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Especial
                    </label>
                    <input
                      type="date"
                      value={memory.specialDate}
                      onChange={(e) => setMemory(prev => ({ ...prev, specialDate: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200">
                <div className="text-center mb-8">
                  <Camera className="text-pink-500 mx-auto mb-4 animate-bounce-gentle" size={48} />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Adicione Fotos e Vídeos</h2>
                  <p className="text-gray-600">Até 7 fotos e 3 vídeos para contar sua história (opcional)</p>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <Upload className="text-pink-400 mx-auto mb-4" size={48} />
                      <p className="text-gray-600">Clique para adicionar fotos e vídeos</p>
                      <div className="flex justify-center gap-4 text-sm text-gray-400 mt-2">
                        <span>{memory.photos.length}/7 fotos</span>
                        <span>{memory.videos.length}/3 vídeos</span>
                      </div>
                    </label>
                  </div>

                  {(memory.photos.length > 0 || memory.videos.length > 0) && (
                    <div className="space-y-4">
                      {memory.photos.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">📸 Fotos</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {memory.photos.map((photo, index) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="relative"
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt={`Foto ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg shadow-md"
                                />
                                <button
                                  onClick={() => setMemory(prev => ({
                                    ...prev,
                                    photos: prev.photos.filter((_, i) => i !== index)
                                  }))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  ×
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {memory.videos.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">🎥 Vídeos</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {memory.videos.map((video, index) => (
                              <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="relative"
                              >
                                <video
                                  src={URL.createObjectURL(video)}
                                  className="w-full h-32 object-cover rounded-lg shadow-md"
                                  controls
                                />
                                <button
                                  onClick={() => setMemory(prev => ({
                                    ...prev,
                                    videos: prev.videos.filter((_, i) => i !== index)
                                  }))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  ×
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Music */}
            {currentStep === 3 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200">
                <div className="text-center mb-8">
                  <Music className="text-pink-500 mx-auto mb-4 animate-bounce-gentle" size={48} />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Música de Fundo</h2>
                  <p className="text-gray-600">Aquela música que traz lembranças especiais (opcional)</p>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center hover:border-pink-500 transition-colors">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleMusicUpload}
                      className="hidden"
                      id="music-upload"
                    />
                    <label htmlFor="music-upload" className="cursor-pointer">
                      <Music className="text-pink-400 mx-auto mb-4" size={48} />
                      <p className="text-gray-600">
                        {memory.music ? `Música: ${memory.music.name}` : 'Clique para adicionar música'}
                      </p>
                    </label>
                  </div>

                  {memory.music && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-pink-50 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Music className="text-pink-500 mr-3" size={24} />
                        <div>
                          <p className="font-medium text-gray-800">{memory.music.name}</p>
                          <p className="text-sm text-gray-500">
                            {(memory.music.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Preview & Create */}
            {currentStep === 4 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200">
                <div className="text-center mb-8">
                  <Heart className="text-pink-500 mx-auto mb-4 animate-pulse-heart" size={48} />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Sua Memória Está Pronta!</h2>
                  <p className="text-gray-600">Visualize e finalize sua página do amor</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo da Memória</h3>
                    <div className="space-y-3">
                      <p><span className="font-medium">Título:</span> {memory.title || 'Não informado'}</p>
                      <p><span className="font-medium">Mensagem:</span> {memory.message || 'Não informada'}</p>
                      <p><span className="font-medium">Data Especial:</span> {memory.specialDate || 'Não informada'}</p>
                      <p><span className="font-medium">Fotos:</span> {memory.photos.length} adicionadas</p>
                      <p><span className="font-medium">Música:</span> {memory.music ? 'Adicionada' : 'Não adicionada'}</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => {
                      triggerConfetti()
                      triggerEmojiRain()
                      setMemory(prev => ({ ...prev, id: Date.now().toString() }))
                      setShowResult(true)
                      
                      // Simular interação para permitir autoplay de áudio
                      setTimeout(() => {
                        document.dispatchEvent(new Event('click', { bubbles: true }))
                        document.dispatchEvent(new Event('touchstart', { bubbles: true }))
                      }, 100)
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🚀 Criar Página do Amor
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <motion.button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-50'
            }`}
            whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
            whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
          >
            ← Anterior
          </motion.button>

          <motion.button
            onClick={nextStep}
            disabled={currentStep === 4}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              currentStep === 4
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
            }`}
            whileHover={currentStep < 4 ? { scale: 1.05 } : {}}
            whileTap={currentStep < 4 ? { scale: 0.95 } : {}}
          >
            {currentStep === 4 ? 'Finalizado ✓' : 'Próximo →'}
          </motion.button>
        </div>
      </div>

      {/* Página de Resultado da Memória */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-purple-200 z-50 overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #f3e8ff 75%, #e9d5ff 100%)'
            }}
            onAnimationComplete={() => {
              // Forçar ativação de áudio após a página carregar
              setTimeout(() => {
                // Simular cliques para ativar contexto de áudio
                ['click', 'touchstart', 'keydown'].forEach(eventType => {
                  const event = new Event(eventType, { bubbles: true })
                  document.dispatchEvent(event)
                })
                
                // Tentar reproduzir todos os áudios na página
                if (memory.music) {
                  const audioElements = document.querySelectorAll('audio')
                  audioElements.forEach(async audio => {
                    try {
                      audio.volume = 0.5
                      await audio.play()
                    } catch (error) {
                      console.log('Autoplay blocked:', error)
                    }
                  })
                }
              }, 800)
            }}
          >
            <div className="min-h-screen py-4 sm:py-8">
              <div className="container mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                  className="text-center mb-6 sm:mb-8"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-4 px-2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Heart className="text-rose-500 mr-2 drop-shadow-lg" size={36} />
                    </motion.div>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent text-center leading-tight">
                      {memory.title || 'Nossa Memória Especial'}
                    </h1>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -15, 15, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                      }}
                    >
                      <Heart className="text-rose-500 ml-2 drop-shadow-lg" size={36} />
                    </motion.div>
                  </div>
                  <motion.p 
                    className="text-lg sm:text-xl text-rose-600 max-w-2xl mx-auto font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ✨ Página criada com muito amor ❤️ ✨
                  </motion.p>
                </motion.div>

                {/* Mensagem Principal */}
                {memory.message && (
                  <motion.div
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-200 mb-6 sm:mb-8 max-w-4xl mx-auto relative overflow-hidden"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Decoração de fundo */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5">
                      <div className="absolute top-4 left-4 text-4xl">💖</div>
                      <div className="absolute top-8 right-6 text-3xl">✨</div>
                      <div className="absolute bottom-4 left-6 text-3xl">🌹</div>
                      <div className="absolute bottom-8 right-4 text-4xl">💕</div>
                    </div>
                    
                    <div className="text-center relative z-10">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Sparkles className="text-rose-500 mx-auto mb-4 drop-shadow-md" size={40} />
                      </motion.div>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium px-2">
                        {memory.message}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Galeria de Fotos e Vídeos */}
                {(memory.photos.length > 0 || memory.videos.length > 0) && (
                  <motion.div
                    className="mb-6 sm:mb-8 max-w-4xl mx-auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotateY: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Camera className="text-rose-500 mx-auto mb-2 drop-shadow-md" size={32} />
                      </motion.div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        📸🎥 Nossas Memórias 📸🎥
                      </h2>
                    </div>
                    <MediaGallery photos={memory.photos} videos={memory.videos} autoPlay={true} interval={3500} />
                  </motion.div>
                )}

                {/* Player de Música */}
                {memory.music && (
                  <motion.div
                    className="mb-8 max-w-2xl mx-auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-center mb-6">
                      <Music className="text-rose-500 mx-auto mb-2 animate-pulse" size={32} />
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">Nossa Música</h2>
                    </div>
                    <MusicPlayer audioFile={memory.music} autoPlay={true} />
                  </motion.div>
                )}

                {/* Countdown */}
                {memory.specialDate && (
                  <motion.div
                    className="mb-6 sm:mb-8 max-w-2xl mx-auto"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Clock className="text-rose-500 mx-auto mb-2 drop-shadow-md" size={32} />
                      </motion.div>
                      <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        ⏰ Tempo Juntos ⏰
                      </h2>
                      <p className="text-rose-600 font-medium mt-2">
                        💕 Desde {new Date(memory.specialDate).toLocaleDateString('pt-BR')} 💕
                      </p>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-rose-200">
                      <Countdown targetDate={new Date(memory.specialDate)} />
                    </div>
                  </motion.div>
                )}

                {/* Botões de Ação */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto px-4 pb-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    onClick={() => setShowResult(false)}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-4 bg-white/90 text-rose-600 border-2 border-rose-400 rounded-2xl font-semibold hover:bg-rose-50 transition-all duration-300 shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    ✏️ Voltar ao Editor
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: memory.title,
                          text: memory.message,
                          url: window.location.href,
                        })
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        alert('💕 Link copiado! Agora você pode compartilhar sua página do amor! ✨')
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 shadow-xl"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Share size={20} className="mr-2" />
                    💖 Compartilhar
                  </motion.button>
                </motion.div>

                {/* Floating Hearts e Emojis Românticos */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Corações grandes flutuantes */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={`heart-${i}`}
                      className="absolute text-rose-300/60 text-2xl sm:text-3xl drop-shadow-lg"
                      initial={{ 
                        y: "100vh", 
                        x: Math.random() * 1200,
                        opacity: 0
                      }}
                      animate={{ 
                        y: "-150px", 
                        x: [
                          Math.random() * 1200,
                          Math.random() * 1200 + 100,
                          Math.random() * 1200 - 100
                        ],
                        rotate: [0, 360, 720],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 12 + Math.random() * 8,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut"
                      }}
                    >
                      {['💖', '💕', '❤️', '💗', '💓'][Math.floor(Math.random() * 5)]}
                    </motion.div>
                  ))}

                  {/* Emojis românticos pequenos */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={`emoji-${i}`}
                      className="absolute text-pink-300/40 text-lg drop-shadow-md"
                      initial={{ 
                        y: "110vh", 
                        x: Math.random() * 1400,
                        scale: 0,
                        rotate: 0
                      }}
                      animate={{ 
                        y: "-120px", 
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth + 200 : 1400),
                        scale: [0, 1, 1, 0],
                        rotate: [0, 180, 360, 540],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: "linear"
                      }}
                    >
                      {['✨', '🌟', '⭐', '🌹', '🌺', '🌸', '💐', '🎀', '�', '🦋', '�', '☁️'][Math.floor(Math.random() * 12)]}
                    </motion.div>
                  ))}

                  {/* Corações pulsantes fixos */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={`pulse-${i}`}
                      className="absolute text-rose-200/30 text-4xl"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.6, 0.2],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    >
                      💕
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}