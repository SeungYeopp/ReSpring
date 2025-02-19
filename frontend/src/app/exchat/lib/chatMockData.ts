export type ChatData = {
  id: string;
  userId: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
  unread: number;
  messages: {
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
  }[];
};

export type UserData = {
  id: string;
  userId: string;
  name: string;
  avatar: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
};

/**   랜덤 프로필 이미지 생성 함수 */
const getRandomImage = () => {
  const imageNumber = Math.floor(Math.random() * 9) + 1; // 1~9 숫자 랜덤 선택
  return `/corgis/placeholder${imageNumber}.jpg`; // public 폴더 내 이미지 경로
};

export const MOCK_USERS: UserData[] = [
  { id: "user1", userId: "kim123", name: "김민철", avatar: getRandomImage() },
  { id: "user2", userId: "cho456", name: "조예슬", avatar: getRandomImage() },
  { id: "user3", userId: "park789", name: "박성욱", avatar: getRandomImage() },
  { id: "user4", userId: "kang101", name: "강승엽", avatar: getRandomImage() },
  { id: "user5", userId: "yoon202", name: "윤태한", avatar: getRandomImage() },
  { id: "user6", userId: "lee303", name: "이지은", avatar: getRandomImage() },
  { id: "user7", userId: "han404", name: "한소희", avatar: getRandomImage() },
  { id: "user8", userId: "jung505", name: "정우성", avatar: getRandomImage() },
];

