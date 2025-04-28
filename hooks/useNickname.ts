import { useState, useEffect } from "react"

// 預設暱稱列表
const DEFAULT_NICKNAMES = [
  "夜色旅人",
  "靜夜微光",
  "晨曦漫步",
  "微風輕語",
  "星空漫遊",
  "月光傾城",
  "雲端漫步",
  "晨光微露",
  "暮色微光",
  "微光漫遊",
]

export function useNickname() {
  const [nickname, setNickname] = useState<string>("")

  // 從 LocalStorage 讀取暱稱
  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname")
    if (savedNickname) {
      setNickname(savedNickname)
    } else {
      // 如果沒有儲存的暱稱，使用預設值
      setNickname("匿名旅人")
    }
  }, [])

  // 更新暱稱
  const updateNickname = (newNickname: string) => {
    if (newNickname.length >= 2 && newNickname.length <= 20) {
      setNickname(newNickname)
      localStorage.setItem("nickname", newNickname)
    }
  }

  // 生成隨機暱稱
  const generateRandomNickname = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_NICKNAMES.length)
    const randomNickname = DEFAULT_NICKNAMES[randomIndex]
    updateNickname(randomNickname)
  }

  return {
    nickname,
    updateNickname,
    generateRandomNickname,
  }
} 