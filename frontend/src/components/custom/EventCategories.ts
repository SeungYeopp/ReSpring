import { Home, BookOpen, Briefcase, Plane, Star } from "lucide-react";

export const EventCategories = [
  { name: "가정", icon: Home },
  { name: "학업", icon: BookOpen },
  { name: "직장", icon: Briefcase },
  { name: "여행", icon: Plane },
  { name: "기타", icon: Star },
];

export const getCategoryIcon = (categoryName: string) => {
  const category = EventCategories.find((cat) => cat.name === categoryName);
  return category ? category.icon : Star;
};
