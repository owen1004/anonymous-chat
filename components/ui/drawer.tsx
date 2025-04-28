"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { theme } from "@/styles/theme"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: "🏠", label: "首頁", path: "/" },
  { icon: "❓", label: "關於", path: "/about" },
  { icon: "✉️", label: "聯絡我們", path: "/contact" }
]

// 動畫設定
const drawerVariants = {
  hidden: {
    x: "-100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5,
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.5,
    },
  },
}

const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const router = useRouter()

  const handleItemClick = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          
          {/* Drawer 本體 */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 h-full w-[280px] bg-[#F8EFE3] shadow-xl z-50"
          >
            {/* 關閉按鈕 */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-[#E6DCD3]/50 transition-colors"
            >
              <X className="w-5 h-5 text-[#7A7363]" />
            </button>

            {/* 選單內容 */}
            <div className="flex flex-col h-full justify-center px-6 gap-6">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#7A7363] hover:bg-[#E6DCD3]/50 transition-colors text-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
