"use client";

import React, { useState, useEffect } from "react";
import { getAllBooksByUserNickname } from "@/lib/api/book";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, BookOpen, Trophy } from 'lucide-react';

const StatSummary: React.FC<{ userNickname: string; challengeCount: number }> = ({
  userNickname: userId,
  challengeCount,
}) => {
  const [bookCount, setBookCount] = useState<number | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const books = await getAllBooksByUserNickname(userId);
        setBookCount(books.length);
        const total = books.reduce((sum, book) => sum + book.likeCount, 0);
        setTotalLikes(total);
      } catch (error) {
        console.error("Failed to fetch book count:", error);
      }
    };

    fetchBookCount();
  }, [userId]);

  const renderStat = (
    label: string,
    value: number | string,
    icon: React.ElementType,
    href: string | null
  ) => {
    const content = (
      <>
        {React.createElement(icon, {
          className: `w-5 h-5 mb-2 ${href ? 'text-blue-500' : 'text-gray-600'}`
        })}
        <div className={`text-2xl font-bold mb-1 ${
          href ? 'text-blue-500 group-hover:underline' : 'text-gray-900'
        }`}>
          {value}
        </div>
        <div className="text-sm text-gray-600">
          {label}
        </div>
      </>
    );

    return href ? (
      <Link href={href} className="relative group flex flex-col items-center justify-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:bg-gray-50/50 transition-colors cursor-pointer">
        {content}
      </Link>
    ) : (
      <div className="relative group flex flex-col items-center justify-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50">
        {content}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {renderStat("받은 응원", totalLikes, Heart, null)}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderStat(
            "나의 서재",
            bookCount !== null ? bookCount : "...",
            BookOpen,
            `/yesterday/booklist/${userId}`
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderStat("진행 도전", challengeCount, Trophy, null)}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StatSummary;