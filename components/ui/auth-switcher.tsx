'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Button from './button'

export default function AuthSwitcher() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
        router.push('/chat-history')
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // 建立使用者文件
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
          lastLogin: new Date()
        })
        
        router.push('/chat-history')
      }
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('無效的電子郵件格式')
          break
        case 'auth/email-already-in-use':
          setError('此電子郵件已被註冊')
          break
        case 'auth/weak-password':
          setError('密碼強度不足')
          break
        case 'auth/user-not-found':
          setError('找不到此用戶')
          break
        case 'auth/wrong-password':
          setError('密碼錯誤')
          break
        default:
          setError('發生錯誤，請稍後再試')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/70 rounded-2xl shadow-lg px-8 py-10">
        <h2 className="text-2xl font-medium text-gray-800 text-center mb-2">
          {isLogin ? '歡迎回來' : '加入我們'}
        </h2>
        
        {isLogin ? (
          <p className="text-center text-sm text-gray-600 italic mb-4">
            讓我們為你保留一段過去的對話時光 ✨
          </p>
        ) : (
          <p className="text-xs text-gray-500 text-center mt-4">
            註冊後，你的聊天記錄將會自動儲存，未來還可以再續聊 🍀
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-full text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              電子郵件
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-light text-gray-600 mb-1">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          <Button type="submit">
            {isLogin ? '登入' : '註冊'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isLogin ? '還沒有帳號？立即註冊' : '已有帳號？立即登入'}
          </button>
        </div>
      </div>
    </div>
  )
} 