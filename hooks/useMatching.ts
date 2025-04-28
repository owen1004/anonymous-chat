"use client";

import { useState, useEffect, useRef } from "react";

interface MatchingState {
  isMatching: boolean;
  isTimeout: boolean;
  roomId: string | null;
  startMatching: () => void;
  leaveMatching: () => void;
  resetTimeout: () => void;
}

export function useMatching(): MatchingState {
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMatching) {
      // 清除之前的 timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // 設置新的 timeout
      timeoutRef.current = setTimeout(() => {
        setIsTimeout(true);
        setIsMatching(false);
      }, 15000); // 15 秒超時
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMatching]);

  function startMatching(): void {
    setIsMatching(true);
    setIsTimeout(false);
    // 這裡目前暫時用假資料模擬配對成功
    setTimeout(() => {
      const mockRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(mockRoomId);
      setIsMatching(false);
      resetTimeout();
    }, 2000); // 假設2秒後配對成功
  }

  function leaveMatching(): void {
    setIsMatching(false);
    setRoomId(null);
    resetTimeout();
  }

  function resetTimeout(): void {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsTimeout(false);
  }

  return {
    isMatching,
    isTimeout,
    roomId,
    startMatching,
    leaveMatching,
    resetTimeout,
  };
} 