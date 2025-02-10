"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const images = ["/main1.png", "/main2.png", "/main3.png", "/main4.png"];
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount < images.length) {
      const timeout = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [visibleCount]);

  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-gradient-to-r from-gray-50 to-white">
      <div className="absolute bottom-0 mb-24 -ml-12 md:hidden w-full h-[70%] overflow-hidden">
        {images.slice(0, visibleCount).map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image 
              src={src} 
              alt={`Main ${i + 1}`} 
              layout="fill" 
              objectFit="contain"
              objectPosition="bottom" 
              className="scale-x-[-1]" 
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 md:w-1/2 w-full h-1/2 md:h-full flex flex-col items-end justify-center p-6 mr-4">
        <div className="text-5xl md:text-6xl font-semibold text-center md:text-right">시작해볼까요?</div>
        <div className="border-t border-gray-300 w-full my-12"></div>

        <div className="flex flex-col items-end space-y-2 w-full text-2xl text-brand">
          <a href="/yesterday/writenote" className="md:text-gray-400 hover:text-brand">글조각 작성 →</a>
          <a href="#" className="md:text-gray-400 hover:text-brand">봄의 서 읽기 →</a>
          <a href="#" className="md:text-gray-400 hover:text-brand">무언가 →</a>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 h-full justify-end items-end relative">
        {images.slice(0, visibleCount).map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute w-full h-full flex justify-end items-end"
          >
            <Image 
              src={src} 
              alt={`Main ${i + 1}`} 
              width={450} 
              height={400} 
              className="object-contain max-h-[100%] scale-x-[-1] md:scale-x-100" 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
