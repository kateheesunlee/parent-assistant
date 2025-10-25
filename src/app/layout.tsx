import type { Metadata } from "next";
import "./globals.css";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import ThemeRegistry from "./ThemeRegistry";

export const metadata: Metadata = {
  title: "Parent Assistant",
  description: "A modern web application built with Next.js, MUI, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <MuiThemeProvider>{children}</MuiThemeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
