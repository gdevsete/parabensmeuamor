'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react'

interface MediaGalleryProps {
  photos: File[]
  videos: File[]
  className?: string
  autoPlay?: boolean
  interval?: number
}

export default function MediaGallery({ photos, videos, className = '', autoPlay = false, interval = 4000 }: MediaGalleryProps) {
  const allMedia = [...photos.map(f => ({ file: f, type: 'image' as const })), ...videos.map(f => ({ file: f, type: 'video' as const }))]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length)
    setVideoPlaying(false)
  }

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
    setVideoPlaying(false)
  }

  // Auto advance only for images (pause on videos)
  useEffect(() => {
    if (autoPlay && allMedia.length > 1) {
      const currentMedia = allMedia[currentIndex]
      if (currentMedia?.type === 'image') {
        const timer = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % allMedia.length)
        }, interval)
        return () => clearInterval(timer)
      }
    }
  }, [autoPlay, allMedia.length, currentIndex, interval])

  // Reset current index if media changes
  useEffect(() => {
    if (currentIndex >= allMedia.length) {
      setCurrentIndex(0)
    }
  }, [allMedia.length, currentIndex])

  if (allMedia.length === 0) {
    return null
  }

  const currentMedia = allMedia[currentIndex]

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {currentMedia.type === 'image' ? (
              <img
                src={URL.createObjectURL(currentMedia.file)}
                alt={`Memória ${currentIndex + 1}`}
                className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setIsFullscreen(true)}
              />
            ) : (
              <video
                src={URL.createObjectURL(currentMedia.file)}
                className="w-full h-full object-contain cursor-pointer"
                controls={!isFullscreen}
                onClick={() => setIsFullscreen(true)}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {allMedia.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all shadow-lg z-10"
            >
              <ChevronLeft className="text-gray-700" size={20} />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white/90 transition-all shadow-lg z-10"
            >
              <ChevronRight className="text-gray-700" size={20} />
            </button>
          </>
        )}

        {/* Indicators */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setVideoPlaying(false)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}

        {/* Media type indicator */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 z-10">
          <span className="text-white text-sm font-medium">
            {currentMedia.type === 'image' ? '📸' : '🎥'} {currentIndex + 1}/{allMedia.length}
          </span>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all z-60"
            >
              <X className="text-white" size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {currentMedia.type === 'image' ? (
                <img
                  src={URL.createObjectURL(currentMedia.file)}
                  alt={`Memória ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <video
                  src={URL.createObjectURL(currentMedia.file)}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  controls
                  autoPlay
                />
              )}
            </motion.div>

            {allMedia.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevMedia()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextMedia()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>

                {/* Fullscreen Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {allMedia.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(index)
                        setVideoPlaying(false)
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-white scale-125 shadow-lg'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}