// Book 인터페이스
export interface Book {
  id: string;
  userId: string;
  nickname?: string; // 닉네임 필드 추가
  title: string;
  content: string;
  coverImg: string;
  tags: string[];
  likeCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  storyIds: number[];
  imageUrls: string[];
}

// BookCardProps 인터페이스
export interface BookCardProps {
  book: Book;
}

// BookCarouselProps 인터페이스
export interface BookCarouselProps {
  title: string;
  books: Book[];
}

// CarouselIndicatorProps 인터페이스
export interface CarouselIndicatorProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
}

// TopCarousel에서 사용되는 BookCarouselProps 인터페이스
export interface TopBookCarouselProps {
  books: Book[];
}

// TaggedPopularBooks에서 사용되는 TaggedBooks 타입
export type TaggedBooks = { [key: string]: Book[] };

// SearchBarProps 인터페이스 (필요한 경우)
export type SearchBarProps = {};

// PopularBooksProps 인터페이스 (필요한 경우)
export type PopularBooksProps = {};

// TaggedPopularBooksProps 인터페이스 (필요한 경우)
export type TaggedPopularBooksProps = {};

// YesterdayPageProps 인터페이스 (필요한 경우)
export type YesterdayPageProps = {};
