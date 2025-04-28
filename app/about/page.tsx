"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { theme } from "@/styles/theme"

export default function AboutPage() {
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
          <h1 className="text-3xl font-medium text-[#7A7363]">關於匿名聊天室</h1>
          <div className="space-y-4 text-[#7A7363]">
            <p className="leading-relaxed">
              這是一個讓你可以自由表達想法、分享故事的空間。在這裡，每個人都可以保持匿名，讓對話更加真誠和自在。
            </p>
            <p className="leading-relaxed">
              我們相信，有時候最深刻的對話，往往發生在陌生人與陌生人之間。不需要擔心身份、背景或過往，只需要專注於當下的交流。
            </p>
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