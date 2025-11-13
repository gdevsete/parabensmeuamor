'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Video, Plus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface MediaUploaderProps {
  photos: string[]
  videos: string[]
  onFileUpload: (files: File[]) => Promise<void>
  isLoading: boolean
  maxFiles?: number
}

export default function MediaUploader({
  photos,
  videos,
  onFileUpload,
  isLoading,
  maxFiles = 7
}: MediaUploaderProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const allMedia = [...photos, ...videos]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (allMedia.length + acceptedFiles.length <= maxFiles) {
      onFileUpload(acceptedFiles)
    }
  }, [allMedia.length, maxFiles, onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov']
    },
    multiple: true,
    disabled: isLoading || allMedia.length >= maxFiles
  })

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')
  }

  const removeMedia = (index: number) => {
    // Esta função seria implementada se necessário
    console.log('Remover mídia no índice:', index)
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-pink-500 bg-pink-50'
            : allMedia.length >= maxFiles
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="bg-pink-100 rounded-full p-4 mb-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            ) : (
              <Upload className="w-8 h-8 text-pink-500" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isLoading ? 'Fazendo upload...' : 'Adicionar fotos e vídeos'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {allMedia.length >= maxFiles
              ? `Limite de ${maxFiles} arquivos atingido`
              : `Arraste arquivos aqui ou clique para selecionar (${allMedia.length}/${maxFiles})`}
          </p>
          
          {!isLoading && allMedia.length < maxFiles && (
            <p className="text-sm text-gray-500">
              Suporta: JPG, PNG, GIF, WebP, MP4, WebM, MOV
            </p>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {allMedia.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allMedia.map((url, index) => (
            <motion.div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedIndex(index)}
            >
              {isVideo(url) ? (
                <>
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </>
              ) : (
                <img
                  src={url}
                  alt={`Memória ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMedia(index)
                  }}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add More Button */}
          {allMedia.length < maxFiles && (
            <div
              {...getRootProps()}
              className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all cursor-pointer flex items-center justify-center hover:scale-105"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Adicionar mais</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de visualização */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-600 hover:text-gray-800 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {isVideo(allMedia[selectedIndex]) ? (
                <video
                  src={allMedia[selectedIndex]}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg"
                />
              ) : (
                <img
                  src={allMedia[selectedIndex]}
                  alt={`Memória ${selectedIndex + 1}`}
                  className="max-w-full max-h-full rounded-lg"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      {allMedia.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          <p>
            {photos.length} foto(s) • {videos.length} vídeo(s) • {allMedia.length}/{maxFiles} total
          </p>
        </div>
      )}
    </div>
  )
}