export const MOCK_CHATS: ChatData[] = [
  {
    id: "chat1",
    userId: "kim123",
    name: "김민철",
    lastMessage: "넵! 내일 회의 때 뵙겠습니다~",
    avatar: getRandomImage(),
    timestamp: "14:30",
    unread: 2,
    messages: [
      {
        id: "1",
        content: "민철 씨, 내일 프로젝트 진행 상황 발표 준비는 잘 되고 있나요?",
        senderId: "user",
        timestamp: "2023-05-01T10:00:00Z",
      },
      {
        id: "2",
        content: "아, 네! 거의 다 마무리했습니다. 제가 만든 컴포넌트 좀 봐주세요. 귀엽죠? 😁",
        senderId: "kim123",
        timestamp: "2023-05-01T10:05:00Z",
      },
      {
        id: "3",
        content: "ㅋㅋ 귀엽네요. 근데 귀여움 말고, 최근 발생한 이슈들이랑 해결 방안도 꼭 넣어주세요.",
        senderId: "user",
        timestamp: "2023-05-01T10:10:00Z",
      },
      {
        id: "4",
        content: "앗... 네, 알겠습니다. 이슈 트래킹 보고서 참고해서 추가하겠습니다!",
        senderId: "kim123",
        timestamp: "2023-05-01T10:15:00Z",
      },
      {
        id: "5",
        content: "굿굿. 내일 회의 때 뵙죠~ 수고 많았어요!",
        senderId: "user",
        timestamp: "2023-05-01T10:20:00Z",
      },
      {
        id: "6",
        content: "넵! 내일 회의 때 뵙겠습니다~",
        senderId: "kim123",
        timestamp: "2023-05-01T10:25:00Z",
      },
    ],
  },
  {
    id: "chat2",
    userId: "cho456",
    name: "조예슬",
    lastMessage: "네, AI 기반 디자인 시안 내일까지 전달드리겠습니다.",
    avatar: getRandomImage(),
    timestamp: "어제",
    unread: 0,
    messages: [
      {
        id: "1",
        content: "예슬님, 자서전 뷰어 디자인에 AI 모델 제안은 어떻게 나오고 있나요?",
        senderId: "user",
        timestamp: "2023-05-02T09:00:00Z",
      },
      {
        id: "2",
        content: "네! 지금 세 가지 컨셉으로 AI가 제안했어요. 내일까지 다듬어서 보여드릴게요!",
        senderId: "cho456",
        timestamp: "2023-05-02T09:05:00Z",
      },
      {
        id: "3",
        content: "오~ 혹시 고령층 사용자도 고려한 직관적인 UI도 포함돼 있나요?",
        senderId: "user",
        timestamp: "2023-05-02T09:10:00Z",
      },
      {
        id: "4",
        content: "그럼요! 큰 폰트, 간단한 네비게이션, 따뜻한 색감까지 다 반영했어요. 😊",
        senderId: "cho456",
        timestamp: "2023-05-02T09:15:00Z",
      },
      {
        id: "5",
        content: "역시 예슬님! 기대되네요. 내일 시안 꼭 보고 싶어요!",
        senderId: "user",
        timestamp: "2023-05-02T09:20:00Z",
      },
      {
        id: "6",
        content: "네, AI 기반 디자인 시안 내일까지 전달드리겠습니다!",
        senderId: "cho456",
        timestamp: "2023-05-02T09:25:00Z",
      },
    ],
  },
  {
    id: "chat3",
    userId: "park789",
    name: "박성욱",
    lastMessage: "네, 바로 확인하고 조치하겠습니다. 걱정하지 마세요.",
    avatar: getRandomImage(),
    timestamp: "월요일",
    unread: 1,
    messages: [
      {
        id: "1",
        content: "팀장님, 긴급히 연락드립니다. 서버에 문제가 발생한 것 같습니다.",
        senderId: "user",
        timestamp: "2023-05-03T11:30:00Z",
      },
      {
        id: "2",
        content: "무슨 일입니까? 어떤 증상이 나타나고 있는지 침착하게 설명해주세요.",
        senderId: "park789",
        timestamp: "2023-05-03T11:35:00Z",
      },
      {
        id: "3",
        content: "서버 응답 시간이 갑자기 늘어나고 있습니다. 일부 사용자들이 접속 지연을 호소하고 있습니다.",
        senderId: "user",
        timestamp: "2023-05-03T11:40:00Z",
      },
      {
        id: "4",
        content: "알겠습니다. 지금 바로 서버 로그 확인하겠습니다. 혹시 최근에 배포한 업데이트가 있습니까?",
        senderId: "park789",
        timestamp: "2023-05-03T11:45:00Z",
      },
      {
        id: "5",
        content: "아, 네! 오늘 아침에 새로운 기능을 론칭했습니다. 혹시 그 영향일까요?",
        senderId: "user",
        timestamp: "2023-05-03T11:50:00Z",
      },
      {
        id: "6",
        content: "네, 바로 확인하고 조치하겠습니다. 걱정하지 마세요.",
        senderId: "park789",
        timestamp: "2023-05-03T11:55:00Z",
      },
    ],
  },
  {
    id: "chat4",
    userId: "kang101",
    name: "강승엽",
    lastMessage: "네, 내일 오전 회의에서 자세히 논의하죠!",
    avatar: getRandomImage(),
    timestamp: "3일 전",
    unread: 0,
    messages: [
      {
        id: "1",
        content: "승엽님, 1:1 채팅 기능 개발은 어떻게 진행되고 있나요?",
        senderId: "user",
        timestamp: "2023-05-04T15:00:00Z",
      },
      {
        id: "2",
        content: "거의 다 끝났습니다. 근데 챌린지 기능이랑 연동하는 부분에서 조금 고민이 있습니다.",
        senderId: "kang101",
        timestamp: "2023-05-04T15:10:00Z",
      },
      {
        id: "3",
        content: "어떤 부분이 문제인지 설명해주실 수 있나요?",
        senderId: "user",
        timestamp: "2023-05-04T15:15:00Z",
      },
      {
        id: "4",
        content: "챌린지 참여자들끼리 그룹 채팅을 할 수 있게 하면 좋을 것 같은데, 이게 DB 구조를 좀 변경해야 할 것 같습니다.",
        senderId: "kang101",
        timestamp: "2023-05-04T15:20:00Z",
      },
      {
        id: "5",
        content: "아, 그렇군요. 그럼 내일 오전에 회의 잡고 같이 논의해보는 게 어떨까요?",
        senderId: "user",
        timestamp: "2023-05-04T15:25:00Z",
      },
      {
        id: "6",
        content: "네, 내일 오전 회의에서 자세히 논의하죠!",
        senderId: "kang101",
        timestamp: "2023-05-04T15:30:00Z",
      },
    ],
  },
  {
    id: "chat5",
    userId: "yoon202",
    name: "윤태한",
    lastMessage: "네, 개선된 프로필 페이지 곧 배포하겠습니다. 기대해주세요! 😊",
    avatar: getRandomImage(),
    timestamp: "1주일 전",
    unread: 3,
    messages: [
      {
        id: "1",
        content: "태한님, 사용자 프로필 페이지 피드백 결과가 나왔습니다. 한번 보시겠어요?",
        senderId: "user",
        timestamp: "2023-05-05T10:00:00Z",
      },
      {
        id: "2",
        content: "네! 어떤 부분에서 주로 피드백이 있었나요?",
        senderId: "yoon202",
        timestamp: "2023-05-05T10:05:00Z",
      },
      {
        id: "3",
        content: "주로 프로필 편집 UI가 좀 복잡하다는 의견이 많았습니다. 프로필 사진 업로드 속도도 느리다고 하네요.",
        senderId: "user",
        timestamp: "2023-05-05T10:10:00Z",
      },
      {
        id: "4",
        content: "아, 그렇군요. UI 간소화하고, 사진 업로드는 백엔드 팀과 협력해서 최적화하겠습니다!",
        senderId: "yoon202",
        timestamp: "2023-05-05T10:15:00Z",
      },
      {
        id: "5",
        content: "좋습니다! 혹시 재미있는 아이디어 있으면 하나 추가하는 것도 좋겠네요?",
        senderId: "user",
        timestamp: "2023-05-05T10:20:00Z",
      },
      {
        id: "6",
        content: "네, 개선된 프로필 페이지 곧 배포하겠습니다. 기대해주세요! 😊",
        senderId: "yoon202",
        timestamp: "2023-05-05T10:25:00Z",
      },
    ],
  },
];

export function getChatById(chatId: string): ChatData | undefined {
  return MOCK_CHATS.find((chat) => chat.id === chatId);
}

export async function fetchChatData(chatId: string): Promise<ChatData | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getChatById(chatId);
}

export async function fetchUsers(): Promise<UserData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_USERS;
}

export async function fetchPaginatedChats(page: number, pageSize: number): Promise<ChatData[]> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 서버 요청을 시뮬레이션하기 위한 지연
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return MOCK_CHATS.slice(startIndex, endIndex);
}

export async function fetchMoreMessages(chatId: string, beforeMessageId: string): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 서버 요청 시뮬레이션
  const chat = MOCK_CHATS.find((c) => c.id === chatId);
  if (!chat) return [];

  const messageIndex = chat.messages.findIndex((m) => m.id === beforeMessageId);
  if (messageIndex === -1) return [];

  // 이전 20개의 메시지를 반환합니다. 실제 구현에서는 서버에서 페이지네이션을 처리해야 합니다.
  return chat.messages.slice(Math.max(0, messageIndex - 20), messageIndex).reverse();
}
