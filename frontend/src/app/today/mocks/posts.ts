import type { Post } from "../types/posts"

// 사용자 데이터
const users = [
  { id: "1", name: "실버맨", profileImage: "/placeholder.svg", generation: "제2인생 3년차" },
  { id: "2", name: "뉴비", profileImage: "/placeholder.svg", generation: "제2인생 뉴비" },
  { id: "3", name: "골드우먼", profileImage: "/placeholder.svg", generation: "제2인생 5년차" },
  { id: "4", name: "브론즈맨", profileImage: "/placeholder.svg", generation: "제2인생 1년차" },
  { id: "5", name: "플래티넘레이디", profileImage: "/placeholder.svg", generation: "제2인생 10년차" },
  { id: "6", name: "실버우먼", profileImage: "/placeholder.svg", generation: "제2인생 3년차" },
  { id: "7", name: "다이아몬드맨", profileImage: "/placeholder.svg", generation: "제2인생 15년차" },
  { id: "8", name: "루키", profileImage: "/placeholder.svg", generation: "제2인생 6개월차" },
]

// 인기 게시글 목데이터
export const popularPosts: Post[] = [
  {
    id: "1",
    author: users[0],
    title: "퇴직금 제대로 관리하기: 재테크 노하우 공유",
    content:
      "안녕하세요. 실버맨입니다. 오늘은 더 나은 노하우가 있으시면 공유받길 바라며 제가 퇴직금을 관리하는 방법에 대해 이야기하고자 합니다. 첫째, 긴급자금을 따로 마련하세요. 둘째, 분산 투자를 하세요. 셋째, 장기적인 관점에서 접근하세요.",
    category: "정보공유",
    createdAt: "2024-01-24T12:00:00Z",
    likes: 156,
    comments: 42,
    isPopular: true,
  },
  {
    id: "2",
    author: users[2],
    title: "제2의 인생, 새로운 취미 찾기",
    content:
      "퇴직 후 처음에는 무엇을 해야 할지 몰랐습니다. 하지만 이제는 매일이 새로운 도전과 즐거움의 연속입니다. 제가 찾은 새로운 취미들을 소개해드릴게요. 园예, 도예, 그리고 여행 블로깅까지!",
    category: "정보공유",
    createdAt: "2024-01-23T15:30:00Z",
    likes: 134,
    comments: 38,
    isPopular: true,
  },
  {
    id: "3",
    author: users[4],
    title: "건강관리의 중요성: 제2인생을 위한 필수 팁",
    content:
      "나이가 들수록 건강관리가 정말 중요해집니다. 제가 10년간 실천해온 건강관리 비법을 공유합니다. 규칙적인 운동, 균형 잡힌 식단, 충분한 수면, 그리고 정기적인 건강검진이 핵심입니다.",
    category: "정보공유",
    createdAt: "2024-01-22T09:45:00Z",
    likes: 201,
    comments: 55,
    isPopular: true,
  },
  {
    id: "4",
    author: users[6],
    title: "인생 2막, 새로운 직업 도전기",
    content:
      "15년 전 퇴직 후, 저는 완전히 새로운 분야에 도전했습니다. 40년 동안의 회사원에서 요가 강사로 변신한 저의 이야기를 들려드리겠습니다. 늦은 나이의 도전이 얼마나 가치있는지 여러분과 나누고 싶습니다.",
    category: "정보공유",
    createdAt: "2024-01-21T18:20:00Z",
    likes: 189,
    comments: 61,
    isPopular: true,
  },
  {
    id: "5",
    author: users[1],
    title: "퇴직 후 우울증 극복 경험담",
    content:
      "퇴직 직후 겪었던 우울증과 그것을 극복한 과정을 공유합니다. 전문가의 도움, 가족의 지지, 그리고 새로운 목표 설정이 큰 도움이 되었습니다. 비슷한 경험을 하신 분들께 도움이 되길 바랍니다.",
    category: "고민/질문",
    createdAt: "2024-01-20T11:10:00Z",
    likes: 228,
    comments: 73,
    isPopular: true,
  },
]

