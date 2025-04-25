"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, signInAnonymously, db } from "@/lib/firebase"
import { User } from "firebase/auth"
import { Loader2 } from "lucide-react"
import {
  setDoc, getDocs, deleteDoc, doc,
  query, collection, where, orderBy, limit,
  addDoc, serverTimestamp, getDoc
} from "firebase/firestore"
import { checkAndUnlockAchievement, Achievement } from "@/lib/achievements"
import AchievementNotification from "@/components/AchievementNotification"
import AchievementSidebar from "@/components/AchievementSidebar"

const encouragementQuotes = [
  "你不是沒人理，我們正在幫你找適合的人。",
  "再撐一下，我們會幫你找到心靈頻率一致的人。",
  "說出來的心事，才有被安放的機會。",
  "也許下個人，就是你剛好需要的溫柔。"
]

const storyPrompts = [
  "在一個深夜的城市角落，一個人打開了這個聊天室……",
  "也許這一刻，有人正等待一個無壓力的開場白。",
  "按下開始的那瞬間，你已經接近一段故事的開始。",
  "有人想說：嗨，也許今天會有一個人理解我。"
]

const rewardMessages = [
  "🎖️ 你獲得了『沉默勇者』徽章！",
  "你的耐心讓你與眾不同 ✨",
  "孤獨不是退場，而是等待適合的入場。"
]

