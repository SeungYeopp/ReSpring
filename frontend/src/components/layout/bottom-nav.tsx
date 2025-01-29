import { bottomNavItems } from "./config";
import { NavigationItem } from "./nav-item";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {bottomNavItems.map((item) => (
          <NavigationItem key={item.href} {...item} />
        ))}
      </div>
    </nav>
  );
}
