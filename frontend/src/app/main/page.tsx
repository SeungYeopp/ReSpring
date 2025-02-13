// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function Home() {
//   const images = ["/main1.png", "/main2.png", "/main3.png", "/main4.png"];
//   const [visibleCount, setVisibleCount] = useState(1);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   useEffect(() => {
//     if (visibleCount < images.length) {
//       const timeout = setTimeout(() => {
//         setVisibleCount((prev) => prev + 1);
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }
//   }, [visibleCount]);

//   return (
//     <div className="relative flex flex-col md:flex-row md:-my-4 h-screen bg-gradient-to-r md:from-white md:to-gray-100">
//       <div className="absolute bottom-0 mb-24 -ml-12 md:hidden w-full h-[70%] overflow-hidden">
//         {images.slice(0, visibleCount).map((src, i) => (
//           <motion.div
//             key={src}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="absolute inset-0 w-full h-full"
//           >
//             <Image 
//               src={src} 
//               alt={`Main ${i + 1}`} 
//               layout="fill" 
//               objectFit="contain"
//               objectPosition="bottom" 
//               className="scale-x-[-1]" 
//             />
//           </motion.div>
//         ))}
//       </div>

//       <div className="relative z-10 md:w-1/2 w-full h-1/2 md:h-full flex flex-col items-end justify-center p-6 mr-4">
//         <div className="text-5xl md:text-6xl font-semibold text-center md:text-right">시작해볼까요?</div>
//         <div className="border-t border-gray-300 w-full my-12"></div>

//         <div className="flex flex-col items-end space-y-2 w-full text-2xl text-brand">
//           <a href="/yesterday/writenote" className="md:text-gray-400 hover:text-brand">글조각 작성 →</a>
//           <a href="#" className="md:text-gray-400 hover:text-brand">봄의 서 읽기 →</a>
//           <a href="#" className="md:text-gray-400 hover:text-brand">무언가 →</a>
//         </div>
//       </div>

//       <div className="hidden md:flex md:w-1/2 h-full justify-end items-end relative">
//         {images.slice(0, visibleCount).map((src, i) => (
//           <motion.div
//             key={src}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1 }}
//             className="absolute w-full h-full flex justify-end items-end"
//           >
//             <Image 
//               src={src} 
//               alt={`Main ${i + 1}`} 
//               width={450} 
//               height={400} 
//               className="object-contain max-h-[100%] scale-x-[-1] md:scale-x-100" 
//             />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";
import Link from "next/link";
import { Bean, Sprout, Flower2 } from "lucide-react"

const Home = () => {
  const tileLinks = [
    { 
      id: 1, 
      url: "/yesterday", 
      title: "어제", 
      content: "당신의 이야기를 자서전으로 만들어보세요.", 
      bgColor: "bg-red-100", 
      circleColor: "bg-red-400", // Custom circle color
      icon: <Bean className="text-white w-8 h-8" />, // Custom icon
    },
    { 
      id: 2, 
      url: "/today", 
      title: "오늘", 
      content: "당신의 궁금증을 해결해보세요.", 
      bgColor: "bg-green-100", 
      circleColor: "bg-green-400", // Custom circle color
      icon: <Sprout className="text-white w-8 h-8" />, // Custom icon
    },
    { 
      id: 3, 
      url: "/tomorrow", 
      title: "내일", 
      content: "당신의 목표를 세워보세요.", 
      bgColor: "bg-blue-100", 
      circleColor: "bg-blue-400", // Custom circle color
      icon: <Flower2 className="text-white w-8 h-8" />, // Custom icon
    },
  ];

  const squareTileLinks = [
    { id: 4, url: "/square1", title: "글조각 작성", content: "글조각을 작성해보세요.", imageUrl: "/placeholder_badge.svg" },
    { id: 5, url: "/square2", title: "글 구경", content: "구독자의 글을 구경해보세요.", imageUrl: "/placeholder_badge.svg" },
    { id: 6, url: "/square3", title: "무언가", content: "아힝흥헹", imageUrl: "/placeholder_badge.svg" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="md:-pt-12 pb-4">
        <Sprout className="w-8 h-8 text-[#96b23c]" />
      </div>

      {/* Vertical Tiles Section */}
      <div className="w-full max-w-md space-y-4 flex flex-col">
        {tileLinks.map((tile) => (
          <Link key={tile.id} href={tile.url} passHref>
            <div className={`${tile.bgColor} p-6 rounded-2xl shadow-md cursor-pointer hover:opacity-80 flex items-center max-h-32 overflow-hidden`}>
              {/* Right part with Circle and Custom Icon */}
              <div className="w-1/3 -ml-8 -mr-2 flex justify-center items-center">
                <div className={`w-16 h-16 ${tile.circleColor} rounded-full flex justify-center items-center`}>
                  {tile.icon} {/* Render the custom icon passed in the tile object */}
                </div>
              </div>
              {/* Left part for text */}
              <div className="flex flex-col w-2/3">
                <h2 className="text-xl font-semibold">{tile.title}</h2>
                <p className="text-gray-600">{tile.content}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Square Tiles Section */}
      <div className="w-full max-w-md mt-8 flex justify-between gap-4">
        {squareTileLinks.map((tile) => (
          <Link key={tile.id} href={tile.url} passHref>
            <div className="bg-white rounded-2xl shadow-md cursor-pointer hover:bg-gray-200 w-full aspect-square flex flex-col">
              {/* Top part with Image (33%) */}
              <div className="h-1/3 w-full overflow-hidden flex justify-end">
                <img
                  src={tile.imageUrl}
                  alt={tile.title}
                  className="h-full object-cover"
                />
              </div>
              {/* Center part for text (33%) */}
              <div className="h-1/3 p-4 flex items-start">
                <h2 className="text-md font-semibold">{tile.title}</h2>
              </div>
              {/* Bottom part for text (33%) */}
              <div className="h-1/3 p-4 -mt-4 flex flex-col justify-start items-start">
                <p className="text-sm text-gray-600">{tile.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