// 일반 게시글 목데이터
export const posts: Post[] = [
  {
    id: "6",
    author: users[1],
    title: "다들 무슨 취미를 갖고 계신가요?",
    content:
      "안녕하세요. 퇴직한지 4개월차가 되어가는 뉴비입니다. 특히 요즘 건강과 관련해서 스포츠를 알아보고 있는데, 다들 어떤 취미활동을 하고 계신지 궁금합니다. 추천해주실 만한 것이 있다면 조언 부탁드려요!",
    category: "고민/질문",
    createdAt: "2024-01-24T10:00:00Z",
    likes: 45,
    comments: 28,
  },
  {
    id: "7",
    author: users[3],
    title: "노후 자금 관리, 어떻게 하고 계신가요?",
    content:
      "퇴직한 지 1년이 지났는데, 노후 자금 관리에 대해 고민이 많습니다. 적금? 주식? 펀드? 여러분들은 어떤 방식으로 노후 자금을 관리하고 계신지 의견을 들어보고 싶습니다.",
    category: "고민/질문",
    createdAt: "2024-01-23T14:30:00Z",
    likes: 67,
    comments: 41,
  },
  {
    id: "8",
    author: users[5],
    title: "봉사활동 추천해주세요",
    content:
      "최근 의미 있는 일을 하고 싶다는 생각이 들어 봉사활동을 알아보고 있어요. 경험 있으신 분들 추천해주실 만한 봉사활동이 있을까요? 시간도 많고 열정도 넘치는데 어디서부터 시작해야 할지 모르겠네요.",
    category: "고민/질문",
    createdAt: "2024-01-22T16:45:00Z",
    likes: 39,
    comments: 22,
  },
  {
    id: "9",
    author: users[7],
    title: "퇴직 후 처음으로 해외여행을 계획중입니다",
    content:
      "퇴직하고 6개월 동안 집에만 있다가 드디어 용기를 내어 해외여행을 가려고 합니다. 혼자 가는 여행이라 걱정도 되는데, 경험자 분들의 조언을 듣고 싶어요. 어떤 나라가 좋을까요?",
    category: "고민/질문",
    createdAt: "2024-01-21T09:15:00Z",
    likes: 52,
    comments: 36,
  },
  {
    id: "10",
    author: users[2],
    title: "마음의 평화를 찾는 방법",
    content:
      "요즘 들어 마음의 평화를 찾는 것이 중요하다고 느끼고 있어요. 명상을 시작했는데, 정말 도움이 많이 됩니다. 여러분만의 마음의 평화를 찾는 방법이 있다면 공유해주세요.",
    category: "정보공유",
    createdAt: "2024-01-20T13:40:00Z",
    likes: 88,
    comments: 47,
  },
  {
    id: "11",
    author: users[4],
    title: "손주들과 소통하는 법",
    content:
      "최근 손주들과의 대화에서 세대 차이를 많이 느끼고 있어요. 젊은 세대와 소통하는 팁이 있다면 공유해주세요. 손주들과 더 가까워지고 싶습니다.",
    category: "고민/질문",
    createdAt: "2024-01-19T11:20:00Z",
    likes: 76,
    comments: 53,
  },
  {
    id: "12",
    author: users[6],
    title: "인생 2막에서 찾은 새로운 열정",
    content:
      "퇴직 후 우연히 시작한 목공예가 저의 새로운 열정이 되었습니다. 나무를 다루며 느끼는 성취감과 기쁨을 여러분과 나누고 싶어요. 여러분의 새로운 열정은 무엇인가요?",
    category: "정보공유",
    createdAt: "2024-01-18T17:50:00Z",
    likes: 104,
    comments: 69,
  },
  {
    id: "13",
    author: users[0],
    title: "동네 친구 만들기 프로젝트",
    content:
      "퇴직 후 이사온 새 동네에서 친구를 만들기가 쉽지 않더라고요. 그래서 동네 친구 만들기 프로젝트를 시작했습니다. 함께 산책하고, 차 마시며 대화하는 모임을 만들었어요. 여러분의 경험도 들려주세요.",
    category: "정보공유",
    createdAt: "2024-01-17T10:30:00Z",
    likes: 92,
    comments: 58,
  },
  {
    id: "14",
    author: users[1],
    title: "디지털 기기 사용, 어렵지 않아요",
    content:
      "처음에는 스마트폰, 태블릿 사용이 어려웠지만, 조금씩 배워가니 이제는 쉬워요. 유튜브로 요리도 배우고, 화상통화로 멀리 있는 가족들과도 대화해요. 여러분도 도전해보세요!",
    category: "정보공유",
    createdAt: "2024-01-16T14:15:00Z",
    likes: 118,
    comments: 75,
  },
  {
    id: "15",
    author: users[3],
    title: "나만의 작은 텃밭 가꾸기",
    content:
      "아파트 베란다에 작은 텃밭을 만들었어요. 상추, 방울토마토, 고추를 키우고 있답니다. 직접 기른 채소로 요리해 먹는 재미가 쏠쏠해요. 도시 농부 되기, 어떠세요?",
    category: "정보공유",
    createdAt: "2024-01-15T16:40:00Z",
    likes: 86,
    comments: 51,
  },
]

