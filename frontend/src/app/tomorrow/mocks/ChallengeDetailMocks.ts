// // src/app/tomorrow/mocks/ChallengeDetailMock.ts
// import { ChallengeDetail } from "@/app/tomorrow/types/challenge";
// import { subDays, format } from "date-fns";

// // 최근 30일의 기록을 생성하는 함수
// function generateRecentRecords() {
//   const records: { [key: string]: "SUCCESS" | "FAIL" } = {};
//   const today = new Date("2025-02-09"); // 기준 날짜로 설정

//   for (let i = 30; i >= 0; i--) {
//     const date = subDays(today, i);
//     const dateString = format(date, "yyyy-MM-dd");

//     records[dateString] = Math.random() < 0.8 ? "SUCCESS" : "FAIL";
//   }

//   // 생성된 records 확인
//   console.log("Generated Records:", records);
//   return records;
// }

// /**   랜덤 프로필 이미지 생성 함수 */
// const getRandomImage = () => {
//   const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
//   return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
// };

// const mockChallengeDetails: ChallengeDetail[] = [
//   {
//     id: 1,
//     title: "2월 독서 챌린지",
//     description:
//       "매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.매일 30분 독서를 목표로 하는 챌린지입니다.",
//     image: getRandomImage(),
//     imageUrl: getRandomImage(),
//     registerDate: "2025-01-30T10:00:00",
//     startDate: "2025-02-01T00:00:00",
//     endDate: "2025-03-02T23:59:59",
//     tags: [
//       { id: 1, name: "독서" },
//       { id: 2, name: "자기계발" },
//       { id: 3, name: "습관형성" }
//     ],
//     participantCount: 1250,
//     likes: 328,
//     views: 5420,
//     // 기존 isSuccessToday -> successToday
//     successToday: true,
//     longestStreak: 15,
//     currentStreak: 5,
//     successRate: 90.5,
//     status: "ONGOING",
//     ownerId: "user123",
//     records: generateRecentRecords(),
//     isParticipating: true,
//     // 추가: isLike 프로퍼티 (예시로 true 설정)
//     isLike: true,
//   },
//   {
//     id: 2,
//     title: "3월 운동 챌린지",
//     description: "하루 30분 이상 운동하여 건강한 습관을 만들어보세요.",
//     image: getRandomImage(),
//     imageUrl: getRandomImage(),
//     registerDate: "2025-02-15T14:30:00",
//     startDate: "2025-03-05T00:00:00",
//     endDate: "2025-04-05T23:59:59",
//     tags: [
//       { id: 1, name: "운동" },
//       { id: 2, name: "건강" },
//       { id: 3, name: "다이어트트" }
//     ],
//     participantCount: 3780,
//     likes: 952,
//     views: 12500,
//     successToday: false,
//     longestStreak: 7,
//     currentStreak: 0,
//     successRate: 75.8,
//     status: "UPCOMING",
//     ownerId: "user456",
//     records: {},
//     isParticipating: false,
//     isLike: false,
//   },
//   {
//     id: 3,
//     title: "1일 1커밋 챌린지",
//     description: "매일 최소 1개의 커밋을 GitHub에 올리는 챌린지입니다.",
//     image: getRandomImage(),
//     imageUrl: getRandomImage(),
//     registerDate: "2025-01-20T09:15:00",
//     startDate: "2025-01-25T00:00:00",
//     endDate: "2025-06-30T23:59:59",
//     tags: [
//       { id: 1, name: "코딩" },
//       { id: 2, name: "개발" },
//       { id: 3, name: "GitHub" }
//     ],
//     participantCount: 5230,
//     likes: 1890,
//     views: 28700,
//     successToday: true,
//     longestStreak: 45,
//     currentStreak: 45,
//     successRate: 98.2,
//     status: "ONGOING",
//     ownerId: "user789",
//     records: generateRecentRecords(),
//     isParticipating: true,
//     isLike: true,
//   },
//   {
//     id: 4,
//     title: "1월 명상 챌린지",
//     description: "매일 10분씩 명상을 통해 마음의 평화를 찾아보세요.",
//     image: getRandomImage(),
//     imageUrl: getRandomImage(),
//     registerDate: "2025-01-01T11:45:00",
//     startDate: "2025-01-01T00:00:00",
//     endDate: "2025-01-31T23:59:59",
//     tags: [
//       { id: 1, name: "명상" },
//       { id: 2, name: "마음챙김" },
//       { id: 3, name: "웰빙빙" }
//     ],
//     participantCount: 820,
//     likes: 245,
//     views: 3600,
//     successToday: false,
//     longestStreak: 12,
//     currentStreak: 3,
//     successRate: 68.5,
//     status: "ENDED",
//     ownerId: "user101",
//     records: generateRecentRecords(),
//     isParticipating: true,
//     isLike: false,
//   },
//   {
//     id: 5,
//     title: "플라스틱 프리 챌린지",
//     description: "한 달 동안 일회용 플라스틱 사용을 줄이는 챌린지입니다.",
//     image: getRandomImage(),
//     imageUrl: getRandomImage(),
//     registerDate: "2025-02-20T16:20:00",
//     startDate: "2025-03-01T00:00:00",
//     endDate: "2025-03-31T23:59:59",
//     tags: [
//       { id: 1, name: "환경" },
//       { id: 2, name: "에코" },
//       { id: 3, name: "지속가능성성" }
//     ],
//     participantCount: 2100,
//     likes: 780,
//     views: 9500,
//     successToday: false,
//     longestStreak: 0,
//     currentStreak: 0,
//     successRate: 0,
//     status: "UPCOMING",
//     ownerId: "user202",
//     records: {},
//     isParticipating: false,
//     isLike: false,
//   },
// ];

// export default mockChallengeDetails;

// // ID에 해당하는 챌린지를 반환하는 함수
// export function getMockChallengeDetail(id: string): ChallengeDetail | null {
//   const challenge = mockChallengeDetails.find((challenge) => challenge.id.toString() === id);
//   return challenge || null;
// }
