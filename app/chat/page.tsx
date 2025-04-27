"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import MessageArea from "@/components/message-area"
import MessageInput from "@/components/message-input"
import LeaveChatButton from "@/components/leave-chat-button"
import LoadingAnimation from "@/components/loading-animation"
import { db } from "@/lib/firebase"
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore"

type Message = {
  id: string
  text: string
  sender: "me" | "other"
  timestamp: Date
}

export default function ChatPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    // 這裡可以加入配對邏輯
    // 暫時使用固定的 chatId 作為示例
    const tempChatId = "temp-chat-123"
    setChatId(tempChatId)

    // 監聽訊息
    const messagesRef = collection(db, "chats", tempChatId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        sender: doc.data().userId === user?.uid ? ("me" as const) : ("other" as const),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }))
      setMessages(newMessages)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [user, loading, router])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return

    try {
      const messagesRef = collection(db, "chats", chatId, "messages")
      await addDoc(messagesRef, {
        text: newMessage,
        userId: user.uid,
        timestamp: serverTimestamp(),
      })
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("發送訊息失敗，請稍後再試")
    }
  }

  const handleLeaveChat = () => {
    if (confirm("確定要離開聊天室嗎？")) {
      router.push("/")
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-center">匿名聊天室</h1>
      </header>

      {/* 訊息區域 */}
      <div className="flex-1 overflow-y-auto">
        <MessageArea messages={messages} />
        <LeaveChatButton handleLeaveChat={handleLeaveChat} />
      </div>

      {/* 訊息輸入區域 */}
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
    </div>
  )
}
