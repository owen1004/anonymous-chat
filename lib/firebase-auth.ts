import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './firebase'

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    let errorMessage = "註冊失敗，請稍後再試"
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "此電子郵件已被註冊"
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "電子郵件格式不正確"
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "密碼強度不足，請使用至少 6 個字元"
    }
    
    return { user: null, error: errorMessage }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    let errorMessage = "登入失敗，請稍後再試"
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = "找不到此帳號"
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "密碼錯誤"
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "電子郵件格式不正確"
    }
    
    return { user: null, error: errorMessage }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: "登出失敗，請稍後再試" }
  }
}

export const getCurrentUser = () => {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
} 