'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

interface MusicPlayerProps {
  audioFile?: File
  audioUrl?: string
  className?: string
  autoPlay?: boolean
}

export default function MusicPlayer({ audioFile, audioUrl, className = '', autoPlay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showAutoplayHint, setShowAutoplayHint] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [finalAudioUrl, setFinalAudioUrl] = useState<string>('')

  // Função para tentar reproduzir áudio (usando useCallback para evitar re-renderizações)
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      // Garantir que o áudio está carregado
      if (audio.readyState < 2) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 5000)
          audio.addEventListener('canplay', () => {
            clearTimeout(timeout)
            resolve(undefined)
          }, { once: true })
          audio.load() // Forçar carregamento
        })
      }
      
      // Tentar diferentes configurações
      audio.volume = 0.5
      audio.muted = false
      
      const playPromise = audio.play()
      if (playPromise) {
        await playPromise
        setIsPlaying(true)
        setShowAutoplayHint(false)
        setUserInteracted(true)
      }
    } catch (error) {
      console.log('Autoplay prevented:', error)
      setShowAutoplayHint(true)
      setIsPlaying(false)
      
      // Tentar novamente após um tempo
      setTimeout(() => {
        if (!isPlaying && audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true)
            setShowAutoplayHint(false)
          }).catch(() => {
            // Falha silenciosa
          })
        }
      }, 2000)
    }
  }, [isPlaying])

  // Criar URL do áudio
  useEffect(() => {
    if (audioUrl) {
      setFinalAudioUrl(audioUrl)
    } else if (audioFile) {
      const url = URL.createObjectURL(audioFile)
      setFinalAudioUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [audioFile, audioUrl])

  // Configurar áudio e eventos
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !finalAudioUrl) return

    const setAudioData = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
      setCurrentTime(audio.currentTime)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)
    
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('canplay', setAudioData)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    // Configurar áudio para melhor compatibilidade
    audio.preload = 'auto'
    audio.volume = 0.7

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('canplay', setAudioData)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [finalAudioUrl])

  // Gerenciar interação do usuário e autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true)
      if (autoPlay && audioRef.current && !isPlaying) {
        attemptPlay()
      }
    }

    // Múltiplos eventos para capturar interação
    const events = ['click', 'touchstart', 'keydown', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [autoPlay, isPlaying, attemptPlay])

  // Tentar autoplay assim que possível
  useEffect(() => {
    if (autoPlay && finalAudioUrl && userInteracted && !isPlaying) {
      const timer = setTimeout(() => {
        attemptPlay()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, finalAudioUrl, userInteracted, isPlaying, attemptPlay])

  // Tentar autoplay imediato (pode falhar devido a políticas do browser)
  useEffect(() => {
    if (autoPlay && finalAudioUrl) {
      const timer = setTimeout(async () => {
        const audio = audioRef.current
        if (audio && !isPlaying) {
          try {
            // Definir volume baixo inicialmente para tentar passar pelas restrições
            audio.volume = 0.1
            await audio.play()
            // Se conseguiu tocar, aumentar volume gradualmente
            const volumeInterval = setInterval(() => {
              if (audio.volume < 0.7) {
                audio.volume = Math.min(audio.volume + 0.1, 0.7)
              } else {
                clearInterval(volumeInterval)
              }
            }, 100)
            setIsPlaying(true)
            setUserInteracted(true)
          } catch (error) {
            // Se falhar, mostrar a dica
            setShowAutoplayHint(true)
          }
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, finalAudioUrl])

  const togglePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) return

    setUserInteracted(true)
    setShowAutoplayHint(false)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Play failed:', error)
        setIsPlaying(false)
      }
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  // Se não há áudio, não renderizar nada
  if (!finalAudioUrl && !audioFile && !audioUrl) {
    return null
  }

  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-2 border-rose-200 relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Decoração de fundo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-2 left-4 text-2xl">🎵</div>
        <div className="absolute bottom-2 right-4 text-2xl">🎶</div>
      </div>

      <audio
        ref={audioRef}
        src={finalAudioUrl}
        preload="auto"
        crossOrigin="anonymous"
      />

      {/* Banner de Ativação de Som */}
      {(!userInteracted || (!isPlaying && finalAudioUrl)) && (
        <motion.div
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl cursor-pointer border-2 border-white/20"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0 0 rgba(168, 85, 247, 0.4)",
                "0 0 0 10px rgba(168, 85, 247, 0)",
                "0 0 0 0 rgba(168, 85, 247, 0)"
              ]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              boxShadow: { duration: 2, repeat: Infinity }
            }}
            onClick={async () => {
              setUserInteracted(true)
              const audio = audioRef.current
              if (audio) {
                try {
                  audio.volume = 0.6
                  await audio.play()
                  setIsPlaying(true)
                  setShowAutoplayHint(false)
                } catch (error) {
                  console.log('Manual play failed:', error)
                }
              }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🔊</span>
              <span>CLIQUE PARA ATIVAR O SOM</span>
              <span className="text-xl">🎵</span>
            </div>
            <div className="text-xs opacity-80 mt-1">Toque aqui para ouvir nossa música!</div>
          </motion.button>
        </motion.div>
      )}

      {/* Dica de Reprodução */}
      {showAutoplayHint && !isPlaying && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          🎵 Clique para tocar a música!
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
        <motion.button
          onClick={togglePlayPause}
          className={`bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg relative ${
            showAutoplayHint && !isPlaying ? 'animate-bounce' : ''
          }`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          animate={isPlaying ? { 
            boxShadow: ["0 0 0 0 rgba(244, 114, 182, 0.7)", "0 0 0 10px rgba(244, 114, 182, 0)", "0 0 0 0 rgba(244, 114, 182, 0)"]
          } : showAutoplayHint ? {
            scale: [1, 1.1, 1],
            boxShadow: ["0 0 0 0 rgba(244, 114, 182, 0.7)", "0 0 0 8px rgba(244, 114, 182, 0)", "0 0 0 0 rgba(244, 114, 182, 0)"]
          } : {}}
          transition={isPlaying ? { duration: 1.5, repeat: Infinity } : showAutoplayHint ? { duration: 2, repeat: Infinity } : {}}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          
          {/* Indicador de autoplay */}
          {showAutoplayHint && !isPlaying && (
            <motion.div
              className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              !
            </motion.div>
          )}
        </motion.button>

        <div className="flex-1 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-rose-600 mb-2 space-y-1 sm:space-y-0">
            <span className="font-medium truncate max-w-full sm:max-w-xs text-center sm:text-left">
              🎵 {audioFile?.name ? (audioFile.name.length > 30 ? audioFile.name.substring(0, 30) + '...' : audioFile.name) : 'Nossa Música Especial'}
            </span>
            <span className="font-mono text-xs bg-rose-100 px-2 py-1 rounded-full">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="relative bg-rose-100 rounded-full p-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-3 bg-transparent rounded-lg appearance-none cursor-pointer slider"
            />
            <motion.div
              className="absolute top-1 left-1 h-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full pointer-events-none shadow-md"
              style={{ width: `${progress}%` }}
              animate={{ 
                boxShadow: isPlaying ? [
                  "0 0 0 rgba(244, 114, 182, 0)",
                  "0 0 8px rgba(244, 114, 182, 0.6)",
                  "0 0 0 rgba(244, 114, 182, 0)"
                ] : "0 0 0 rgba(244, 114, 182, 0)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        <motion.button
          onClick={toggleMute}
          className="text-rose-500 hover:text-rose-600 transition-colors p-3 rounded-full bg-rose-50 hover:bg-rose-100"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f43f5e, #ec4899);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(244, 63, 94, 0.6);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f43f5e, #ec4899);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(244, 63, 94, 0.4);
        }
      `}</style>
    </motion.div>
  )
}