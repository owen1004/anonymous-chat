"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">設定</h1>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">帳號設定</h2>
            <div className="space-y-2">
              <p className="text-gray-600">電子郵件：{user.email}</p>
              <button
                onClick={() => auth.signOut()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 