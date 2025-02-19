"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChallengeDetailTab } from "../components/detail/challenge-detail-tab"
import { ChallengeChatTab } from "../components/detail/challenge-chat-tab"
import { Heart, Eye, Edit, ArrowLeft, LogOut, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ChallengeDetail } from "@/app/tomorrow/types/challenge"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { getChallengeDetail, toggleChallengeLike, getSessionInfo, leaveChallenge } from "@/lib/api"
import LoadingScreen from "@/components/custom/LoadingScreen"
import { getUserInfo, type UserInfo } from "@/lib/api";
import { ParticipantListModal } from "../components/detail/participant-list-modal"

export default function ChallengePage({ params }: { params: { id: number } }) {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null)
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 현재 로그인한 유저의 ID를 저장하는 state (추가)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  //  좋아요 토글 핸들러
  const handleLikeClick = async () => {
    if (!challenge) return;
    try {
      const success = await toggleChallengeLike(challenge.id);
      if (success) {
        // 좋아요 상태를 토글하고, 좋아요 카운드도 함께 조정
        setIsLiked((prev) => !prev);
        setChallenge((prevChallenge) => {
          if (!prevChallenge) return prevChallenge;
          return {
            ...prevChallenge,
            likes: isLiked ? prevChallenge.likes - 1 : prevChallenge.likes + 1,
          };
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };
  
    fetchUserInfo();
  }, []);

  // 나가기 버튼 핸들러 (챌린지 소유자가 아닐 경우)
  const handleLeaveChallenge = async () => {
    try {
      const success = await leaveChallenge(challenge!.id)
      if (success) {
        console.log("챌린지 나가기 성공")
        // 탈퇴 후 챌린지 목록 페이지 등으로 이동 (예시)
        router.push("/tomorrow")
      } else {
        console.error("챌린지 나가기 실패")
      }
    } catch (error) {
      console.error("챌린지 나가기 중 에러 발생:", error)
    }
  }
  

  // // 세션 정보를 통해 현재 유저의 ID를 가져와서 저장 (추가)
  // useEffect(() => {
  //   async function fetchSession() {
  //     try {
  //       const sessionInfo = await getSessionInfo();
  //       setCurrentUserId(sessionInfo.userId);
  //     } catch (error) {
  //       console.error("세션 정보 불러오기 실패:", error);
  //     }
  //   }
  //   fetchSession();
  // }, []);


  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challengeData = await getChallengeDetail(params.id);
        // 서버 응답이 liked 필드를 포함한다면, 이를 isLike에 매핑합니다.
        setChallenge(challengeData);
        setIsLiked(challengeData.isLike);
      } catch (error) {
        console.error("Failed to fetch challenge details:", error);
      }
    };
  
    fetchChallenge();
  }, [params.id]);
  

  if (!challenge) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-background pt-4 pb-16 md:pt-6 md:pb-6 flex flex-col">
      
      {isModalOpen && (
      <ParticipantListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        challengeId={challenge.id}
        theme="light"
      />
    )}


      <div className="container mx-auto px-4 flex-grow flex flex-col">
        <div className="w-full lg:max-w-6xl mx-auto flex-grow flex flex-col">
          <div className="lg:flex lg:gap-6 flex-grow">
            <Card className="w-full lg:w-[55%] overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={challenge.imageUrl || "/placeholder.svg"}
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
          onClick={() => router.push(`/tomorrow`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>뒤로 가기</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  {userInfo?.userNickname === challenge.ownerNickname ? (
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
) : (
  challenge.isParticipating && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLeaveChallenge}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>나가기</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)}

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
                    <div className="flex items-center space-x-4">
  {/* 좋아요 */}
  <div className="flex items-center text-white" onClick={handleLikeClick}>
    <Heart className={`w-5 h-5 mr-1 ${isLiked ? "fill-red-500" : "fill-gray-500"}`} />
    <span>{challenge.likes}</span>
  </div>

  {/* 참여자 버튼 */}
  <button
    className="flex items-center text-white"
    onClick={() => setIsModalOpen(true)}
  >
    <Users className="w-5 h-5 mr-1" />
    <span>{challenge.participantCount}</span>
  </button>
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
                      <ChallengeChatTab chatRoomId={challenge.chatRoomId} />                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                <div className="hidden lg:block p-6 overflow-visible">
                  <ChallengeDetailTab challenge={challenge} />
                </div>
              </CardContent>
            </Card>
            <div className="hidden lg:flex lg:flex-col w-[45%] mt-6 lg:mt-0 rounded-lg shadow-md border bg-white h-[calc(100vh-150px)] max-h-[80vh] overflow-hidden">
            <ChallengeChatTab chatRoomId={challenge.chatRoomId} />            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
