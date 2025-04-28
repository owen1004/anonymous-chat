"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const publicPaths = ["/", "/about", "/contact"]

export default function PathnameProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // 檢查是否需要驗證
  const needsAuth = !publicPaths.includes(pathname)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8EFE3]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AFAF]"></div>
      </div>
    )
  }

  if (needsAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8EFE3]">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#7A7363] mb-4">請先登入</h1>
          <p className="text-[#9CA3AF]">您需要登入才能訪問此頁面</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 