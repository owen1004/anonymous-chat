"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const interests = [
  { id: 'travel', label: '✈️ 旅行' },
  { id: 'movie', label: '🎬 電影' },
  { id: 'reading', label: '📚 閱讀' },
  { id: 'sports', label: '⚽ 運動' },
  { id: 'food', label: '🍜 美食' },
  { id: 'music', label: '🎵 音樂' },
  { id: 'art', label: '🎨 藝術' },
  { id: 'gaming', label: '🎮 遊戲' },
];

const zodiacSigns = [
  '白羊座', '金牛座', '雙子座', '巨蟹座', '獅子座', '處女座',
  '天秤座', '天蠍座', '射手座', '摩羯座', '水瓶座', '雙魚座'
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
          }
        } catch (err) {
          setError("無法連線至伺服器，請稍後再試");
          console.error("Error fetching user data:", err);
        }
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="space-y-4 max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800">尚未登入，請先登入來享受完整的旅程喔🌿</h2>
          <p className="text-gray-600">一段值得記錄的對話，從一個小帳號開始。</p>
          <Link 
            href="/login"
            className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity"
          >
            前往登入
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">個人資料</h1>
        {profileData && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-600">暱稱：{profileData.nickname || "未設定"}</p>
              <p className="text-gray-600">性別：{profileData.gender || "未設定"}</p>
              <p className="text-gray-600">星座：{profileData.zodiac || "未設定"}</p>
              <p className="text-gray-600">簡介：{profileData.bio || "未設定"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 