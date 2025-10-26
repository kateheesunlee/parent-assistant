"use client";

import {
  Box,
  Typography,
  Container,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Calendar, Globe, Power } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import CalendarSettings from "@/components/CalendarSettings";

const SettingsPage = () => {
  const { settings, isLoading, error } = useSettings();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" component="h1">
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your Parent Assistant preferences and automation settings.
          </Typography>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Calendar Card */}
        <Card>
          <CardHeader
            sx={{
              paddingBottom: 0,
            }}
            avatar={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 1,
                  bgcolor: "primary.50",
                }}
              >
                <Calendar size={20} color="currentColor" />
              </Box>
            }
            title={<Typography variant="h5">Calendar settings</Typography>}
          />
          <CardContent>
            <CalendarSettings
              isLoading={isLoading}
              settingsCalendarId={settings?.calendar_id ?? undefined}
              settingsCalendarName={settings?.calendar_name ?? undefined}
            />
          </CardContent>
        </Card>

        {/* Language Card */}
        <Card>
          <CardHeader
            avatar={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  bgcolor: "primary.50",
                }}
              >
                <Globe size={20} color="currentColor" />
              </Box>
            }
            title={<Typography variant="h5">Language preferences</Typography>}
          />
          <CardContent>{/* Form content will be added here */}</CardContent>
        </Card>

        {/* Start Automation Card */}
        <Card>
          <CardHeader
            avatar={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 1,
                  bgcolor: "primary.50",
                }}
              >
                <Power size={20} color="currentColor" />
              </Box>
            }
            title={<Typography variant="h5">Service control</Typography>}
          />
          <CardContent>{/* Form content will be added here */}</CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SettingsPage;
