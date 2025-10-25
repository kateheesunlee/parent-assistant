"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Settings, LogOut, Home } from "lucide-react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface SideNavProps {
  onLogout: () => void;
}

export function SideNav({ onLogout }: SideNavProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const sidebarWidth = isTablet ? 64 : 256;

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarWidth,
          zIndex: 50,
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <Box sx={{ p: isTablet ? 2 : 3, textAlign: "center" }}>
          <Typography
            variant={isTablet ? "h6" : "h5"}
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "grey.900",
              fontSize: isTablet ? "1rem" : "1.25rem",
            }}
          >
            {isTablet ? "PA" : "Parent Assistant"}
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, p: isTablet ? 1 : 2 }}>
          <List>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      backgroundColor: active ? "primary.50" : "transparent",
                      color: active ? "primary.700" : "grey.600",
                      "&:hover": {
                        backgroundColor: active ? "primary.50" : "grey.50",
                        color: active ? "primary.700" : "grey.900",
                      },
                      justifyContent: isTablet ? "center" : "flex-start",
                      px: isTablet ? 1 : 2,
                      py: 1,
                    }}
                    title={isTablet ? item.name : undefined}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: isTablet ? "auto" : 40,
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      <Icon size={20} />
                    </ListItemIcon>
                    {!isTablet && (
                      <ListItemText
                        primary={item.name}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Logout */}
        <Box sx={{ p: isTablet ? 1 : 2 }}>
          <Button
            variant="outline"
            onClick={onLogout}
            sx={{
              width: "100%",
              justifyContent: isTablet ? "center" : "flex-start",
              gap: 1.5,

              px: isTablet ? 1 : 2,
              py: 1,
            }}
            title={isTablet ? "Sign Out" : undefined}
          >
            <LogOut size={20} />
            {!isTablet && "Sign Out"}
          </Button>
        </Box>
      </Paper>

      {/* Mobile Bottom Navigation */}
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: { xs: "block", sm: "none" },
          backgroundColor: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-around", py: 1 }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Button
                key={item.name}
                component={Link}
                href={item.href}
                variant="ghost"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  color: active ? "primary.700" : "grey.600",

                  minWidth: "auto",
                }}
              >
                <Icon size={20} />
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.75rem", fontWeight: 500 }}
                >
                  {item.name}
                </Typography>
              </Button>
            );
          })}
          <Button
            onClick={onLogout}
            variant="ghost"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 1,
              borderRadius: 1,
              color: "grey.600",
              "&:hover": {
                color: "error.main",
                backgroundColor: "transparent",
              },
              minWidth: "auto",
            }}
          >
            <LogOut size={20} />
            <Typography
              variant="caption"
              sx={{ fontSize: "0.75rem", fontWeight: 500 }}
            >
              Sign Out
            </Typography>
          </Button>
        </Box>
      </Paper>
    </>
  );
}
