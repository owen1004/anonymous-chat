import { useState, useEffect, useCallback } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc, onSnapshot } from "firebase/firestore"

export function useTyping(chatId: string | null, userId: string | null) {
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  // 更新自己的打字狀態
  const updateTypingStatus = useCallback(
    (typing: boolean) => {
      if (!chatId || !userId) return

      const typingRef = doc(db, "chats", chatId)
      updateDoc(typingRef, {
        [`typing.${userId}`]: typing,
      })
    },
    [chatId, userId]
  )

  // 監聽對方的打字狀態
  useEffect(() => {
    if (!chatId || !userId) return

    const typingRef = doc(db, "chats", chatId)
    const unsubscribe = onSnapshot(typingRef, (doc) => {
      const data = doc.data()
      if (!data?.typing) return

      // 檢查是否有其他用戶在打字
      const otherUsersTyping = Object.entries(data.typing).some(
        ([uid, isTyping]) => uid !== userId && isTyping
      )
      setOtherUserTyping(otherUsersTyping)
    })

    return () => unsubscribe()
  }, [chatId, userId])

  // 處理打字超時
  useEffect(() => {
    if (isTyping) {
      if (typingTimeout) clearTimeout(typingTimeout)
      const timeout = setTimeout(() => {
        updateTypingStatus(false)
        setIsTyping(false)
      }, 5000)
      setTypingTimeout(timeout)
    }

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout)
    }
  }, [isTyping, typingTimeout, updateTypingStatus])

  // 開始打字
  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      updateTypingStatus(true)
    }
  }, [isTyping, updateTypingStatus])

  // 停止打字
  const stopTyping = useCallback(() => {
    if (isTyping) {
      setIsTyping(false)
      updateTypingStatus(false)
    }
  }, [isTyping, updateTypingStatus])

  return {
    otherUserTyping,
    startTyping,
    stopTyping,
  }
} 