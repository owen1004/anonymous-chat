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
import { encouragementQuotes } from "@/data/encouragementQuotes"
import { motion } from "framer-motion"

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

const LoadingDots = () => {
  return (
    <motion.span className="inline-flex items-center">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="ml-1 inline-block w-1 h-1 bg-white rounded-full"
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </motion.span>
  )
}

const HomePage = () => {
  const router = useRouter()
  const { isMatching, startMatching } = useMatching()
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % encouragementQuotes.length)
    }, 12000) // 每12秒切換一次小語
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">匿名聊天室</h1>
      <p className="text-lg text-gray-600 mb-2">
        尋找你的心靈旅伴 ✨
      </p>
      <p className="text-md text-gray-500 italic mb-8 transition-opacity duration-500 ease-in-out">
        {encouragementQuotes[currentQuoteIndex]}
      </p>
      <motion.button
        onClick={startMatching}
        disabled={isMatching}
        className="rounded-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-lg font-medium px-8 py-4 shadow-lg hover:shadow-xl active:shadow-inner transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isMatching ? (
          <span className="flex items-center">
            配對中
            <LoadingDots />
          </span>
        ) : (
          "開始聊天"
        )}
      </motion.button>
    </main>
  )
}

export default HomePage