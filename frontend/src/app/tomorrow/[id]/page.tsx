"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChallengeDetailTab } from "../components/detail/challenge-detail-tab"
import { ChallengeChatTab } from "../components/detail/challenge-chat-tab"
import { Heart, Eye, Edit, ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ChallengeDetail } from "@/app/tomorrow/types/challenge"
import { getMockChallengeDetail } from "../mocks/ChallengeDetailMocks"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

export default function ChallengePage({ params }: { params: { id: string } }) {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null)
  const router = useRouter()

  useEffect(() => {
    const challengeData = getMockChallengeDetail(params.id)
    if (challengeData) {
      setChallenge(challengeData)
    }
  }, [params.id])

  if (!challenge) {
    return <div>Loading...</div> // Todo:로딩스크린으로 바꾸자
  }

  return (
    <main className="min-h-screen bg-background pt-4 pb-16 md:pt-6 md:pb-6 flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex flex-col">
        <div className="w-full lg:max-w-6xl mx-auto flex-grow flex flex-col">
          <div className="lg:flex lg:gap-6 flex-grow">
            <Card className="w-full lg:w-[55%] overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={challenge.image || "/placeholder.svg"}
                  alt={challenge.title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-white/80 hover:bg-white text-gray-800"
                            onClick={() => window.history.back()}
                          >
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
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-white/80 hover:bg-white text-gray-800"
                            onClick={() => router.push(`/tomorrow/edit/${challenge.id}`)}
                          >
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
                    <div className="flex flex-col">
                      <p className="text-sm text-white mb-1">
                        {format(parseISO(challenge.startDate), "yyyy.M.d", { locale: ko })} -{" "}
                        {format(parseISO(challenge.endDate), "yyyy.M.d", { locale: ko })}
                      </p>
                      <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-white">
                        <Heart className="w-5 h-5 mr-1 fill-red-500" />
                        <span>{challenge.likes}</span>
                      </div>
                      <div className="flex items-center text-white">
                        {/* <Eye className="w-5 h-5 mr-1 text-blue-500" />
                        <span>{challenge.views}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-0 overflow-visible">
                <div className="lg:hidden">
                  <Tabs defaultValue="detail" className="w-full p-0">
                    <TabsList className="w-full rounded-none h-12 border-b p-0 m-0 shadow-none">
                      <TabsTrigger value="detail" className="flex-1 data-[state=active]:border-b-2">
                        도전 상세
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="flex-1 data-[state=active]:border-b-2 ">
                        다른 사람 채팅
                      </TabsTrigger>
                    </TabsList>
                    <div className=" overflow-visible">
                      <TabsContent value="detail" className="mt-0 overflow-visible">
                        <ChallengeDetailTab challenge={challenge} />
                      </TabsContent>
                      <TabsContent value="chat" className="mt-0 h-[60vh] overflow-hidden">
                        <ChallengeChatTab />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                <div className="hidden lg:block p-6 overflow-visible">
                  <ChallengeDetailTab challenge={challenge} />
                </div>
              </CardContent>
            </Card>
            <div className="hidden lg:flex lg:flex-col w-[45%] mt-6 lg:mt-0 rounded-lg shadow-md border bg-white h-[calc(100vh-150px)] max-h-[80vh] overflow-hidden">
              <ChallengeChatTab />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