// 安全的 Firestore 文件讀取函式
const safeGetDoc = async (docRef: any) => {
  try {
    // 檢查 Firebase 是否已初始化
    if (!db) {
      throw new Error("Firebase 尚未初始化完成")
    }

    // 檢查網路狀態
    if (!navigator.onLine) {
      throw new Error("目前未連上網路，請稍候再試")
    }

    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error("找不到指定的文件")
    }

    return docSnap
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("offline")) {
        throw new Error("目前未連上網路，請稍候再試")
      } else if (error.message.includes("Firebase 尚未初始化")) {
        throw new Error("系統正在初始化中，請稍候再試")
      } else if (error.message.includes("找不到指定的文件")) {
        throw new Error("找不到指定的資料")
      }
    }
    throw new Error("讀取資料時發生錯誤，請稍候再試")
  }
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [currentQuote, setCurrentQuote] = useState("")
  const [currentStory, setCurrentStory] = useState("")
  const [currentReward, setCurrentReward] = useState("")
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [waitingTime, setWaitingTime] = useState(0)
  const [showAchievementSidebar, setShowAchievementSidebar] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const getRandomItem = (array: string[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isLoading) {
      // 初始化第一則語錄
      setCurrentQuote(getRandomItem(encouragementQuotes))

      // 設置 12 秒輪播
      interval = setInterval(() => {
        setCurrentQuote(getRandomItem(encouragementQuotes))
      }, 12000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isLoading])

  useEffect(() => {
    let storyTimeout: NodeJS.Timeout | null = null
    let rewardTimeout: NodeJS.Timeout | null = null
    let waitingTimer: NodeJS.Timeout | null = null
    let achievementCheckInterval: NodeJS.Timeout | null = null

    if (isLoading) {
      // 初始化其他狀態
      setCurrentStory("")
      setCurrentReward("")
      setWaitingTime(0)

      // 設置故事開場語句（30秒後顯示）
      storyTimeout = setTimeout(() => {
        setCurrentStory(getRandomItem(storyPrompts))
      }, 30000)

      // 設置彩蛋語句（60秒後顯示）
      rewardTimeout = setTimeout(() => {
        setCurrentReward(getRandomItem(rewardMessages))
      }, 60000)

      // 更新等待時間
      waitingTimer = setInterval(() => {
        setWaitingTime(prev => prev + 1)
      }, 1000)

      // 檢查成就
      achievementCheckInterval = setInterval(async () => {
        if (user) {
          // 檢查沉默勇者成就
          const result = await checkAndUnlockAchievement(
            user.uid,
            "silent_warrior",
            waitingTime
          )

          if (result.unlocked && result.badge) {
            setNewAchievement({
              ...result.badge,
              unlockedAt: new Date()
            })
          }

          // 檢查月光旅人成就
          const nightOwlResult = await checkAndUnlockAchievement(
            user.uid,
            "night_owl",
            0
          )

          if (nightOwlResult.unlocked && nightOwlResult.badge) {
            setNewAchievement({
              ...nightOwlResult.badge,
              unlockedAt: new Date()
            })
          }
        }
      }, 1000)
    }

    return () => {
      if (storyTimeout) clearTimeout(storyTimeout)
      if (rewardTimeout) clearTimeout(rewardTimeout)
      if (waitingTimer) clearInterval(waitingTimer)
      if (achievementCheckInterval) clearInterval(achievementCheckInterval)
    }
  }, [isLoading, user, waitingTime])

  // 更新在線人數
  useEffect(() => {
    const updateOnlineUsers = () => {
      const randomUsers = Math.floor(Math.random() * (47 - 8 + 1)) + 8
      setOnlineUsers(randomUsers)
    }

    // 立即執行一次
    updateOnlineUsers()

    // 每 30 秒更新一次
    const interval = setInterval(updateOnlineUsers, 30000)

    return () => clearInterval(interval)
  }, [])

  // 監聽網路狀態
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 初始檢查網路狀態
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleStartChat = async () => {
    try {
      if (!isOnline) {
        setStatus("目前網路未連線，請稍後再試")
        return
      }

      setIsLoading(true)
      setStatus("正在進行匿名登入...")
      
      const userCredential = await signInAnonymously(auth)
      const user = userCredential.user
      setUser(user)
      setStatus("登入成功！正在尋找聊天夥伴...")
      console.log("使用者 UID:", user.uid)

      const userDocRef = doc(db, "queueWaiting", user.uid)

      // 加入等待池
      await setDoc(userDocRef, {
        uid: user.uid,
        timestamp: serverTimestamp()
      })

      // 搜尋其他等待配對者
      const q = query(
        collection(db, "queueWaiting"),
        where("uid", "!=", user.uid),
        orderBy("timestamp"),
        limit(1)
      )

      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const other = snapshot.docs[0].data()

        // 建立聊天室
        const chatRef = await addDoc(collection(db, "chats"), {
          userA: user.uid,
          userB: other.uid,
          createdAt: serverTimestamp()
        })

        // 清除配對池
        await deleteDoc(userDocRef)
        await deleteDoc(doc(db, "queueWaiting", other.uid))

        setStatus("已找到聊天夥伴！")
        setIsLoading(false)
        
        // 導向聊天室頁面
        router.push(`/chat/${chatRef.id}`)
      } else {
        setStatus("正在尋找聊天對象中，請稍候...")
        // 如果沒有找到配對，保持等待狀態
        setIsLoading(true)
      }

    } catch (error: unknown) {
      console.error("配對過程發生錯誤:", error)
      if (error instanceof Error) {
        setStatus(error.message)
      } else {
        setStatus("發生未知錯誤，請稍後再試")
      }
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center space-y-8 p-8 max-w-2xl">
        {!isOnline && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow-md">
            目前網路未連線，請檢查您的網路設定
          </div>
        )}
        <div className="absolute top-4 left-4">
          <p className="text-sm text-gray-500 font-light italic">
            目前有 {onlineUsers} 位匿名用戶正在等待配對中
          </p>
        </div>
        <button
          onClick={() => setShowAchievementSidebar(true)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
        >
          🎖️
        </button>
        <h1 className="text-5xl font-serif font-light text-gray-800 tracking-wide">
          匿名悄悄話聊天室
        </h1>
        <p className="text-xl text-gray-600 font-light italic">
          無需登入，無需壓力，只要一點勇氣，就能開啟一段對話。
        </p>
        <div className="flex flex-col items-center space-y-8">
          <button
            onClick={handleStartChat}
            disabled={isLoading}
            className={`px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full 
                     hover:from-orange-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl font-medium tracking-wide flex items-center justify-center gap-2
                     ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span>配對中</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 animate-bounce"></div>
                </div>
              </div>
            ) : (
              "Start Chatting"
            )}
          </button>
          {isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 animate-pulse">
                正在尋找適合你的聊天旅伴... ✨
              </p>
              {currentQuote && (
                <p className="text-sm text-gray-500 italic mt-4 animate-fade-in">
                  {currentQuote}
                </p>
              )}
              {currentStory && (
                <p className="text-sm text-gray-600 font-light tracking-wide mt-4 animate-fade-in max-w-md mx-auto">
                  {currentStory}
                </p>
              )}
              {currentReward && (
                <div className="mt-4 animate-bounce">
                  <p className="text-base font-medium text-orange-500 bg-white/80 rounded-full px-4 py-2 shadow-md">
                    {currentReward}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {newAchievement && (
        <AchievementNotification
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}

      {user && (
        <AchievementSidebar
          userId={user.uid}
          isOpen={showAchievementSidebar}
          onClose={() => setShowAchievementSidebar(false)}
        />
      )}
    </main>
  )
}
