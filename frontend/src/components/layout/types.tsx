// 네비게이션 아이템 타입 정의
export type NavItem = {
  label: string;
  href: string;
  iconName: string; // 아이콘 이름을 문자열로 저장
  isAction?: boolean;
  isLogo?: boolean;
};

// 네비게이션 섹션 타입 정의
export type NavSection = {
  items: NavItem[];
  showLabels?: boolean;
};
