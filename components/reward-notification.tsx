"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const rewardMessages = [
  {
    title: "沉默勇者",
    message: "你獲得了沉默勇者徽章！",
    description: "靜靜等待也是一種勇氣。",
  },
  {
    title: "耐心之星",
    message: "你獲得了耐心之星徽章！",
    description: "你的耐心值得讚賞。",
  },
  {
    title: "溫暖使者",
    message: "你獲得了溫暖使者徽章！",
    description: "你的存在讓世界更溫暖。",
  },
  {
    title: "傾聽者",
    message: "你獲得了傾聽者徽章！",
    description: "你懂得傾聽的重要性。",
  },
  {
    title: "希望之光",
    message: "你獲得了希望之光徽章！",
    description: "你為他人帶來希望。",
  },
]

export default function RewardNotification() {
  const [showReward, setShowReward] = useState(false)
  const [currentReward, setCurrentReward] = useState(0)

  useEffect(() => {
    // 每30秒隨機顯示一個獎勵
    const interval = setInterval(() => {
      setCurrentReward(Math.floor(Math.random() * rewardMessages.length))
      setShowReward(true)
      setTimeout(() => setShowReward(false), 5000) // 5秒後隱藏
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm"
        >
          <h3 className="text-lg font-medium text-gray-800">
            {rewardMessages[currentReward].title}
          </h3>
          <p className="text-gray-600">{rewardMessages[currentReward].message}</p>
          <p className="text-sm text-gray-500 mt-1">
            {rewardMessages[currentReward].description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 