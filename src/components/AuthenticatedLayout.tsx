"use client";

import { SideNav } from "@/components/SideNav";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        router.push("/");
      }
    } catch {
      // Silently handle logout errors
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav onLogout={handleLogout} />
      {/* Desktop: margin-left for full sidebar, Tablet: margin-left for thin sidebar, Mobile: padding-bottom for bottom nav */}
      <div className="md:ml-64 sm:ml-16 pb-16 sm:pb-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
