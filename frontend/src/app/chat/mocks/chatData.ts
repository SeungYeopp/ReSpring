// 채팅방 타입 정의
export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  type: "private" | "open";
  participants?: string[]; // 1:1 채팅의 경우 참여자 정보
}

// 채팅 메시지 타입 정의
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

// 채팅방 목데이터
export const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "김철수",
    lastMessage: "네, 다음에 봐요!",
    lastMessageTimestamp: "2023-05-10T15:30:00Z",
    type: "private",
    participants: ["user123", "user456"],
  },
  {
    id: "2",
    name: "이영희",
    lastMessage: "알겠습니다. 맛있게 드세요!",
    lastMessageTimestamp: "2023-05-10T12:15:00Z",
    type: "private",
    participants: ["user123", "user789"],
  },
  {
    id: "3",
    name: "퇴직자 모임",
    lastMessage: "네, 그때 뵙겠습니다!",
    lastMessageTimestamp: "2023-05-10T17:45:00Z",
    type: "open",
  },
  {
    id: "4",
    name: "취미 공유방",
    lastMessage: "저도 등산 좋아해요. 다음에 같이 가요!",
    lastMessageTimestamp: "2023-05-10T13:20:00Z",
    type: "open",
  },
  {
    id: "5",
    name: "재취업 정보",
    lastMessage: "면접 잘 보셨길 바랍니다!",
    lastMessageTimestamp: "2023-05-10T16:05:00Z",
    type: "open",
  },
  {
    id: "6",
    name: "박지성",
    lastMessage: "네, 내일 뵙겠습니다.",
    lastMessageTimestamp: "2023-05-10T18:00:00Z",
    type: "private",
    participants: ["user123", "user321"],
  },
  {
    id: "7",
    name: "건강 관리 팁",
    lastMessage: "운동은 꾸준히 하는 게 중요해요!",
    lastMessageTimestamp: "2023-05-10T14:50:00Z",
    type: "open",
  },
  {
    id: "8",
    name: "독서 모임",
    lastMessage: "다음 주 독서 모임 장소가 변경되었습니다.",
    lastMessageTimestamp: "2023-05-10T19:30:00Z",
    type: "open",
  },
  {
    id: "9",
    name: "최민수",
    lastMessage: "좋은 정보 감사합니다.",
    lastMessageTimestamp: "2023-05-10T20:10:00Z",
    type: "private",
    participants: ["user123", "user654"],
  },
  {
    id: "10",
    name: "여행 계획",
    lastMessage: "제주도 여행 일정 공유했습니다.",
    lastMessageTimestamp: "2023-05-10T21:00:00Z",
    type: "open",
  },
];

