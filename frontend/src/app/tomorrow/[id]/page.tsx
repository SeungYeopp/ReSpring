// src/app/tomorrow/[id]/page.tsx

export default function ChallengeDetailPage() {
  return (
    <div>
      <h1>챌린지 상세 페이지</h1>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { getSessionInfo } from "@/lib/api/user";
// import { Button } from "@/components/ui/button";
// import type { ChallengeDetail, ChallengeParticipant } from "../types/challenge";
// import { getChallengeDetail, joinChallenge, leaveChallenge, toggleChallengeLike, fetchChallengeParticipants } from "@/lib/api/tomorrow";
// import { mockChallengeDetail } from "../mocks/ChallengeDetailMocks";

// export default function ChallengeDetailPage() {
//   const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
//   const [session, setSession] = useState<{ userId: string } | null>(null);
//   const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isJoined, setIsJoined] = useState(false);

//   const params = useParams();
//   const router = useRouter();
//   const { id } = params;

//   // 세션 및 챌린지 정보 로드
//   useEffect(() => {
//     async function loadData() {
//       try {
//         const sessionData = await getSessionInfo();
//         setSession(sessionData);

//         const challengeData = await getChallengeDetail(Number(id), sessionData.userId);
//         setChallenge(challengeData);

//         const participantData = await fetchChallengeParticipants(Number(id));
//         setParticipants(participantData);

//         setIsLiked(challengeData.likes > 0); // 좋아요 상태 초기화
//         setIsJoined(participantData.some((p) => p.userId === sessionData.userId)); // 참가 여부 확인
//       } catch (error) {
//         console.error("데이터 로드 실패, Mock 데이터 사용:", error);
//         setChallenge(mockChallengeDetail);
//         setSession({ userId: mockChallengeDetail.ownerId || "defaultUserId" });
//       }
//     }

//     loadData();
//   }, [id]);

//   // 챌린지 수정 페이지 이동
//   const handleEdit = useCallback(() => {
//     router.push(`/tomorrow/edit/${id}`);
//   }, [id, router]);

//   // 챌린지 참가
//   const handleJoin = useCallback(async () => {
//     if (!session || !id) return;
//     const success = await joinChallenge(Number(id), session.userId);
//     if (success) {
//       setIsJoined(true);
//       alert("챌린지에 참가했습니다!");
//     }
//   }, [id, session]);

//   // 챌린지 나가기
//   const handleLeave = useCallback(async () => {
//     if (!session || !id) return;
//     const success = await leaveChallenge(Number(id), session.userId);
//     if (success) {
//       setIsJoined(false);
//       alert("챌린지에서 나갔습니다.");
//     }
//   }, [id, session]);

//   // 좋아요 토글
//   const handleToggleLike = useCallback(async () => {
//     if (!session || !id) return;
//     const success = await toggleChallengeLike(Number(id), session.userId);
//     if (success) {
//       setIsLiked((prev) => !prev);
//       alert(isLiked ? "좋아요를 취소했습니다." : "좋아요를 눌렀습니다!");
//     }
//   }, [id, session, isLiked]);

//   if (!challenge || !session) {
//     return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
//   }

//   const isOwner = session.userId === challenge.ownerId;

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
//       <img src={challenge.image} alt={challenge.title} className="w-full max-h-96 object-cover rounded-lg mb-4" />
//       <p className="text-gray-700 mb-4">{challenge.description}</p>
//       <p className="text-gray-500">참가자 수: {participants.length}</p>
//       <p className="text-gray-500">좋아요: {challenge.likes + (isLiked ? 1 : 0)}</p>
//       <p className="text-gray-500">조회수: {challenge.views}</p>

//       {/* 버튼 섹션 */}
//       <div className="flex gap-4 mt-6">
//         {isOwner ? (
//           <Button onClick={handleEdit} className="bg-green-500 hover:bg-green-600 text-white">
//             챌린지 수정하기
//           </Button>
//         ) : isJoined ? (
//           <Button onClick={handleLeave} className="bg-red-500 hover:bg-red-600 text-white">
//             챌린지 나가기
//           </Button>
//         ) : (
//           <Button onClick={handleJoin} className="bg-blue-500 hover:bg-blue-600 text-white">
//             챌린지 참가하기
//           </Button>
//         )}
//         <Button onClick={handleToggleLike} className={`bg-${isLiked ? "yellow" : "gray"}-500 hover:bg-${isLiked ? "yellow" : "gray"}-600 text-white`}>
//           {isLiked ? "좋아요 취소" : "좋아요"}
//         </Button>
//       </div>

//       {/* 참여자 리스트 */}
//       <section className="mt-8">
//         <h2 className="text-2xl font-bold mb-4">참여자 목록</h2>
//         <ul className="space-y-2">
//           {participants.map((participant) => (
//             <li key={participant.userId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow">
//               <img src={participant.profileImage} alt={participant.nickname} className="w-12 h-12 rounded-full" />
//               <span className="text-lg font-medium">{participant.nickname}</span>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </main>
//   );
// }
