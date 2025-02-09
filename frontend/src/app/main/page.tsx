import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen -my-4 bg-gradient-to-r from-gray-100 to-white">
      <div className="md:w-1/2 flex justify-start items-end">
        <Image src="/main.png" alt="Main" width={450} height={400} className="object-contain max-h-[100%]" />
      </div>

      <div className="md:w-1/2 flex flex-col items-end justify-center p-6 mr-4">
        <div className="text-6xl font-semibold text-center md:text-right">
          시작해볼까요?
        </div>

        <div className="border-t border-gray-300 w-full my-12"></div>
        
        <div className="flex flex-col items-end space-y-2 w-full text-2xl">
          <a href="/yesterday/writenote" className="text-gray-400 hover:text-brand">
            글조각 작성 →
          </a>
          <a href="#" className="text-gray-400 hover:text-brand">
            봄의 서 읽기 →
          </a>
          <a href="#" className="text-gray-400 hover:text-brand">
            무언가 →
          </a>
        </div>
      </div>
    </div>
  );
}
