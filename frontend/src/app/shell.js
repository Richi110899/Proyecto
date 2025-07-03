"use client";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";

  return (
    <div className="pl-4 w-full mt-10 min-h-screen flex">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "flex-1 ml-64" : "w-full min-h-screen"}>
        {children}
      </main>
    </div>
  );
} 