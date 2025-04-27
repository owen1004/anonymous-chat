"use client"

import { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '@/lib/firebase'

interface AuthSwitcherProps {
  onSuccess: (user: any) => void
  onError: (error: string) => void
}

export default function AuthSwitcher({ onSuccess, onError }: AuthSwitcherProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = isLogin
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)
      
      onSuccess(user)
    } catch (error: any) {
      let errorMessage = "發生錯誤，請稍後再試"
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "找不到此信箱的帳號"
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "密碼錯誤"
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "此信箱已被註冊"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "密碼強度不足，請使用至少 6 個字元"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "信箱格式不正確"
      }
      
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded-l-full ${
            isLogin ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          登入
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded-r-full ${
            !isLogin ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          註冊
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            電子信箱
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            密碼
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {isLoading ? "處理中..." : isLogin ? "登入" : "註冊"}
        </button>
      </form>
    </div>
  )
} 