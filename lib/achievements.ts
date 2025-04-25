import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore"

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt: Date
}

export const BADGES = {
  silent_warrior: {
    id: "silent_warrior",
    title: "沉默勇者",
    description: "等待配對超過 60 秒未離開",
    condition: (waitingTime: number) => waitingTime >= 60
  },
  healer: {
    id: "healer",
    title: "和平使者",
    description: "連續 3 次聊天中被對方標記為療癒",
    condition: (healingCount: number) => healingCount >= 3
  },
  night_owl: {
    id: "night_owl",
    title: "月光旅人",
    description: "在夜間（22:00~02:00）進行配對",
    condition: () => {
      const hour = new Date().getHours()
      return hour >= 22 || hour < 2
    }
  },
  explorer: {
    id: "explorer",
    title: "初心者",
    description: "完成首次聊天",
    condition: (chatCount: number) => chatCount >= 1
  },
  soul_fire: {
    id: "soul_fire",
    title: "燃燒心事",
    description: "於一次聊天中發送訊息數達 5 則以上",
    condition: (messageCount: number) => messageCount >= 5
  }
}

export const checkAndUnlockAchievement = async (
  userId: string,
  badgeId: keyof typeof BADGES,
  conditionValue: number
) => {
  try {
    // 檢查是否已解鎖
    const achievementRef = doc(db, "users", userId, "achievements", badgeId)
    const achievementDoc = await getDoc(achievementRef)

    if (!achievementDoc.exists()) {
      const badge = BADGES[badgeId]
      
      // 檢查條件是否滿足
      if (badge.condition(conditionValue)) {
        // 解鎖成就
        await setDoc(achievementRef, {
          title: badge.title,
          description: badge.description,
          unlockedAt: serverTimestamp()
        })

        return {
          unlocked: true,
          badge: {
            id: badge.id,
            title: badge.title,
            description: badge.description
          }
        }
      }
    }

    return { unlocked: false }
  } catch (error) {
    console.error("檢查成就時發生錯誤:", error)
    return { unlocked: false }
  }
}

export const getUserAchievements = async (userId: string) => {
  try {
    const achievementsRef = collection(db, "users", userId, "achievements")
    const achievementsSnapshot = await getDocs(achievementsRef)
    
    const achievements: Achievement[] = []
    achievementsSnapshot.forEach((doc) => {
      const data = doc.data()
      achievements.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        unlockedAt: data.unlockedAt?.toDate() || new Date()
      })
    })

    return achievements
  } catch (error) {
    console.error("獲取用戶成就時發生錯誤:", error)
    return []
  }
} 