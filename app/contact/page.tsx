"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { theme } from "@/styles/theme"

export default function ContactPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8EFE3] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h1 className="text-3xl font-medium text-[#7A7363]">聯絡我們</h1>
          <div className="space-y-4 text-[#7A7363]">
            <p className="leading-relaxed">
              如果你有任何問題、建議或想法，歡迎隨時與我們聯繫。我們重視每一位使用者的意見，並會盡快回覆你的訊息。
            </p>
            <p className="leading-relaxed">
              你可以透過以下方式聯絡我們：
            </p>
            <div className="space-y-2">
              <p>Email: support@anonymous-chat.com</p>
              <p>Twitter: @anonymous_chat</p>
            </div>
          </div>

          {/* 返回首頁按鈕 */}
          <motion.button
            onClick={() => router.push("/")}
            className={`${theme.styles.button.common} px-8 py-3 text-lg mt-8`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            返回首頁
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
} 