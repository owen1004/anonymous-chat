"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTyping } from "@/hooks/useTyping"
import { useNickname } from "@/hooks/useNickname"
import { motion } from "framer-motion"
import { theme } from "@/styles/theme"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"

export default function ChatPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { otherUserTyping, startTyping, stopTyping } = useTyping("temp-chat-123", user?.uid || null)
  const { nickname } = useNickname()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 用戶驗證
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // 自動滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // 自動調整輸入框高度
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("")
      stopTyping()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F8EFE3] flex flex-col">
      {/* 聊天區域 */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {otherUserTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce delay-200" />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 輸入區域 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E6DCD3] p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-4">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (e.target.value) {
                  startTyping()
                } else {
                  stopTyping()
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="輸入訊息..."
              className="flex-1 min-h-[40px] max-h-[120px] p-2 rounded-lg border border-[#E6DCD3] focus:outline-none focus:ring-2 focus:ring-[#D4AFAF] resize-none"
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`${theme.styles.button.common} px-4 py-2`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              傳送
            </motion.button>
          </div>
        </div>
      </div>

      {/* 返回首頁按鈕 */}
      <motion.button
        onClick={() => router.push("/")}
        className={`${theme.styles.button.common} fixed top-4 right-4 px-8 py-3 text-lg`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        返回首頁
      </motion.button>
    </div>
  )
}
