import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/auth";
import { GoogleCalendarService } from "@/services/google-calendar";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", details: authError?.message },
        { status: 401 }
      );
    }

    // Get Google access token
    const accessToken = await getGoogleAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Google authentication required",
          details: "Please sign in with Google to access calendars",
        },
        { status: 401 }
      );
    }

    // Initialize Google Calendar service
    const calendarService = new GoogleCalendarService(accessToken);

    // Get the list of calendars
    const calendars = await calendarService.getCalendarList();

    return NextResponse.json({ calendars });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch calendars",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", details: authError?.message },
        { status: 401 }
      );
    }

    // Get Google access token
    const accessToken = await getGoogleAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Google authentication required",
          details: "Please sign in with Google to create calendars",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { calendarName, timeZone, description, location } = body;

    // Validate required fields
    if (!calendarName) {
      return NextResponse.json(
        { error: "calendarName is required" },
        { status: 400 }
      );
    }

    // Initialize Google Calendar service
    const calendarService = new GoogleCalendarService(accessToken);

    // Create the calendar
    const calendar = await calendarService.createCalendar(
      calendarName,
      timeZone,
      description,
      location
    );

    return NextResponse.json({ calendar }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Failed to create calendar",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
