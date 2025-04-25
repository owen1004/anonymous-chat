"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOutUser, onAuthStateChange } from '@/lib/firebase-auth'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-light text-gray-800">
            會員中心
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-white text-orange-600 rounded-lg shadow-sm hover:bg-orange-50 transition-colors"
          >
            登出
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">個人資料</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">電子郵件</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">我的徽章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 徽章列表將在之後擴充 */}
            <div className="text-center text-gray-500">
              尚未獲得任何徽章
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </main>
  )
} 