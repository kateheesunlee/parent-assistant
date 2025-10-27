"use client";

import { useState, useMemo } from "react";
import {
  Box,
  FormControlLabel,
  Switch,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useSettings, useUpdateService } from "@/hooks/useSettings";
import { useChildren } from "@/hooks/useChildren";

const ServiceControlSetting = () => {
  const { settings, isLoading: isSettingsLoading } = useSettings();
  const { children, isLoading: isChildrenLoading } = useChildren();
  const {
    startService,
    stopService,
    isLoading: isUpdatingService,
  } = useUpdateService();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Derive enabled state from settings
  const isEnabled = settings?.automation_enabled ?? false;

  // Check requirements status
  const requirements = useMemo(() => {
    return {
      hasChildren: children && children.length > 0,
      hasCalendar: !!settings?.calendar_id,
      hasLanguage:
        !!settings?.preferred_language &&
        settings.preferred_language !== "auto",
    };
  }, [children, settings]);

  // Validate required fields before starting
  const validateStart = (): boolean => {
    const errors: string[] = [];

    if (!requirements.hasChildren) {
      errors.push("At least one child must be added");
    }

    if (!requirements.hasCalendar) {
      errors.push("A calendar must be selected");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;

    // If trying to start, validate first
    if (newValue && !validateStart()) {
      // Don't change the toggle if validation fails
      return;
    }

    try {
      if (newValue) {
        await startService();
      } else {
        await stopService();
      }
    } catch {
      // If webhook call fails, the error is handled by the hook
      // The UI will revert automatically via the settings state
    }
  };

  const isLoading = isSettingsLoading || isChildrenLoading || isUpdatingService;

  const isDisabled =
    !isEnabled && (!requirements.hasChildren || !requirements.hasCalendar);

  return (
    <Box>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!isLoading && (
        <>
          {/* Requirements Status */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Service Requirements
            </Typography>

            {/* Required Fields */}

            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: requirements.hasChildren
                    ? "success.light"
                    : "error.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {requirements.hasChildren ? (
                  <CheckCircle
                    size={12}
                    color="currentColor"
                    style={{ color: "inherit" }}
                  />
                ) : (
                  <AlertCircle
                    size={12}
                    color="currentColor"
                    style={{ color: "inherit" }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                color={requirements.hasChildren ? "success.main" : "error.main"}
              >
                {requirements.hasChildren ? "✓" : "✗"} At least one child added
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: requirements.hasCalendar
                    ? "success.light"
                    : "error.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {requirements.hasCalendar ? (
                  <CheckCircle
                    size={12}
                    color="currentColor"
                    style={{ color: "inherit" }}
                  />
                ) : (
                  <AlertCircle
                    size={12}
                    color="currentColor"
                    style={{ color: "inherit" }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                color={requirements.hasCalendar ? "success.main" : "error.main"}
              >
                {requirements.hasCalendar ? "✓" : "✗"} Calendar selected
              </Typography>
            </Box>

            {/* Optional Fields */}
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: requirements.hasLanguage
                    ? "info.light"
                    : "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {requirements.hasLanguage ? (
                  <CheckCircle
                    size={12}
                    color="currentColor"
                    style={{ color: "inherit" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "grey.500",
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="body2"
                color={
                  requirements.hasLanguage ? "info.main" : "text.secondary"
                }
              >
                {requirements.hasLanguage ? "✓" : "○"} Language preference set
                (optional)
              </Typography>
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={isEnabled}
                onChange={handleToggle}
                disabled={isDisabled}
              />
            }
            label={
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Automation Service
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isEnabled
                    ? "Service is running and monitoring emails"
                    : "Service is stopped"}
                </Typography>
              </Box>
            }
          />

          {validationErrors.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Cannot start service. Please fix the following:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <Typography variant="body2">{error}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}

          {settings?.last_started_at && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Last started:{" "}
              {new Date(settings.last_started_at).toLocaleString()}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default ServiceControlSetting;
