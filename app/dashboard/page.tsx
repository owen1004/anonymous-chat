"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOutUser, onAuthStateChange } from '@/lib/firebase-auth'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from 'lucide-react'

const interests = [
  { id: 'travel', label: '✈️ 旅行' },
  { id: 'movie', label: '🎬 電影' },
  { id: 'reading', label: '📚 閱讀' },
  { id: 'sports', label: '⚽ 運動' },
  { id: 'food', label: '🍜 美食' },
  { id: 'music', label: '🎵 音樂' },
  { id: 'art', label: '🎨 藝術' },
  { id: 'gaming', label: '🎮 遊戲' },
]

const zodiacSigns = [
  '白羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
  '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState({
    nickname: '',
    bio: '',
    gender: '',
    zodiac: '',
    interests: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      try {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data() as any)
        }
      } catch (error) {
        setError('喔喔，好像出了點小問題～我們正在努力修復！🌱')
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    setError(null)
    
    try {
      const docRef = doc(db, 'users', user.uid)
      await setDoc(docRef, profile)
    } catch (error) {
      setError('儲存時遇到了一些問題，請稍後再試～🌱')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInterestToggle = (interestId: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <p className="text-gray-600">請先登入</p>
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            登入
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 pb-20">
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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-medium text-gray-800 mb-6">個人資料</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback>
                  {user.email?.[0].toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-medium">{user.email}</h2>
                <p className="text-sm text-gray-500">點擊更換頭像</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>暱稱</Label>
              <Input
                value={profile.nickname}
                onChange={(e) => setProfile(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="請輸入暱稱"
                maxLength={20}
              />
              <p className="text-sm text-gray-500 text-right">
                {profile.nickname.length}/20
              </p>
            </div>

            <div className="space-y-2">
              <Label>個人簡介</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="寫點什麼來介紹自己..."
                maxLength={300}
                className="h-32"
              />
              <p className="text-sm text-gray-500 text-right">
                {profile.bio.length}/300
              </p>
            </div>

            <div className="space-y-2">
              <Label>性別</Label>
              <RadioGroup
                value={profile.gender}
                onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">男</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">女</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">其他</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>星座</Label>
              <Select
                value={profile.zodiac}
                onValueChange={(value) => setProfile(prev => ({ ...prev, zodiac: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選擇星座" />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map(sign => (
                    <SelectItem key={sign} value={sign}>
                      {sign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>興趣</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <Badge
                    key={interest.id}
                    variant={profile.interests.includes(interest.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    {interest.label}
                  </Badge>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full
                       hover:from-orange-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '儲存中...' : '儲存變更'}
            </button>
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