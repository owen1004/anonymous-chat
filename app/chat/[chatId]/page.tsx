"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { 
  collection, query, where, orderBy, onSnapshot,
  addDoc, serverTimestamp, deleteDoc, doc
} from "firebase/firestore"
import { Send, LogOut } from "lucide-react"

interface Message {
  id: string
  text: string
  senderId: string
  timestamp: any
}

export default function ChatRoom({ params }: { params: { chatId: string } }) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const currentUser = auth.currentUser

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
      return
    }

    const messagesRef = collection(db, "chats", params.chatId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      setMessages(newMessages)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [params.chatId, currentUser, router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    try {
      const messagesRef = collection(db, "chats", params.chatId, "messages")
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      })
      setNewMessage("")
    } catch (error) {
      console.error("發送訊息錯誤:", error)
    }
  }

  const handleLeaveChat = async () => {
    try {
      // 刪除聊天室
      await deleteDoc(doc(db, "chats", params.chatId))
      router.push("/")
    } catch (error) {
      console.error("離開聊天室錯誤:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* 聊天室標題和離開按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-serif text-gray-800">匿名聊天室</h1>
          <button
            onClick={handleLeaveChat}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-orange-500"
          >
            <LogOut size={18} />
            <span>離開聊天</span>
          </button>
        </div>

        {/* 訊息列表 */}
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser?.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.senderId === currentUser?.uid
                    ? "bg-orange-400 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 輸入框 */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="輸入訊息..."
            className="flex-1 px-4 py-2 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-orange-400 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
} 