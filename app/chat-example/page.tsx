"use client"

import { useState } from "react"
import MessageArea from "@/components/message-area"

type Message = {
  id: number
  text: string
  sender: "me" | "other"
  timestamp: Date
}

export default function ChatExample() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "嗨，你好！很高興認識你。",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 分鐘前
    },
    {
      id: 2,
      text: "你好！我也很高興認識你。你今天過得如何？",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 分鐘前
    },
    {
      id: 3,
      text: "我今天過得很好，謝謝關心。你呢？",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 分鐘前
    },
    {
      id: 4,
      text: "我也過得不錯！剛剛完成了一個專案，感覺很有成就感。",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 分鐘前
    },
    {
      id: 5,
      text: "那太棒了！是什麼樣的專案呢？聽起來很有趣。",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 分鐘前
    },
    {
      id: 6,
      text: "是一個網頁應用程式，使用 React 和 Next.js 開發的。主要功能是讓用戶可以匿名聊天，就像我們現在這樣！",
      sender: "me",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 分鐘前
    },
    {
      id: 7,
      text: "哇，聽起來很酷！我很喜歡這種匿名聊天的概念，可以讓人更自由地表達自己。",
      sender: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 分鐘前
    },
    {
      id: 8,
      text: "是的，我也這麼認為。匿名可以讓人們更真實地交流，不受社交壓力的影響。",
      sender: "me",
      timestamp: new Date(), // 現在
    },
  ])

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-center">訊息示例</h1>
      </header>

      <MessageArea messages={messages} />

      <footer className="p-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">訊息區域示例 - 可滾動查看所有訊息</div>
      </footer>
    </div>
  )
}
