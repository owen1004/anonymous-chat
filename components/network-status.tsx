"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowAlert(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            isOnline ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <p className="flex items-center gap-2">
            {isOnline ? (
              <>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                網路已恢復
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-white rounded-full" />
                網路連線已斷開
              </>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 