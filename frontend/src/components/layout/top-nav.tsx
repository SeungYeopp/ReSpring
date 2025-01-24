import { topNavItems } from "./config";
import { NavigationItem } from "./nav-item";

export function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center h-14 px-4">
        <NavigationItem {...topNavItems[0]} showLabel={false} className="mr-auto" isLogo={true} />
        <div className="flex">
          {topNavItems.slice(1).map((item) => (
            <NavigationItem key={item.href} {...item} showLabel={false} />
          ))}
        </div>
      </div>
    </nav>
  );
}
