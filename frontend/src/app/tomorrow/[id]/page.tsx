"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChallengeDetailTab } from "../components/detail/challenge-detail-tab";
import { ChallengeChatTab } from "../components/detail/challenge-chat-tab";
import { Heart, Eye, Edit, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChallengeDetail } from "@/app/tomorrow/types/challenge";
import mockChallengeDetails from "../mocks/ChallengeDetailMocks";

// ID에 해당하는 챌린지를 반환하는 함수
export function getMockChallengeDetail(id: string): ChallengeDetail | null {
  const challenge = mockChallengeDetails.find((challenge) => challenge.id.toString() === id);
  return challenge || null;
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);

  useEffect(() => {
    const challengeData = getMockChallengeDetail(params.id);
    if (challengeData) {
      setChallenge(challengeData);
    }
  }, [params.id]);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-background pt-4 pb-16 md:pt-6 md:pb-6 flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex flex-col">
        <div className="w-full lg:max-w-6xl mx-auto flex-grow flex flex-col">
          <div className="lg:flex lg:gap-6 flex-grow">
            <Card className="w-full lg:w-[55%] overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image src={challenge.image || "/placeholder.svg"} alt={challenge.title} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white text-gray-800" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>뒤로 가기</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white text-gray-800">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>수정하기</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between items-end">
                    <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-white">
                        <Heart className="w-5 h-5 mr-1 fill-red-500" />
                        <span>{challenge.likes}</span>
                      </div>
                      <div className="flex items-center text-white">
                        <Eye className="w-5 h-5 mr-1 text-blue-500" />
                        <span>{challenge.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="lg:hidden">
                  <Tabs defaultValue="detail" className="w-full">
                    <TabsList className="w-full rounded-none h-12 border-b">
                      <TabsTrigger value="detail" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#8BC34A]">
                        도전 상세
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-[#8BC34A]">
                        다른 사람 채팅
                      </TabsTrigger>
                    </TabsList>
                    <div className="p-6">
                      <TabsContent value="detail" className="mt-0">
                        <ChallengeDetailTab challenge={challenge} />
                      </TabsContent>
                      <TabsContent value="chat" className="mt-0">
                        <ChallengeChatTab />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                <div className="hidden lg:block p-6">
                  <ChallengeDetailTab challenge={challenge} />
                </div>
              </CardContent>
            </Card>
            <div className="hidden lg:flex lg:flex-col w-[45%] mt-6 lg:mt-0 rounded-lg shadow-md border bg-white h-[calc(100vh-150px)] max-h-[600px]">
              <ChallengeChatTab />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
