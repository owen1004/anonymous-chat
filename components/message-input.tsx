"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MessageInputProps = {
  newMessage: string
  setNewMessage: (message: string) => void
  handleSendMessage: () => void
}

export default function MessageInput({ newMessage, setNewMessage, handleSendMessage }: MessageInputProps) {
  // 處理按下 Enter 鍵發送訊息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 shadow-sm">
      <div className="flex space-x-2 max-w-4xl mx-auto">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="輸入訊息..."
          className="flex-1 bg-gray-50 border-gray-200 focus:ring-1 focus:ring-blue-300 rounded-full"
        />
        <Button
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ""}
          className="rounded-full px-5 bg-blue-500 hover:bg-blue-600 text-white"
        >
          發送
        </Button>
      </div>
    </div>
  )
}
