"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { 
  collection, query, where, orderBy, onSnapshot,
  addDoc, serverTimestamp, deleteDoc, doc, setDoc, getDoc,
  DocumentReference, DocumentData
} from "firebase/firestore"
import { Send, LogOut } from "lucide-react"
import ChatMoreOptions from '@/components/chat-more-options'

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
  const [otherUserId, setOtherUserId] = useState<string | null>(null)
  const currentUser = auth.currentUser
  const lastMessageRef = useRef<string>("")

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
      return
    }

    // 獲取聊天室信息
    const chatRef = doc(db, "chats", params.chatId)
    const chatUnsubscribe = onSnapshot(chatRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const chatData = docSnapshot.data()
        // 確定對方用戶ID
        const otherUser = chatData.userA === currentUser.uid ? chatData.userB : chatData.userA
        setOtherUserId(otherUser)

        // 如果是信箱登入用戶，更新聊天記錄
        if (!currentUser.isAnonymous) {
          const userChatRef = doc(db, "users", currentUser.uid, "chats", params.chatId) as DocumentReference<DocumentData>
          await setDoc(userChatRef, {
            chatId: params.chatId,
            otherUserId: otherUser,
            startTime: chatData.createdAt,
            lastMessageTime: serverTimestamp(),
            lastMessage: lastMessageRef.current || "開始聊天"
          }, { merge: true })
        }
      }
    })

    const messagesRef = collection(db, "chats", params.chatId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const messagesUnsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      setMessages(newMessages)
      setIsLoading(false)

      // 如果是信箱登入用戶，更新最後訊息時間和預覽
      if (!currentUser.isAnonymous && newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1]
        lastMessageRef.current = lastMessage.text
        const userChatRef = doc(db, "users", currentUser.uid, "chats", params.chatId) as DocumentReference<DocumentData>
        setDoc(userChatRef, {
          lastMessageTime: lastMessage.timestamp,
          lastMessage: lastMessage.text
        }, { merge: true })
      }
    })

    return () => {
      chatUnsubscribe()
      messagesUnsubscribe()
    }
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
      // 如果是信箱登入用戶，標記聊天為已結束
      if (currentUser && !currentUser.isAnonymous) {
        const userChatRef = doc(db, "users", currentUser.uid, "chats", params.chatId) as DocumentReference<DocumentData>
        await setDoc(userChatRef, {
          endedAt: serverTimestamp(),
          status: "ended"
        }, { merge: true })
      }

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-pink-50">
      <header className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-medium">匿名聊天室</h1>
          {otherUserId && (
            <ChatMoreOptions chatId={params.chatId} otherUserId={otherUserId} />
          )}
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 overflow-y-auto">
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
      </main>

      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto">
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
      </footer>
    </div>
  )
} 