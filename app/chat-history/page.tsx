"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db, onAuthStateChangedListener } from "@/lib/firebase"
import { User } from "firebase/auth"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"

interface Chat {
  id: string
  title: string
  lastMessageTime: any
  partnerId: string
  partnerName: string
}

export default function ChatHistory() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user)
      if (!user) {
        router.push("/")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return

      try {
        const chatsRef = collection(db, "users", user.uid, "chats")
        const q = query(chatsRef, orderBy("lastMessageTime", "desc"))
        const snapshot = await getDocs(q)

        const chatList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Chat[]

        setChats(chatList)
      } catch (error) {
        console.error("取得聊天記錄錯誤：", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-light text-gray-800 mb-8">
          聊天記錄
        </h1>

        {chats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">還沒有任何聊天記錄</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  {chat.title || "未命名對話"}
                </h2>
                <p className="text-gray-600">
                  最後對話時間：{chat.lastMessageTime?.toDate().toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 