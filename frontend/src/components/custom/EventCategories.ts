import { Home, BookOpen, Briefcase, Plane, Star } from "lucide-react";

export const EventCategories = [
  { eventName: "가정", icon: Home },
  { eventName: "학업", icon: BookOpen },
  { eventName: "직장", icon: Briefcase },
  { eventName: "여행", icon: Plane },
  { eventName: "기타", icon: Star },
];

export const getCategoryIcon = (categoryName: string) => {
  const category = EventCategories.find((cat) => cat.eventName === categoryName);
  return category ? category.icon : Star;
};
