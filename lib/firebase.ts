// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { 
  getAuth, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword }

// 正確定義 onAuthStateChangedListener
export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// 註冊功能
export async function signUpWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    let errorMessage = "註冊失敗，請稍後再試";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "此信箱已被註冊";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "密碼強度不足，請使用至少 6 個字元";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "無效的信箱格式";
    }
    return { user: null, error: errorMessage };
  }
}