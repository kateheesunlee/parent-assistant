import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { UpdateCalendarRequest } from "@/types/settings";
import { getGoogleAccessToken } from "@/lib/auth";
import { GoogleCalendarService } from "@/services/google-calendar";

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
    const { calendar_name, timeZone, description, location } = body;

    // Validate required fields
    if (!calendar_name) {
      return NextResponse.json(
        { error: "calendar name is required" },
        { status: 400 }
      );
    }

    // Initialize Google Calendar service
    const calendarService = new GoogleCalendarService(accessToken);

    // Create the calendar
    const calendar = await calendarService.createCalendar(
      calendar_name,
      timeZone,
      description,
      location
    );

    // Update the calendar settings
    const { data, error } = await supabase
      .from("settings")
      .update({ calendar_id: calendar.id, calendar_name: calendar.summary })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating calendar settings:", error);
      return NextResponse.json(
        {
          error: "Failed to update calendar settings",
          details: error?.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ calendar, settings: data }, { status: 201 });
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

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { calendar_id, calendar_name } = body;

    // Build update object only with provided fields
    const updates: UpdateCalendarRequest = {};
    if (calendar_id !== undefined) updates.calendar_id = calendar_id;
    if (calendar_name !== undefined) updates.calendar_name = calendar_name;

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let result;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("settings")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating calendar settings:", error);
        return NextResponse.json(
          {
            error: "Failed to update calendar settings",
            details: error?.message,
          },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Insert new settings with user_id
      const { data, error } = await supabase
        .from("settings")
        .insert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating calendar settings:", error);
        return NextResponse.json(
          {
            error: "Failed to create calendar settings",
            details: error?.message,
          },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({ settings: result });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
