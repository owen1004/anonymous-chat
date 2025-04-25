import { useEffect, useState } from "react"
import { Achievement } from "@/lib/achievements"

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-sm border border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white text-xl">
            🎖️
          </div>
          <div>
            <h3 className="font-medium text-gray-800">成就解鎖！</h3>
            <p className="text-sm text-gray-600">
              你獲得了【{achievement.title}】徽章
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          {achievement.description}
        </p>
      </div>
    </div>
  )
} 