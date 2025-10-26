import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { UpdateServiceRequest } from "@/types/settings";

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
    const { automation_enabled, last_started_at, last_stopped_at } = body;

    // Build update object only with provided fields
    const updates: UpdateServiceRequest = {};
    if (automation_enabled !== undefined)
      updates.automation_enabled = automation_enabled;
    if (last_started_at !== undefined)
      updates.last_started_at = last_started_at;
    if (last_stopped_at !== undefined)
      updates.last_stopped_at = last_stopped_at;

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
        console.error("Error updating service settings:", error);
        return NextResponse.json(
          {
            error: "Failed to update service settings",
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
        console.error("Error creating service settings:", error);
        return NextResponse.json(
          {
            error: "Failed to create service settings",
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
