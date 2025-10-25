"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Settings, LogOut, Home } from "lucide-react";

interface SideNavProps {
  onLogout: () => void;
}

export function SideNav({ onLogout }: SideNavProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Children",
      href: "/children",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex-col">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Parent Assistant</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700 "
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tablet Sidebar (icon only) */}
      <div className="hidden sm:flex md:hidden fixed top-0 left-0 h-full w-16 bg-white shadow-lg z-50 flex-col">
        {/* Header */}
        <div className="p-4 flex justify-center">
          <h1 className="text-lg font-bold text-gray-900">PA</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
                title={item.name}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 ">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full justify-center p-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? "text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={onLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </>
  );
}
