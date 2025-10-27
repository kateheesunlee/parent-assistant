import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/auth";
import { UpdateServiceRequest } from "@/types/settings";
import { Child } from "@/types/children";

export interface ServiceSettings {
  calendar_id: string;
  calendar_name: string;
  preferred_language: string;
  automation_enabled: boolean;
}

async function sendWebhook(
  event: "start" | "stop",
  userId: string,
  settings: ServiceSettings,
  children: Child[]
) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("N8N_WEBHOOK_URL not configured, skipping webhook call");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_KEY || "",
      },
      body: JSON.stringify({
        event,
        userId,
        settings: {
          calendar_id: settings.calendar_id,
          calendar_name: settings.calendar_name,
          preferred_language: settings.preferred_language,
          automation_enabled: settings.automation_enabled,
        },
        children: children,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to send webhook:", error);
    // Don't throw - webhook failure shouldn't fail the API call
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

    // Send webhook notification if automation status changed
    if (automation_enabled !== undefined) {
      const event = automation_enabled ? "start" : "stop";
      const { data: children } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id);

      // Build webhook settings payload
      const webhookSettings: ServiceSettings = {
        calendar_id: result.calendar_id || "",
        calendar_name: result.calendar_name || "",
        preferred_language: result.preferred_language || "",
        automation_enabled: result.automation_enabled,
      };

      if (children) {
        await sendWebhook(event, user.id, webhookSettings, children);
      } else {
        console.error("No children found for user:", user.id);
      }
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
