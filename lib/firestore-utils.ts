import { db } from './firebase'
import { getDoc, doc, DocumentReference, DocumentSnapshot } from 'firebase/firestore'
import { useState, useEffect } from 'react'

export const safeGetDoc = async (docRef: DocumentReference): Promise<DocumentSnapshot> => {
  try {
    // 檢查 Firebase 是否已初始化
    if (!db) {
      throw new Error('Firebase 尚未初始化完成')
    }

    // 檢查網路狀態
    if (typeof window !== 'undefined' && !navigator.onLine) {
      throw new Error('目前未連上網路，請稍候再試')
    }

    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error('找不到指定的文件')
    }

    return docSnap
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('offline')) {
        throw new Error('目前未連上網路，請稍候再試')
      } else if (error.message.includes('Firebase 尚未初始化')) {
        throw new Error('系統正在初始化中，請稍候再試')
      } else if (error.message.includes('找不到指定的文件')) {
        throw new Error('找不到指定的資料')
      }
    }
    throw new Error('讀取資料時發生錯誤，請稍候再試')
  }
}

// 用於 client component 的安全文件讀取 hook
export const useSafeGetDoc = (docRef: DocumentReference) => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await safeGetDoc(docRef)
        setData(docSnap.data())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '讀取資料時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [docRef])

  return { data, error, loading }
} 