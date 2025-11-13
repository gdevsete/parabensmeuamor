'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Copy, Share2, Heart } from 'lucide-react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  url: string
  memoryTitle: string
  onClose: () => void
}

export default function QRCodeGenerator({ url, memoryTitle, onClose }: QRCodeGeneratorProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generateQRCode()
  }, [url])

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#ec4899', // Rosa
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })

      // Converter canvas para data URL
      const dataURL = canvas.toDataURL('image/png')
      setQrCodeDataURL(dataURL)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return

    const link = document.createElement('a')
    link.href = qrCodeDataURL
    link.download = `qr-code-${memoryTitle.replace(/[^a-zA-Z0-9]/g, '-')}.png`
    link.click()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `💕 ${memoryTitle}`,
          text: 'Olha que memória linda que criei para você! 💖',
          url: url
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      // Fallback - copiar link
      copyLink()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Título */}
          <div className="text-center mb-6">
            <Heart className="text-pink-500 mx-auto mb-3" size={48} />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              QR Code da Memória
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Sua namorada pode escanear este código e acessar a memória diretamente!
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-4 rounded-2xl shadow-lg">
              <canvas
                ref={canvasRef}
                className="rounded-xl shadow-md"
              />
            </div>
          </div>

          {/* Título da Memória */}
          <div className="text-center mb-6">
            <p className="font-semibold text-gray-800">&ldquo;{memoryTitle}&rdquo;</p>
            <p className="text-xs text-gray-500 mt-1 break-all">{url}</p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <motion.button
              onClick={downloadQRCode}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={20} />
              Baixar QR Code
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={copyLink}
                className={`py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy size={16} />
                {copied ? 'Copiado!' : 'Copiar Link'}
              </motion.button>

              <motion.button
                onClick={shareLink}
                className="bg-blue-100 text-blue-700 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-200 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={16} />
                Compartilhar
              </motion.button>
            </div>
          </div>

          {/* Dica */}
          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <p className="text-sm text-pink-700 text-center">
              💡 <strong>Dica:</strong> Baixe o QR Code e envie para sua namorada! Ela pode escanear com a câmera do celular e acessar a memória instantaneamente! 💕
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}