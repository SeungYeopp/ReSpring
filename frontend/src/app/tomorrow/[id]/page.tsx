"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TomorrowDetail() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold text-primary">챌린지 상세</h1>

      {/* Tailwind 테스트 */}
      <div className="bg-slate-100 p-4 rounded-lg">
        <p className="text-blue-500 font-bold">Tailwind가 작동하면 이 텍스트는 파란색입니다.</p>
      </div>

      {/* shadcn/ui 테스트 */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">shadcn/ui 테스트</h2>
        <Button>이 버튼이 보이면 shadcn/ui가 작동합니다</Button>
      </Card>
      <p></p>
    </div>
  );
}
