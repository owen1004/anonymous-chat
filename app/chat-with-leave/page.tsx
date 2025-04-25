"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MessageArea from "@/components/message-area"
import MessageInput from "@/components/message-input"
import LeaveChatButton from "@/components/leave-chat-button"

type Message = {
  id: number
  text: string
  sender: "me" | "other"
  timestamp: Date
}

export default function ChatWithLeave() {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "嗨，你好！很高興認識你。",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 分鐘前
    },
    {
      id: 2,
      text: "你好！我也很高興認識你。你今天過得如何？",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 分鐘前
    },
    {
      id: 3,
      text: "我今天過得很好，謝謝關心。你呢？",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 分鐘前
    },
  ])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleLeaveChat = () => {
    if (confirm("確定要離開聊天室嗎？")) {
      // 在實際應用中，這裡可以導航到首頁或其他頁面
      router.push("/")
      // 或者顯示一個離開聊天的確認訊息
      alert("您已離開聊天室")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-center">聊天室</h1>
      </header>

      {/* 訊息區域 */}
      <div className="flex-1 overflow-y-auto">
        <MessageArea messages={messages} />
        <LeaveChatButton handleLeaveChat={handleLeaveChat} />
      </div>

      {/* 訊息輸入區域 */}
      <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
    </div>
  )
}
