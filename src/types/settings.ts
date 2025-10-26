export interface Settings {
  user_id: string;
  preferred_language: string;
  automation_enabled: boolean;
  last_started_at: string | null;
  last_stopped_at: string | null;
  calendar_id: string | null;
  calendar_name: string;
  last_gmail_history_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateSettingsRequest {
  preferred_language?: string;
  automation_enabled?: boolean;
  last_started_at?: string;
  last_stopped_at?: string;
  calendar_id?: string;
  calendar_name?: string;
  last_gmail_history_id?: string;
}

export interface CalendarListEntry {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
  accessRole: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
}

export interface CalendarResponse {
  calendars: CalendarListEntry[];
  error?: string;
}

export interface UpdateCalendarRequest {
  calendar_id?: string;
  calendar_name?: string;
}

export interface CreateCalendarRequest {
  calendar_name: string;
}

export interface UpdateLanguageRequest {
  preferred_language: string;
}

export interface UpdateServiceRequest {
  automation_enabled?: boolean;
  last_started_at?: string;
  last_stopped_at?: string;
}

export interface SettingsResponse {
  settings: Settings | null;
  error?: string;
}
