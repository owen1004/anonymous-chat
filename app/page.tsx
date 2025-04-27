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
import AuthSwitcher from '@/components/ui/auth-switcher'
import TabBar from "@/components/TabBar"
import WarmQuotes from "@/components/WarmQuotes"
import { useAnonymousAuth } from "@/hooks/useAnonymousAuth"
import { useMatching } from "@/hooks/useMatching"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import StoryPrompt from "@/components/story-prompt"
import RewardNotification from "@/components/reward-notification"

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

const HomePage = () => {
  useAnonymousAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("")
  const [currentQuote, setCurrentQuote] = useState("")
  const [currentStory, setCurrentStory] = useState("")
  const [currentReward, setCurrentReward] = useState("")
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [waitingTime, setWaitingTime] = useState(0)
  const [showAchievementSidebar, setShowAchievementSidebar] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isMatching, startMatching } = useMatching()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{
    id: number
    text: string
    timestamp: string
    likes: number
    isAnonymous: boolean
  }>>([])

  const getRandomItem = (array: string[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  }

  // 初始化鼓勵語句輪播
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    // 無論是否在配對中，都顯示鼓勵語句
    setCurrentQuote(getRandomItem(encouragementQuotes))
    interval = setInterval(() => {
      setCurrentQuote(getRandomItem(encouragementQuotes))
    }, 12000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  // 初始化故事開場語和隱藏語錄
  useEffect(() => {
    let storyTimeout: NodeJS.Timeout | null = null
    let rewardTimeout: NodeJS.Timeout | null = null
    let waitingTimer: NodeJS.Timeout | null = null
    let achievementCheckInterval: NodeJS.Timeout | null = null

    // 無論是否在配對中，都設置計時器
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

    return () => {
      if (storyTimeout) clearTimeout(storyTimeout)
      if (rewardTimeout) clearTimeout(rewardTimeout)
      if (waitingTimer) clearInterval(waitingTimer)
      if (achievementCheckInterval) clearInterval(achievementCheckInterval)
    }
  }, [user, waitingTime])

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    // 監聽網路狀態
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      unsubscribe()
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleStartChat = async () => {
    try {
      if (!isOnline) {
        toast.error("目前網路未連線，請稍後再試")
        return
      }

      setIsMatching(true)
      setError(null)
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
        setIsMatching(false)
        
        // 導向聊天室頁面
        router.push(`/chat/${chatRef.id}`)
      } else {
        setStatus("正在尋找聊天對象中，請稍候...")
        // 如果沒有找到配對，保持等待狀態
      }

    } catch (error: unknown) {
      console.error("配對過程發生錯誤:", error)
      setIsMatching(false)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("發生未知錯誤，請稍後再試")
      }
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        likes: 0,
        isAnonymous: true
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  // 錯誤提示元件
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow-md max-w-md text-center">
      {message}
    </div>
  )

  // 載入中元件
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  )

  // 離線提示元件
  const OfflineMessage = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-600">喔喔，好像失去連線了～</p>
        <p className="text-gray-500">請重新整理試試🌈</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
        >
          重新整理
        </button>
      </div>
    </div>
  )

  // 主要內容元件
  const MainContent = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center mb-4">
        匿名聊天室
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-8">
        在這裡，你可以自由地表達想法，分享故事，結交新朋友
      </p>
      <StoryPrompt />
      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.id}`} />
                    <AvatarFallback>匿名</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">匿名用戶</CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      {msg.timestamp}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-gray-700">
                  匿名模式
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-200">{msg.text}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-pink-500"
                onClick={() => {
                  setMessages(messages.map(m =>
                    m.id === msg.id ? { ...m, likes: m.likes + 1 } : m
                  ))
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {msg.likes}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="輸入訊息..."
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            發送
          </Button>
        </div>
      </div>
      <RewardNotification />
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (isOffline) {
    return <OfflineMessage />
  }

  return <MainContent />
}

export default HomePage