"use client";

import { useState } from "react";

interface MatchingState {
  isMatching: boolean;
  roomId: string | null;
  startMatching: () => void;
  leaveMatching: () => void;
}

export function useMatching(): MatchingState {
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  function startMatching(): void {
    setIsMatching(true);
    // 這裡目前暫時用假資料模擬配對成功
    setTimeout(() => {
      const mockRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(mockRoomId);
      setIsMatching(false);
    }, 2000); // 假設2秒後配對成功
  }

  function leaveMatching(): void {
    setIsMatching(false);
    setRoomId(null);
  }

  return {
    isMatching,
    roomId,
    startMatching,
    leaveMatching,
  };
} 