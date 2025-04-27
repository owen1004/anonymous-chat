import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, deleteDoc, collection, serverTimestamp } from 'firebase/firestore'
import { User } from 'firebase/auth'

interface ChatMoreOptionsProps {
  chatId: string
  otherUserId: string
}

export default function ChatMoreOptions({ chatId, otherUserId }: ChatMoreOptionsProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = auth.currentUser

  const handleBlock = async () => {
    if (!currentUser) return

    try {
      // 將對方加入封鎖名單
      const blockRef = doc(db, 'users', currentUser.uid, 'blockList', otherUserId)
      await setDoc(blockRef, {
        blockedAt: serverTimestamp(),
        chatId: chatId
      })

      // 刪除聊天室
      await deleteDoc(doc(db, 'chats', chatId))

      // 導回首頁
      router.push('/')
    } catch (error) {
      console.error('封鎖用戶時發生錯誤:', error)
    }
  }

  const handleReport = async () => {
    if (!currentUser) return

    try {
      // 創建檢舉記錄
      const reportRef = doc(collection(db, 'reports'))
      await setDoc(reportRef, {
        reporterId: currentUser.uid,
        reportedId: otherUserId,
        chatId: chatId,
        createdAt: serverTimestamp()
      })

      alert('檢舉已送出，我們會盡快處理')
    } catch (error) {
      console.error('送出檢舉時發生錯誤:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={handleReport}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            檢舉對方
          </button>
          <button
            onClick={handleBlock}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            封鎖對方
          </button>
        </div>
      )}
    </div>
  )
} 