'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  targetDate: Date
  title?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ targetDate, title = "Contagem Regressiva" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = now - targetDate.getTime() // Tempo decorrido desde a data

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
        { label: 'Segundos', value: timeLeft.seconds }
      ].map((item, index) => (
        <motion.div
          key={item.label}
          className="bg-white/20 backdrop-blur-sm rounded-lg p-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-2xl font-bold text-pink-600">
            {item.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600">{item.label}</div>
        </motion.div>
      ))}
      </div>
    </div>
  )
}