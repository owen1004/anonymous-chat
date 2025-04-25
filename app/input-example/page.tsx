"use client"

import { useState } from "react"
import MessageInput from "@/components/message-input"

export default function InputExample() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<string[]>([])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // 添加訊息到訊息列表
    setMessages((prev) => [...prev, newMessage])

    // 清空輸入框
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-medium text-center">訊息輸入示例</h1>
      </header>

      {/* 訊息顯示區域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="bg-blue-100 p-3 rounded-lg max-w-[80%] ml-auto">
                {msg}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">輸入訊息並點擊發送按鈕</div>
        )}
      </div>

      {/* 訊息輸入區域 */}
      <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
    </div>
  )
}
