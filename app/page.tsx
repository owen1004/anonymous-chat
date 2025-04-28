"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useMatching } from "@/hooks/useMatching"
import { useOnlineUsers } from "@/hooks/useOnlineUsers"
import { useNickname } from "@/hooks/useNickname"
import { motion, AnimatePresence } from "framer-motion"
import { Menu } from "lucide-react"
import { theme } from "@/styles/theme"
import { encouragementQuotes } from "@/data/encouragementQuotes"
import { Drawer } from "@/components/ui/drawer"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { startMatching, isMatching, isTimeout, resetTimeout } = useMatching()
  const { onlineUserCount } = useOnlineUsers()
  const { nickname } = useNickname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(
    Math.floor(Math.random() * encouragementQuotes.length)
  )
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 清理計時器
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 打字機效果
  const typeWriter = useCallback(() => {
    const currentQuote = encouragementQuotes[currentQuoteIndex]
    const currentLength = displayText.length

    if (!isDeleting && currentLength < currentQuote.length) {
      // 打字階段
      setDisplayText(currentQuote.substring(0, currentLength + 1))
    } else if (!isDeleting && currentLength === currentQuote.length) {
      // 完成打字，等待6秒後開始刪除
      setIsTyping(false)
      timerRef.current = setTimeout(() => {
        setIsDeleting(true)
        setIsTyping(true)
      }, 6000)
    } else if (isDeleting && currentLength > 0) {
      // 刪除階段
      setDisplayText(currentQuote.substring(0, currentLength - 1))
    } else if (isDeleting && currentLength === 0) {
      // 完成刪除，切換到下一句
      setIsDeleting(false)
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % encouragementQuotes.length)
    }
  }, [currentQuoteIndex, displayText, isDeleting])

  // 控制打字速度
  useEffect(() => {
    clearTimers()
    intervalRef.current = setInterval(typeWriter, isDeleting ? 75 : 150)
    return clearTimers
  }, [typeWriter, isDeleting, clearTimers])

  // 防止背景滾動
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isDrawerOpen])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (isTimeout) {
      const timer = setTimeout(() => {
        resetTimeout()
        router.push("/")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isTimeout, router, resetTimeout])

  const handleStartChat = () => {
    setIsAnimating(true)
    startMatching()
    setTimeout(() => {
      router.push("/chat")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8EFE3]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AFAF]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8EFE3] flex flex-col">
      <header className="p-4 border-b border-[#E6DCD3] flex justify-between items-center">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-full hover:bg-[#E6DCD3]/50 transition-colors"
        >
          <Menu className="w-6 h-6 text-[#7A7363]" />
        </button>
        <h1 className="text-2xl font-medium text-[#7A7363]">匿名聊天室</h1>
        <div className="w-10" /> {/* 平衡標題置中 */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-xl text-[#7A7363]">歡迎，{nickname}</h2>
          <p className="text-[#9CA3AF]">目前有 {onlineUserCount} 位旅人在線上</p>

          {/* 打字機效果 */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-base text-[#9CA3AF] max-w-md">
              {displayText}
              <span className={`inline-block w-0.5 h-5 bg-[#9CA3AF] ml-1 ${isTyping ? "animate-pulse" : ""}`} />
            </p>
          </div>

          {isMatching ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#D4AFAF] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#D4AFAF] animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-[#D4AFAF] animate-bounce delay-200" />
            </div>
          ) : (
            <motion.button
              onClick={handleStartChat}
              disabled={isAnimating}
              className={`${theme.styles.button.common} px-8 py-3 text-lg`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              開始聊天
            </motion.button>
          )}
        </motion.div>
      </main>

      {/* Drawer 組件 */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {isTimeout && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#F8EFE3] p-6 rounded-xl shadow-lg text-center">
            <p className="text-[#7A7363] text-lg mb-4">
              目前暫時沒有旅伴在線上，請稍後再試 ✨
            </p>
          </div>
        </div>
      )}
    </div>
  )
}