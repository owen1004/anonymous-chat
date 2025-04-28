import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { doc, updateDoc, onSnapshot } from "firebase/firestore"

export function useTyping(chatId: string) {
  const { user } = useAuth()
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 更新打字狀態
  const updateTypingStatus = useCallback(async (typing: boolean) => {
    if (!user || !chatId) return

    try {
      const chatRef = doc(db, "chats", chatId)
      await updateDoc(chatRef, {
        [`typing.${user.uid}`]: typing
      })
    } catch (error) {
      console.error("更新打字狀態失敗:", error)
    }
  }, [user, chatId])

  // 監聽其他用戶的打字狀態
  useEffect(() => {
    if (!chatId) return

    const chatRef = doc(db, "chats", chatId)
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      const data = doc.data()
      if (!data || !data.typing) return

      const otherUsersTyping = Object.entries(data.typing)
        .filter(([uid]) => uid !== user?.uid)
        .some(([_, isTyping]) => isTyping)

      setOtherUserTyping(otherUsersTyping)
    })

    return () => unsubscribe()
  }, [chatId, user?.uid])

  // 處理打字超時
  useEffect(() => {
    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false)
        setIsTyping(false)
      }, 5000)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [isTyping, updateTypingStatus])

  return {
    isTyping,
    otherUserTyping,
    startTyping: () => {
      setIsTyping(true)
      updateTypingStatus(true)
    },
    stopTyping: () => {
      setIsTyping(false)
      updateTypingStatus(false)
    }
  }
} 