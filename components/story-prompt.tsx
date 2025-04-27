"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const storyPrompts = [
  "也許這一刻，有人正等待一個無壓力的開場白。",
  "在這個城市裡，每個人都帶著自己的故事。",
  "有時候，最簡單的對話，能帶來最深的感動。",
  "你的故事，也許正是別人需要的答案。",
  "讓我們一起，創造一個溫暖的對話空間。",
  "每個相遇，都是一個新的可能。",
  "在這裡，沒有人是孤單的。",
  "分享，是療癒的開始。",
  "你的聲音，值得被聽見。",
  "讓我們一起，寫下屬於你的故事。",
]

export default function StoryPrompt() {
  const [currentPrompt, setCurrentPrompt] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % storyPrompts.length)
    }, 15000) // 每15秒更換一次

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPrompt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="text-base text-gray-500 text-center px-4 max-w-xl italic"
        >
          {storyPrompts[currentPrompt]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
} 