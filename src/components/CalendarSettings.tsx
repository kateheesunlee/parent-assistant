"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useCalendars,
  useUpdateCalendar,
  useCreateCalendar,
} from "@/hooks/useSettings";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { PlusIcon } from "lucide-react";
import { CalendarListEntry } from "@/types/settings";

interface CalendarSettingsProps {
  isLoading?: boolean;
  settingsCalendarId?: string;
  settingsCalendarName?: string;
}

const CalendarSettings = ({
  isLoading: isSettingsLoading,
  settingsCalendarId,
  settingsCalendarName,
}: CalendarSettingsProps) => {
  const [newCalendarName, setNewCalendarName] = useState<string>("");
  const { calendars, addCalendar, isLoading, error } = useCalendars();
  const { updateCalendar, isLoading: isUpdatingCalendar } = useUpdateCalendar();
  const { createCalendar, isLoading: isCreatingCalendar } = useCreateCalendar();

  const [selectedCalendarId, setSelectedCalendarId] = useState<
    string | undefined
  >(settingsCalendarId);

  useEffect(() => {
    setSelectedCalendarId(settingsCalendarId);
  }, [settingsCalendarId]);

  // Check if the settings calendar exists in the available calendars
  const isCalendarMissing = useMemo(() => {
    if (!selectedCalendarId || calendars.length === 0) {
      return false;
    }
    return !calendars.some((cal) => cal.id === selectedCalendarId);
  }, [selectedCalendarId, calendars]);

  const handleCalendarSelect = async (calendar: CalendarListEntry) => {
    await updateCalendar({
      calendar_id: calendar.id,
      calendar_name: calendar.summary,
    });
    setSelectedCalendarId(calendar.id);
  };

  const handleCreateCalendar = useCallback(async () => {
    const response = await createCalendar({
      calendar_name: newCalendarName,
    });
    setNewCalendarName("");
    console.log(response);
    // update the selected calendar id and available calendars
    setSelectedCalendarId(response.id);
    const newCalendar: CalendarListEntry = {
      id: response.id,
      summary: response.summary,
      accessRole: "owner",
    };
    addCalendar(newCalendar);
  }, [newCalendarName, createCalendar, addCalendar]);

  if (
    isLoading ||
    isSettingsLoading ||
    isUpdatingCalendar ||
    isCreatingCalendar
  ) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      {/* Calendar selection UI will go here */}
      {isCalendarMissing && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          The previously selected calendar no longer exists in your Google
          Calendar. Please select a different calendar or create a new one.
        </Alert>
      )}
      <FormControl fullWidth>
        <FormLabel>Available calendars</FormLabel>
        {calendars.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {calendars.map((calendar) => {
              const isSelected = selectedCalendarId === calendar.id;
              return (
                <Button
                  size="small"
                  variant={isSelected ? "contained" : "outlined"}
                  key={calendar.id}
                  onClick={() => handleCalendarSelect(calendar)}
                >
                  {calendar.summary}
                </Button>
              );
            })}
          </Box>
        )}
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
        <Typography variant="h6" color="text.disabled">
          OR
        </Typography>
      </Box>
      <FormControl fullWidth>
        <FormLabel>Create a new calendar</FormLabel>
        <Box
          gap={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <OutlinedInput
            fullWidth
            placeholder="Enter new calendar name"
            onChange={(e) => setNewCalendarName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusIcon size={16} />}
            disabled={!newCalendarName.trim()}
            onClick={handleCreateCalendar}
          >
            Add
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};

export default CalendarSettings;
