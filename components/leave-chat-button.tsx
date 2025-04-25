"use client"

import { Button } from "@/components/ui/button"

type LeaveChatButtonProps = {
  handleLeaveChat: () => void
}

export default function LeaveChatButton({ handleLeaveChat }: LeaveChatButtonProps) {
  return (
    <div className="flex justify-center py-4 border-t border-gray-100">
      <Button
        variant="outline"
        onClick={handleLeaveChat}
        className="text-gray-500 hover:text-gray-700 border-gray-200 hover:border-gray-300 bg-transparent"
      >
        Leave Chat
      </Button>
    </div>
  )
}
