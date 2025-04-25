import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEydqud4Q0C2FVr0CoUk6moSpU6-4Fh1g",
  authDomain: "murmurchat-1e531.firebaseapp.com",
  projectId: "murmurchat-1e531",
  storageBucket: "murmurchat-1e531.firebasestorage.app",
  messagingSenderId: "393429019262",
  appId: "1:393429019262:web:98fc4d215811c585b4c62f"
};

// 初始化 Firebase 應用程式
const app = initializeApp(firebaseConfig);

// 初始化 Firebase Auth
const auth = getAuth(app);

// 初始化 Firestore
const db = getFirestore(app);

export { auth, signInAnonymously, db }; 