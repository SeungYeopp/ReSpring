import type { Book } from "@/app/yesterday/types/maintypes";

const titles = [
  "마음의 정원",
  "별빛 아래",
  "시간의 강",
  "꿈꾸는 나무",
  "바람의 노래",
  "햇살 한 조각",
  "구름 위의 산책",
  "달빛 소나타",
  "숲속의 비밀",
  "파도의 속삭임",
  "도시의 밤",
  "과학의 미래",
  "철학의 숲",
  "역사의 물결",
  "경제의 흐름",
  "예술의 향기",
  "여행의 즐거움",
  "요리의 세계",
  "건강한 삶",
  "디자인의 힘",
];

const nicknames = [
  "김마음",
  "이별",
  "강물결",
  "나무사랑",
  "윤바람",
  "이햇살",
  "구름님",
  "박달빛",
  "정숲",
  "최파도",
  "김도시",
  "이과학",
  "박철학",
  "최역사",
  "정경제",
  "윤예술",
  "강여행",
  "이요리",
  "김건강",
  "최디자인",
];

const tagPool = ["소설", "에세이", "시", "자기계발", "과학", "예술"];

function generateBooks(count: number): Book[] {
  const books: Book[] = [];
  let id = 1;

  // 각 태그별로 최소 5개의 책 생성
  tagPool.forEach((tag) => {
    for (let i = 0; i < 5; i++) {
      books.push({
        id: id.toString(), // 숫자 -> 문자열로 변환
        title: `${titles[Math.floor(Math.random() * titles.length)]} ${id}`,
        nickname: nicknames[Math.floor(Math.random() * nicknames.length)], // author -> nickname
        coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`, // 랜덤 플레이스홀더 이미지 적용
        tags: [tag],
        content: "", // 빈 내용 추가 (API 필드에 맞춤)
        userId: "", // 유저 ID 추가 (API 필드에 맞춤)
        likeCount: 0,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        storyIds: [],
        imageUrls: [],
      });
      id++;
    }
  });

  // 나머지 책들 생성
  while (books.length < count) {
    const book: Book = {
      id: id.toString(),
      title: `${titles[Math.floor(Math.random() * titles.length)]} ${id}`,
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
      coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
      tags: [tagPool[Math.floor(Math.random() * tagPool.length)]],
      content: "",
      userId: "",
      likeCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      storyIds: [],
      imageUrls: [],
    };

    // 50% 확률로 두 번째 태그 추가
    if (Math.random() < 0.5) {
      const secondTag = tagPool[Math.floor(Math.random() * tagPool.length)];
      if (!book.tags.includes(secondTag)) {
        book.tags.push(secondTag);
      }
    }

    books.push(book);
    id++;
  }

  // 책 순서를 랜덤하게 섞기
  return books.sort(() => Math.random() - 0.5);
}

// likedBooks와 viewedBooks 각각 60개 생성 (각 태그당 최소 5개 + 추가 30개)
export const likedBooks: Book[] = generateBooks(60);
export const viewedBooks: Book[] = generateBooks(60);

// 임시 데이터
export const weeklyBooks: Book[] = [
  {
    id: "1",
    title: "봄날의 서 제목",
    nickname: "김싸피",
    content: "젊은이란, 매 순간 스쳐 지나가 버리는 줄도 모르고 달려가는 바람과 같았다. 어느새...",
    coverImg: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-j6SiqcTDaO10YoYE86ixG04efWFtm7.png",
    tags: ["소설", "로맨스"],

    // 누락된 필드 추가
    userId: "user1",
    likeCount: 120,
    viewCount: 350,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "2",
    title: "여름의 기억",
    nickname: "이싸피",
    content: "따뜻한 햇살 아래, 우리는 서로의 이야기를 나누었다. 그때의 기억이 아직도...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user2",
    likeCount: 85,
    viewCount: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "3",
    title: "봄날의 서 마루",
    nickname: "김마피",
    content: "젊은이란, 매 순간 스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총 같았다. 어느새...",
    coverImg: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-j6SiqcTDaO10YoYE86ixG04efWFtm7.png",
    tags: ["소설", "로맨스"],

    // 누락된 필드 추가
    userId: "user1",
    likeCount: 120,
    viewCount: 350,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "4",
    title: "마루의 기억",
    nickname: "이마루",
    content:
      "따뜻한 햇살 아래, 우스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총스쳐총총의 기억이 아직도...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user2",
    likeCount: 85,
    viewCount: 200,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
];

export const latestBooks: Book[] = [
  {
    id: "1",
    title: "가을의 속삭임",
    nickname: "박싸피",
    content: "낙엽이 춤추는 거리를 걸으며, 나는 문득 지나온 시간들을 되돌아보았다...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user3",
    likeCount: 90,
    viewCount: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "2",
    title: "겨울의 고백",
    nickname: "최싸피",
    content: "눈 내리는 창밖을 바라보며, 나는 마음 속 깊이 간직해온 이야기를 꺼내기 시작했다...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user4",
    likeCount: 70,
    viewCount: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "3",
    title: "가마루 속삭임",
    nickname: "마루피",
    content: "낙엽이 춤추는 거리를 걸으며, 마루 덥석 간들을 되돌아보았다...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user3",
    likeCount: 90,
    viewCount: 180,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
  {
    id: "4",
    title: "겨울의 고백",
    nickname: "최마루",
    content: "눈 내리마루 킁킁 며, 나는 마음 속 깊이 간직해온 이야기를 꺼내기 시작했다...",
    coverImg: `/placeholder/bookcover/thumb (${Math.floor(Math.random() * 7) + 1}).webp`,
    tags: ["소설", "로맨스"],

    userId: "user4",
    likeCount: 70,
    viewCount: 150,
    createdAt: new Date(),
    updatedAt: new Date(),
    storyIds: [],
    imageUrls: [],
  },
];
