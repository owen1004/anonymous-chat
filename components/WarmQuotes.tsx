"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { encouragementQuotes } from "@/data/encouragementQuotes";

export default function WarmQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % encouragementQuotes.length);
    }, 12000); // 每12秒換一句
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mt-6">
      <motion.div
        key={currentQuoteIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="text-lg text-gray-600 dark:text-gray-300 px-4"
      >
        {encouragementQuotes[currentQuoteIndex]}
      </motion.div>
    </div>
  );
} 