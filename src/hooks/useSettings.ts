import { useEffect, useState } from "react";
import {
  Settings,
  UpdateSettingsRequest,
  UpdateCalendarRequest,
  UpdateLanguageRequest,
} from "@/types/settings";
import { useToast } from "@/components/ui/toast-provider";

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch settings");
        }

        setSettings(data.settings);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch settings";
        setError(errorMessage);
        setSettings(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch settings");
      }

      setSettings(data.settings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch settings";
      setError(errorMessage);
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, error, refetch };
}

export function useUpdateSettings() {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateSettings = async (data: UpdateSettingsRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update settings");
      }

      showSuccess("Settings updated successfully");
      return result.settings;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update settings";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateSettings, isLoading };
}

export function useUpdateCalendar() {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateCalendar = async (data: UpdateCalendarRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/calendar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update calendar settings");
      }

      showSuccess("Calendar settings updated successfully");
      return result.settings;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update calendar settings";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCalendar, isLoading };
}

export function useUpdateLanguage() {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateLanguage = async (data: UpdateLanguageRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update language settings");
      }

      showSuccess("Language settings updated successfully");
      return result.settings;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update language settings";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateLanguage, isLoading };
}

export function useUpdateService() {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const startService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/service", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          automation_enabled: true,
          last_started_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to start service");
      }

      showSuccess("Service started successfully");
      return result.settings;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start service";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const stopService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/service", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          automation_enabled: false,
          last_stopped_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to stop service");
      }

      showSuccess("Service stopped successfully");
      return result.settings;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop service";
      showError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { startService, stopService, isLoading };
}
