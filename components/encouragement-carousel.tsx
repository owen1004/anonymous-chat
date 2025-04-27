"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const encouragementQuotes = [
  "你不是沒人理，我們正在幫你找適合的人。",
  "每個人都值得被傾聽，包括你。",
  "有時候，一個陌生人的理解，勝過千言萬語。",
  "在這裡，你可以做最真實的自己。",
  "分享你的故事，也許能幫助到另一個人。",
  "你的感受很重要，不要忽視它。",
  "每個相遇都是一個新的開始。",
  "讓時間慢下來，好好傾聽內心的聲音。",
  "你的存在，就是一個美麗的奇蹟。",
  "有時候，沉默也是一種力量。",
]

export default function EncouragementCarousel() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % encouragementQuotes.length)
    }, 12000) // 每12秒更換一次

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-20 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-600 text-center px-4 max-w-2xl"
        >
          {encouragementQuotes[currentQuote]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
} 