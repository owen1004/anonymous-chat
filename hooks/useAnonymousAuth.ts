"use client";

import { useEffect } from "react";
import { auth, signInAnonymously } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export function useAnonymousAuth() {
  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          console.error("匿名登入失敗", error);
        });
      }
    });
  }, []);
} 