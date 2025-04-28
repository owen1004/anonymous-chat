"use client"

import { useState, useEffect } from "react"
import { getDatabase, ref, onValue, set, onDisconnect, remove, serverTimestamp } from "firebase/database"
import { auth } from "@/lib/firebase"

export function useOnlineUsers() {
  const [onlineUserCount, setOnlineUserCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const db = getDatabase()
    const onlineUsersRef = ref(db, "online-users")
    const userRef = ref(db, `online-users/${auth.currentUser?.uid}`)

    // 設置用戶在線狀態
    const setUserOnline = async () => {
      if (auth.currentUser) {
        await set(userRef, {
          lastSeen: serverTimestamp(),
          uid: auth.currentUser.uid
        })

        // 設置離線時自動移除
        onDisconnect(userRef).remove()
      }
    }

    // 監聽在線用戶數量變化
    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      const data = snapshot.val()
      const count = data ? Object.keys(data).length : 0
      setOnlineUserCount(count)
      setIsLoading(false)
    })

    // 設置當前用戶在線
    setUserOnline()

    // 清理函數
    return () => {
      unsubscribe()
      if (auth.currentUser) {
        remove(userRef)
      }
    }
  }, [])

  return {
    onlineUserCount,
    isLoading
  }
} 