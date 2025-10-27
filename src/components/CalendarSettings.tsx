"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useCalendars,
  useUpdateCalendar,
  useCreateCalendar,
  useSettings,
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
import { EditIcon, PlusIcon } from "lucide-react";
import { CalendarListEntry } from "@/types/settings";

const CalendarSettings = () => {
  const { settings, isLoading, error } = useSettings();
  const settingsCalendarId = settings?.calendar_id ?? undefined;
  const settingsCalendarName = settings?.calendar_name ?? undefined;

  const [showCalendarSelector, setShowCalendarSelector] =
    useState<boolean>(false);

  if (isLoading) {
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl sx={{ width: "100%", maxWidth: "300px" }}>
        <FormLabel>Selected calendar</FormLabel>
        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 1, width: "100%" }}
        >
          <OutlinedInput
            value={settingsCalendarName}
            onChange={() => {}}
            disabled={true}
            fullWidth
          />
          <Button
            size="small"
            onClick={() => setShowCalendarSelector((prev) => !prev)}
            startIcon={<EditIcon size={16} />}
          >
            {showCalendarSelector ? "Close" : "Open"}
          </Button>
        </Box>
      </FormControl>
      {showCalendarSelector && (
        <CalendarSelector selectedCalendarId={settingsCalendarId} />
      )}
    </Box>
  );
};

export default CalendarSettings;

const CalendarSelector = ({
  selectedCalendarId,
}: {
  selectedCalendarId: string | undefined;
}) => {
  const { calendars, isLoading, error } = useCalendars();
  const { updateCalendar } = useUpdateCalendar();
  const { createCalendar, isLoading: isCreatingCalendar } = useCreateCalendar();
  const [newCalendarName, setNewCalendarName] = useState<string>("");

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
  };

  const handleCreateCalendar = useCallback(async () => {
    await createCalendar({
      calendar_name: newCalendarName,
    });
    setNewCalendarName("");
  }, [newCalendarName, createCalendar]);

  if (isLoading) {
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
      <Typography variant="h6" color="text.primary">
        Choose or create a calendar
      </Typography>
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
            value={newCalendarName}
            onChange={(e) => setNewCalendarName(e.target.value)}
            placeholder="Enter new calendar name"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isCreatingCalendar ? (
                <CircularProgress sx={{ color: "white" }} size={16} />
              ) : (
                <PlusIcon size={16} />
              )
            }
            disabled={!newCalendarName.trim()}
            onClick={handleCreateCalendar}
          >
            {isCreatingCalendar ? "Creating..." : "Add"}
          </Button>
        </Box>
      </FormControl>
    </Box>
  );
};
