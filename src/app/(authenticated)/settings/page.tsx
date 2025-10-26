"use client";

import { Box, Typography, Container, SelectChangeEvent } from "@mui/material";
import { Calendar, Globe, Power } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import SettingsCard from "@/components/SettingsCard";
import CalendarSettings from "@/components/CalendarSettings";
import LanguageSetting from "@/components/LanguageSetting";
import ServiceControlSetting from "@/components/ServiceControlSetting";
import { useUpdateLanguage } from "@/hooks/useSettings";

const SettingsPage = () => {
  const { settings, isLoading, error } = useSettings();
  const { updateLanguage } = useUpdateLanguage();

  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    await updateLanguage({
      preferred_language: event.target.value,
    });
  };

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
        <SettingsCard title="Calendar settings" icon={<Calendar size={20} />}>
          <CalendarSettings
            isLoading={isLoading}
            settingsCalendarId={settings?.calendar_id ?? undefined}
            settingsCalendarName={settings?.calendar_name ?? undefined}
          />
        </SettingsCard>

        <SettingsCard title="Language preferences" icon={<Globe size={20} />}>
          <LanguageSetting
            settingsLanguage={settings?.preferred_language ?? undefined}
            handleLanguageChange={handleLanguageChange}
          />
        </SettingsCard>

        <SettingsCard title="Service control" icon={<Power size={20} />}>
          <ServiceControlSetting isLoading={isLoading} />
        </SettingsCard>
      </Box>
    </Container>
  );
};

export default SettingsPage;
