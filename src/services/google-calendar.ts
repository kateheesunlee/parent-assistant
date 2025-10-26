interface Calendar {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
  location?: string;
}

interface CalendarListEntry {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
  accessRole: string;
  backgroundColor?: string;
  foregroundColor?: string;
  primary?: boolean;
}

interface CalendarListResponse {
  items: CalendarListEntry[];
  kind: string;
  etag: string;
}

interface CreateCalendarRequest {
  summary: string;
  description?: string;
  timeZone?: string;
  location?: string;
}

interface CreateCalendarResponse {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
  location?: string;
}

export class GoogleCalendarService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get all available calendars for the authenticated user
   * @returns List of calendars the user has access to
   */
  async getCalendarList(): Promise<CalendarListEntry[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to get calendar list:", error);
        throw new Error(
          `Failed to get calendar list: ${
            error.error?.message || "Unknown error"
          }`
        );
      }

      const data: CalendarListResponse = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error getting calendar list:", error);
      throw error;
    }
  }

  /**
   * Get a calendar by ID
   * @param calendarId - The ID of the calendar to retrieve
   * @returns The calendar object if found, null otherwise
   */
  async getCalendar(calendarId: string): Promise<Calendar | null> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Calendar not found
        }
        const error = await response.json();
        console.error("Failed to get calendar:", error);
        throw new Error(
          `Failed to get calendar: ${error.error?.message || "Unknown error"}`
        );
      }

      const calendar = await response.json();
      return calendar;
    } catch (error) {
      console.error("Error getting calendar:", error);
      throw error;
    }
  }

  /**
   * Create a new calendar
   * @param calendarName - The name of the calendar to create
   * @param timeZone - The timezone for the calendar (default: America/Los_Angeles)
   * @param description - Optional description for the calendar
   * @param location - Optional location for the calendar
   * @returns The created calendar with its ID
   */
  async createCalendar(
    calendarName: string,
    timeZone: string = "America/Los_Angeles",
    description?: string,
    location?: string
  ): Promise<CreateCalendarResponse> {
    try {
      const requestBody: CreateCalendarRequest = {
        summary: calendarName,
        timeZone,
      };

      if (description) {
        requestBody.description = description;
      }

      if (location) {
        requestBody.location = location;
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create calendar:", error);
        throw new Error(
          `Failed to create calendar: ${
            error.error?.message || "Unknown error"
          }`
        );
      }

      const calendar = await response.json();
      return {
        id: calendar.id,
        summary: calendar.summary,
        description: calendar.description,
        timeZone: calendar.timeZone,
        location: calendar.location,
      };
    } catch (error) {
      console.error("Error creating calendar:", error);
      throw error;
    }
  }

  /**
   * Delete a calendar (optional utility)
   * @param calendarId - The ID of the calendar to delete
   */
  async deleteCalendar(calendarId: string): Promise<void> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          calendarId
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete calendar:", error);
        throw new Error(
          `Failed to delete calendar: ${
            error.error?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
      throw error;
    }
  }
}
