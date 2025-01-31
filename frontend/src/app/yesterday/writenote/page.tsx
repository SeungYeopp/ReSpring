"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const entries = [
  { title: "1학년", subtitle: "1988년" },
  { title: "2학년", subtitle: "1989년" },
  { title: "3학년", subtitle: "1990년" },
  { title: "4학년", subtitle: "1991년" },
];

export default function WriteNotePage() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 text-xl text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">글조각 쓰기</h1>
        <Button onClick={() => console.log("Next clicked")}>
          다음
        </Button>
      </div>

      <div className="flex flex-col space-y-2 p-4 mt-4">
        {entries.map((entry) => (
          <SelectableEntry
            key={entry.title}
            title={entry.title}
            subtitle={entry.subtitle}
            isSelected={selected === entry.title}
            onClick={() => setSelected(entry.title)}
          />
        ))}
      </div>
    </div>
  );
}

function SelectableEntry({
  title,
  subtitle,
  isSelected,
  onClick,
}: {
  title: string;
  subtitle: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full p-4 border rounded-md cursor-pointer transition flex justify-between items-center ${
        isSelected ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>
      <span className="w-1/2 text-2xl font-bold text-left">{title}</span>
    </div>
  );
}
