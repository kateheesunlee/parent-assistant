import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { UpdateCalendarRequest } from "@/types/settings";

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
