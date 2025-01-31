export type SortOption = "likes" | "views" | "participants" | "recent";

export interface SortItem {
  value: SortOption;
  label: string;
}

export const sortOptions: SortItem[] = [
  { value: "likes", label: "좋아요 많은 순" },
  { value: "views", label: "조회수 많은 순" },
  { value: "participants", label: "참가자 많은 순" },
  { value: "recent", label: "최근 등록 순" },
];

export interface Challenge {
  challenge_id: number;
  title: string;
  description: string;
  cover_img: string;
  created_at: string;
  created_by: string;
  like: number;
  view: number;
  participants: number;
  tags: string[];
}

export interface PaginationInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

export interface ChallengesResponse {
  status: string;
  data: Challenge[];
  pagination: PaginationInfo;
}

export interface UserChallenge {
  challenge_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
}

export interface UserChallengesResponse {
  status: string;
  data: UserChallenge[];
}

export interface ChallengeDetailResponse {
  status: string;
  data: Challenge;
}
