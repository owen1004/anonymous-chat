import { useState, useEffect } from "react"
import { Achievement, getUserAchievements } from "@/lib/achievements"
import { BADGES } from "@/lib/achievements"

interface AchievementSidebarProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export default function AchievementSidebar({ userId, isOpen, onClose }: AchievementSidebarProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAchievements = async () => {
      if (userId) {
        const userAchievements = await getUserAchievements(userId)
        setAchievements(userAchievements)
        setIsLoading(false)
      }
    }

    loadAchievements()
  }, [userId])

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-800">我的徽章</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(BADGES).map((badge) => {
              const unlocked = achievements.find((a) => a.id === badge.id)
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border ${
                    unlocked
                      ? "bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        unlocked
                          ? "bg-gradient-to-br from-orange-400 to-pink-400 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      🎖️
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{badge.title}</h3>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      {unlocked && (
                        <p className="text-xs text-gray-500 mt-1">
                          解鎖於：{unlocked.unlockedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 