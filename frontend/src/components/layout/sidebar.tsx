import React from "react";
import { sidebarItems } from "./config";
import { NavigationItem } from "./nav-item";

const Divider = ({ thick = false }: { thick?: boolean }) => <div className={`h-px bg-gray-200 my-3 ${thick ? "h-0.5" : ""}`} />;

export function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 p-4 gap-2">
        <nav className="space-y-3">
          <NavigationItem {...sidebarItems[0]} className="w-full justify-start flex-row gap-3 mb-2" />
          <Divider thick />
          <NavigationItem {...sidebarItems[1]} className="w-full justify-start flex-row gap-3" />
          <Divider />
          <NavigationItem {...sidebarItems[2]} className="w-full justify-start flex-row gap-3" />
          <Divider />
          <NavigationItem {...sidebarItems[3]} className="w-full justify-start flex-row gap-3" />
          <Divider />
          <NavigationItem {...sidebarItems[4]} className="w-full justify-start flex-row gap-3" />
          <Divider thick />
          <NavigationItem {...sidebarItems[5]} className="w-full justify-start flex-row gap-3" />
          <Divider />
          <NavigationItem {...sidebarItems[6]} className="w-full justify-start flex-row gap-3" />
          <Divider thick />
          <NavigationItem {...sidebarItems[7]} className="w-full justify-start flex-row gap-3" />
        </nav>
      </div>
    </aside>
  );
}