// 채팅 메시지 목데이터
export const mockChatMessages: { [key: string]: ChatMessage[] } = {
  "1": [
    { id: "1", userId: "user123", content: "안녕하세요, 김철수님!", timestamp: "2023-05-10T14:30:00Z" },
    { id: "2", userId: "user456", content: "네, 안녕하세요! 오랜만이에요.", timestamp: "2023-05-10T14:35:00Z" },
    { id: "3", userId: "user123", content: "요즘 어떻게 지내세요?", timestamp: "2023-05-10T14:40:00Z" },
    { id: "4", userId: "user456", content: "잘 지내고 있어요. 다음에 한번 만나요!", timestamp: "2023-05-10T15:25:00Z" },
    { id: "5", userId: "user123", content: "네, 다음에 봐요!", timestamp: "2023-05-10T15:30:00Z" },
  ],
  "2": [
    { id: "1", userId: "user123", content: "이영희님, 오늘 점심 뭐 먹을까요?", timestamp: "2023-05-10T11:00:00Z" },
    { id: "2", userId: "user789", content: "음, 한식 어떠세요?", timestamp: "2023-05-10T11:05:00Z" },
    { id: "3", userId: "user123", content: "좋아요! 12시에 만나서 가요.", timestamp: "2023-05-10T11:10:00Z" },
    { id: "4", userId: "user789", content: "네, 그때 뵐게요.", timestamp: "2023-05-10T11:15:00Z" },
    { id: "5", userId: "user123", content: "알겠습니다. 맛있게 드세요!", timestamp: "2023-05-10T12:15:00Z" },
  ],
  "3": [
    { id: "1", userId: "user321", content: "오늘 저녁 모임 장소가 어디죠?", timestamp: "2023-05-10T16:00:00Z" },
    { id: "2", userId: "user654", content: "종로 근처 카페에서 만나기로 했어요.", timestamp: "2023-05-10T16:05:00Z" },
    { id: "3", userId: "user321", content: "아, 네 알겠습니다. 몇 시에 만나나요?", timestamp: "2023-05-10T16:10:00Z" },
    { id: "4", userId: "user654", content: "7시에 만나기로 했어요.", timestamp: "2023-05-10T16:15:00Z" },
    { id: "5", userId: "user321", content: "네, 그때 뵙겠습니다!", timestamp: "2023-05-10T17:45:00Z" },
  ],
  "4": [
    { id: "1", userId: "user789", content: "등산 좋아하시는 분 계신가요?", timestamp: "2023-05-10T10:00:00Z" },
    { id: "2", userId: "user123", content: "저요! 주말마다 등산 다녀요.", timestamp: "2023-05-10T10:05:00Z" },
    { id: "3", userId: "user789", content: "와, 좋으시겠어요. 어디로 주로 가세요?", timestamp: "2023-05-10T10:10:00Z" },
    { id: "4", userId: "user123", content: "북한산이나 관악산을 자주 가요.", timestamp: "2023-05-10T10:15:00Z" },
    { id: "5", userId: "user789", content: "저도 등산 좋아해요. 다음에 같이 가요!", timestamp: "2023-05-10T13:20:00Z" },
  ],
  "5": [
    {
      id: "1",
      userId: "user321",
      content: "이번에 OO기업에서 채용한다는데 아시는 분?",
      timestamp: "2023-05-10T09:00:00Z",
    },
    {
      id: "2",
      userId: "user654",
      content: "네, 저도 봤어요. 경력직 위주로 뽑는다던데...",
      timestamp: "2023-05-10T09:05:00Z",
    },
    {
      id: "3",
      userId: "user321",
      content: "아, 그렇군요. 지원해볼까 고민 중이에요.",
      timestamp: "2023-05-10T09:10:00Z",
    },
    {
      id: "4",
      userId: "user654",
      content: "한번 지원해보세요. 좋은 결과 있길 바랄게요!",
      timestamp: "2023-05-10T09:15:00Z",
    },
    { id: "5", userId: "user321", content: "면접 잘 보셨길 바랍니다!", timestamp: "2023-05-10T16:05:00Z" },
  ],
  "6": [
    {
      id: "1",
      userId: "user123",
      content: "박지성님, 내일 회의 시간 어떻게 되나요?",
      timestamp: "2023-05-10T17:30:00Z",
    },
    {
      id: "2",
      userId: "user321",
      content: "안녕하세요. 내일 오전 10시에 회의실에서 뵙겠습니다.",
      timestamp: "2023-05-10T17:35:00Z",
    },
    { id: "3", userId: "user123", content: "알겠습니다. 회의 자료는 준비되었나요?", timestamp: "2023-05-10T17:40:00Z" },
    {
      id: "4",
      userId: "user321",
      content: "네, 모두 준비되었습니다. 내일 아침에 공유드리겠습니다.",
      timestamp: "2023-05-10T17:45:00Z",
    },
    { id: "5", userId: "user123", content: "네, 내일 뵙겠습니다.", timestamp: "2023-05-10T18:00:00Z" },
  ],
  "7": [
    {
      id: "1",
      userId: "user456",
      content: "여러분, 건강 관리 어떻게 하고 계신가요?",
      timestamp: "2023-05-10T13:00:00Z",
    },
    { id: "2", userId: "user789", content: "저는 매일 아침 조깅을 하고 있어요.", timestamp: "2023-05-10T13:05:00Z" },
    { id: "3", userId: "user321", content: "저는 식단 관리에 신경 쓰고 있습니다.", timestamp: "2023-05-10T13:10:00Z" },
    {
      id: "4",
      userId: "user654",
      content: "저는 요가를 시작했어요. 몸이 많이 유연해졌어요.",
      timestamp: "2023-05-10T13:15:00Z",
    },
    { id: "5", userId: "user456", content: "운동은 꾸준히 하는 게 중요해요!", timestamp: "2023-05-10T14:50:00Z" },
  ],
  "8": [
    {
      id: "1",
      userId: "user789",
      content: "이번 주 독서 모임에서는 어떤 책을 다루나요?",
      timestamp: "2023-05-10T18:00:00Z",
    },
    { id: "2", userId: "user321", content: "'사피엔스'를 읽기로 했어요.", timestamp: "2023-05-10T18:05:00Z" },
    {
      id: "3",
      userId: "user654",
      content: "오, 재미있겠네요. 저도 참여하고 싶어요.",
      timestamp: "2023-05-10T18:10:00Z",
    },
    {
      id: "4",
      userId: "user789",
      content: "네, 함께해요! 토요일 오후 2시에 만나요.",
      timestamp: "2023-05-10T18:15:00Z",
    },
    {
      id: "5",
      userId: "user321",
      content: "다음 주 독서 모임 장소가 변경되었습니다.",
      timestamp: "2023-05-10T19:30:00Z",
    },
  ],
  "9": [
    {
      id: "1",
      userId: "user123",
      content: "최민수님, 지난번에 말씀하신 투자 정보 좀 더 자세히 알 수 있을까요?",
      timestamp: "2023-05-10T19:30:00Z",
    },
    {
      id: "2",
      userId: "user654",
      content: "네, 제가 알고 있는 내용을 정리해서 보내드리겠습니다.",
      timestamp: "2023-05-10T19:35:00Z",
    },
    { id: "3", userId: "user123", content: "감사합니다. 기다리고 있겠습니다.", timestamp: "2023-05-10T19:40:00Z" },
    {
      id: "4",
      userId: "user654",
      content: "방금 이메일로 보내드렸습니다. 확인 부탁드립니다.",
      timestamp: "2023-05-10T20:05:00Z",
    },
    { id: "5", userId: "user123", content: "좋은 정보 감사합니다.", timestamp: "2023-05-10T20:10:00Z" },
  ],
  "10": [
    { id: "1", userId: "user456", content: "다들 여름 휴가 계획 있으신가요?", timestamp: "2023-05-10T20:00:00Z" },
    { id: "2", userId: "user789", content: "저는 제주도 가려고요!", timestamp: "2023-05-10T20:05:00Z" },
    {
      id: "3",
      userId: "user321",
      content: "좋겠어요! 저는 해외여행을 고민 중이에요.",
      timestamp: "2023-05-10T20:10:00Z",
    },
    {
      id: "4",
      userId: "user654",
      content: "저도 제주도 가고 싶네요. 일정 공유해주세요!",
      timestamp: "2023-05-10T20:15:00Z",
    },
    { id: "5", userId: "user456", content: "제주도 여행 일정 공유했습니다.", timestamp: "2023-05-10T21:00:00Z" },
  ],
};
