'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Upload, Calendar, Music, ArrowRight, ArrowLeft, Save, Eye } from 'lucide-react'
import confetti from 'canvas-confetti'
import MediaUploader from '@/components/MediaUploader'
import MusicPlayer from '@/components/MusicPlayer'
import Countdown from '@/components/Countdown'

interface FormData {
  title: string
  partnerName: string
  startDate: string
  description: string
  eventDate: string
  eventTitle: string
  backgroundColor: string
  textColor: string
}

export default function CreateMemoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    partnerName: '',
    startDate: '',
    description: '',
    eventDate: '',
    eventTitle: '',
    backgroundColor: '#fdf2f8',
    textColor: '#374151'
  })
  
  const [photos, setPhotos] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [musicUrl, setMusicUrl] = useState('')
  const [musicName, setMusicName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const uploadFile = async (file: File, type: 'photo' | 'video' | 'music') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Erro no upload')
    }

    return response.json()
  }

  const handlePhotoUpload = async (files: File[]) => {
    setIsLoading(true)
    try {
      const uploadPromises = files.map(file => uploadFile(file, 'photo'))
      const results = await Promise.all(uploadPromises)
      const urls = results.map(result => result.url)
      setPhotos(prev => [...prev, ...urls])
    } catch (error) {
      setError('Erro ao fazer upload das fotos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoUpload = async (files: File[]) => {
    setIsLoading(true)
    try {
      const uploadPromises = files.map(file => uploadFile(file, 'video'))
      const results = await Promise.all(uploadPromises)
      const urls = results.map(result => result.url)
      setVideos(prev => [...prev, ...urls])
    } catch (error) {
      setError('Erro ao fazer upload dos vídeos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMusicUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const result = await uploadFile(file, 'music')
      setMusicUrl(result.url)
      setMusicName(result.filename)
    } catch (error) {
      setError('Erro ao fazer upload da música')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.partnerName || !formData.startDate) {
      setError('Por favor, preencha os campos obrigatórios')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos,
          videos,
          musicUrl,
          musicName,
          isPublic: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Mostrar confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        // Redirecionar para a memória criada
        setTimeout(() => {
          router.push(`/memoria/${data.memory.shareUrl}`)
        }, 2000)
      } else {
        setError(data.error || 'Erro ao salvar memória')
      }
    } catch (error) {
      setError('Erro ao salvar memória')
    } finally {
      setIsSaving(false)
    }
  }

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
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-pink-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-pink-500 mr-3" fill="currentColor" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Criar Nova Memória
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Passo {step} de 4</span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-pink-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Informações Básicas</h2>
                <p className="text-gray-600">Vamos começar com o básico da sua história de amor</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Memória *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nossa História de Amor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do seu Amor *
                  </label>
                  <input
                    type="text"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    placeholder="Nome da pessoa especial"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quando começou nossa história? *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conte um pouco da nossa história
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Escreva sobre como vocês se conheceram, momentos especiais..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.partnerName || !formData.startDate}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-pink-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Fotos e Vídeos</h2>
                <p className="text-gray-600">Adicione as memórias visuais que vocês compartilharam</p>
              </div>

              <MediaUploader
                photos={photos}
                videos={videos}
                onFileUpload={async (files: File[]) => {
                  const photoFiles = files.filter((file: File) => file.type.startsWith('image/'))
                  const videoFiles = files.filter((file: File) => file.type.startsWith('video/'))
                  
                  if (photoFiles.length > 0) {
                    await handlePhotoUpload(photoFiles)
                  }
                  if (videoFiles.length > 0) {
                    await handleVideoUpload(videoFiles)
                  }
                }}
                isLoading={isLoading}
                maxFiles={7}
              />

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center"
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-pink-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Música e Eventos Especiais</h2>
                <p className="text-gray-600">Adicione a trilha sonora do seu amor e datas importantes</p>
              </div>

              <div className="space-y-8">
                {/* Upload de Música */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Nossa música especial
                  </label>
                  
                  {musicUrl ? (
                    <MusicPlayer audioUrl={musicUrl} className="mb-4" />
                  ) : (
                    <div className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center">
                      <Music className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Adicione a música que representa o amor de vocês</p>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleMusicUpload(file)
                        }}
                        className="hidden"
                        id="music-upload"
                      />
                      <label
                        htmlFor="music-upload"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-all inline-flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Escolher Música
                      </label>
                    </div>
                  )}
                </div>

                {/* Evento Especial */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Evento especial (opcional)
                  </label>
                  
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleInputChange}
                    placeholder="Ex: Nosso Casamento, Aniversário de Namoro..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />

                  {formData.eventDate && (
                    <div className="mt-4">
                      <Countdown
                        targetDate={new Date(formData.eventDate)}
                        title={formData.eventTitle || 'Evento Especial'}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all flex items-center"
                >
                  Próximo <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-pink-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Personalização</h2>
                <p className="text-gray-600">Deixe sua memória com a sua cara</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Cor de fundo
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      '#fdf2f8', // rosa claro
                      '#f3e8ff', // roxo claro
                      '#dbeafe', // azul claro
                      '#d1fae5', // verde claro
                      '#fef3c7', // amarelo claro
                      '#fed7e2', // rosa
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, backgroundColor: color }))}
                        className={`w-full h-12 rounded-lg border-4 transition-all ${
                          formData.backgroundColor === color ? 'border-pink-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Cor do texto
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      '#374151', // cinza escuro
                      '#1f2937', // cinza mais escuro
                      '#7c2d12', // marrom
                      '#4c1d95', // roxo escuro
                    ].map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData(prev => ({ ...prev, textColor: color }))}
                        className={`w-full h-12 rounded-lg border-4 transition-all ${
                          formData.textColor === color ? 'border-pink-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div 
                  className="p-6 rounded-xl border-2 border-pink-200"
                  style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}
                >
                  <h3 className="text-2xl font-bold mb-2">{formData.title || 'Título da Memória'}</h3>
                  <p className="text-lg">Para {formData.partnerName || 'Seu Amor'}</p>
                  <p className="mt-2 opacity-80">
                    {formData.description || 'Sua linda descrição aparecerá aqui...'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Memória
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}