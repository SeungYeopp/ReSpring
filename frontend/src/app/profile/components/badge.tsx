"use client";

interface BadgeModalProps {
  badge: string;
  onClose: () => void;
}

const badgeDescriptions: Record<string, { name: string; description: string }> = {
  badge1: { name: "새로 가입", description: "처음으로 가입한 사용자에게 주어지는 배지입니다." },
  badge2: { name: "첫 방문", description: "처음으로 방문한 사용자에게 주어지는 배지입니다." },
};

export default function BadgeModal({ badge, onClose }: BadgeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg text-center shadow-lg w-80">
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
