'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface PhotoGalleryProps {
  photos: (File | string)[]
  className?: string
  autoPlay?: boolean
  onPhotosChange?: (photos: string[]) => void
  onFileUpload?: (files: File[]) => void
  isLoading?: boolean
  maxFiles?: number
  interval?: number
}

export default function PhotoGallery({ photos, className = '', autoPlay = false, interval = 4000 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Auto advance photos
  useEffect(() => {
    if (autoPlay && photos.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length)
      }, interval)

      return () => clearInterval(timer)
    }
  }, [autoPlay, photos.length, interval])

  if (photos.length === 0) return null

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.div
          className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'linear-gradient(45deg, rgba(244, 114, 182, 0.1), rgba(168, 85, 247, 0.1))'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={typeof photos[currentIndex] === 'string' ? photos[currentIndex] : URL.createObjectURL(photos[currentIndex])}
              alt={`Foto ${currentIndex + 1}`}
              className="w-full h-64 sm:h-80 md:h-96 object-contain cursor-pointer bg-gradient-to-br from-rose-50 to-pink-50"
              onClick={() => setIsFullscreen(true)}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
          
          {photos.length > 1 && (
            <>
              <motion.button
                onClick={prevPhoto}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-rose-500/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-rose-600/90 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button
                onClick={nextPhoto}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-rose-500/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-rose-600/90 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </>
          )}
          
          {/* Indicadores melhorados */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            {photos.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white p-3 rounded-full hover:bg-white/20 transition-colors z-10 bg-black/50 backdrop-blur-sm"
            >
              <X size={24} />
            </button>
            
            {/* Dica de swipe para mobile */}
            {photos.length > 1 && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                👆 Arraste para navegar
              </motion.div>
            )}
            
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={typeof photos[currentIndex] === 'string' ? photos[currentIndex] : URL.createObjectURL(photos[currentIndex])}
              alt={`Foto ${currentIndex + 1}`}
              className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x
                if (swipe < -10000) {
                  nextPhoto()
                } else if (swipe > 10000) {
                  prevPhoto()
                }
              }}
            />
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPhoto()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPhoto()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}