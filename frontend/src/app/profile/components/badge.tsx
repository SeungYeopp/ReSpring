"use client";

interface BadgeModalProps {
  badge: string;
  onClose: () => void;
}

const badgeDescriptions: Record<string, { name: string; description: string }> = {
  flame: { name: "도전의 불꽃", description: "열정적으로 도전에 참여한 사용자에게 주어지는 배지입니다." },
  bookCheck: { name: "지식의 기록자", description: "봄날의 서에 첫 편찬을 완료한 사용자에게 주어지는 배지입니다." },
  footprints: { name: "발자취를 남기다", description: "다양한 활동에 참여한 사용자에게 주어지는 배지입니다." },
};

export default function BadgeModal({ badge, onClose }: BadgeModalProps) {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-20"
      onClick={onClose} //   배경 클릭 시 닫힘
    >
      <div 
        className="bg-white p-6 rounded-lg text-center shadow-lg w-80 transform scale-100 transition-transform duration-200"
        onClick={(e) => e.stopPropagation()} //   내부 클릭 시 닫힘 방지
      >
        <h2 className="text-lg font-bold mb-2">{badgeDescriptions[badge]?.name}</h2>
        <p>{badgeDescriptions[badge]?.description}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
