'use client';

import { useState, useEffect } from 'react';
import { auth, signInAnonymously, db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export default function TestFirebase() {
  const [status, setStatus] = useState('等待開始...');
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStartChat = async () => {
    try {
      setStatus('正在進行匿名登入...');
      const userCredential = await signInAnonymously(auth);
      setUser(userCredential.user);
      setStatus('匿名登入成功！');
      
      // 在控制台輸出使用者 UID
      console.log('使用者 UID:', userCredential.user.uid);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      setStatus(`錯誤：${errorMessage}`);
      console.error('登入錯誤:', error);
    }
  };

  if (!isClient) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Firebase 測試頁面</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">狀態：</h2>
            <p className="text-lg">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase 測試頁面</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">狀態：</h2>
          <p className="text-lg">{status}</p>
        </div>
        <button
          onClick={handleStartChat}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          開始聊天
        </button>
        {user && (
          <div>
            <h2 className="text-xl font-semibold">使用者資訊：</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 