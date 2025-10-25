"use client";

import ThemeRegistry from "@/app/ThemeRegistry";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { SideNav } from "@/components/SideNav";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Box } from "@mui/material";

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
    <ThemeRegistry>
      <MuiThemeProvider>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "grey.50",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SideNav onLogout={handleLogout} />
          {/* Desktop: margin-left for full sidebar, Tablet: margin-left for thin sidebar, Mobile: padding-bottom for bottom nav */}
          <Box
            component="main"
            sx={{
              minHeight: "100vh",
              marginLeft: { xs: 0, sm: "64px", md: "256px" },
              paddingBottom: { xs: "64px", sm: 0 },
            }}
          >
            {children}
          </Box>
        </Box>
      </MuiThemeProvider>
    </ThemeRegistry>
  );
}
