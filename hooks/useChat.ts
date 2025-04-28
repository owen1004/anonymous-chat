import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore"

export function useChat(chatId: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 監聽聊天訊息
  useEffect(() => {
    if (!chatId || !user) return

    const messagesRef = collection(db, "chats", chatId, "messages")
    const q = query(messagesRef, orderBy("createdAt", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(newMessages)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [chatId, user])

  // 發送訊息
  const sendMessage = async (content: string) => {
    if (!chatId || !user) return

    try {
      const messagesRef = collection(db, "chats", chatId, "messages")
      await addDoc(messagesRef, {
        content,
        userId: user.uid,
        createdAt: serverTimestamp()
      })
    } catch (error) {
      console.error("發送訊息失敗:", error)
    }
  }

  return {
    messages,
    loading,
    sendMessage
  }
} 