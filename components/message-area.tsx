"use client"

import { useRef, useEffect } from "react"
import { format } from "date-fns"

type Message = {
  id: number | string
  text: string
  sender: "me" | "other"
  timestamp: Date
}

type MessageAreaProps = {
  messages: Message[]
}

export default function MessageArea({ messages }: MessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動滾動到最新訊息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              message.sender === "me" ? "bg-blue-100 text-gray-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            <p className="text-sm sm:text-base">{message.text}</p>
            <p className="text-xs mt-1 text-gray-500">{format(new Date(message.timestamp), "HH:mm")}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
