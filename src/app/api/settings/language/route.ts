import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
    const { preferred_language } = body;

    if (preferred_language === undefined) {
      return NextResponse.json(
        { error: "preferred_language is required" },
        { status: 400 }
      );
    }

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
        .update({ preferred_language })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating language settings:", error);
        return NextResponse.json(
          {
            error: "Failed to update language settings",
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
          preferred_language,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating language settings:", error);
        return NextResponse.json(
          {
            error: "Failed to create language settings",
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
