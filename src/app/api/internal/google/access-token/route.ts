import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function refreshWithGoogle(refresh_token: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    refresh_token,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`refresh_failed: ${t}`);
  }
  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
    scope?: string;
    token_type?: string;
  }>;
}

async function handle(userId: string) {
  const supabaseAdmin = await getSupabaseAdmin();

  // 1) Verify user exists
  const { data: user, error: userErr } =
    await supabaseAdmin.auth.admin.getUserById(userId);
  if (userErr || !user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  // 2) Get Google connection from connections table
  const { data: conn, error: connErr } = await supabaseAdmin
    .from("connections")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "google")
    .maybeSingle();

  if (connErr || !conn) {
    return NextResponse.json({ error: "no_connection" }, { status: 404 });
  }

  // 3) Check if token needs refresh (within 1 minute of expiry)
  const now = Date.now();
  const expMs = conn.expiry ? new Date(conn.expiry).getTime() : 0;
  const needsRefresh = !conn.access_token || !expMs || expMs < now + 60_000;

  let access_token = conn.access_token as string | null;

  if (needsRefresh) {
    if (!conn.refresh_token) {
      return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
    }
    const r = await refreshWithGoogle(conn.refresh_token);

    access_token = r.access_token;

    // 4) Update database with new token and expiry
    const newExpiry = new Date(
      now + (r.expires_in ?? 3600) * 1000
    ).toISOString();

    await supabaseAdmin
      .from("connections")
      .update({
        access_token,
        expiry: newExpiry,
        scope: r.scope || conn.scope,
        token_type: r.token_type || conn.token_type || "Bearer",
        updated_at: new Date().toISOString(),
      })
      .eq("id", conn.id);
  }

  // 5) Return access token
  return NextResponse.json({
    access_token,
    expires_at: Math.floor(
      (conn.expiry ? new Date(conn.expiry).getTime() : Date.now() + 3600_000) /
        1000
    ),
  });
}

/**
 * Internal API endpoint for n8n to get user settings and information
 *
 * n8n Setup:
 * 1. Add an HTTP Request node
 * 2. Method: GET
 * 3. URL: https://your-domain.com/api/internal/google/access-token?userId={{$json.userId}}
 * 4. Add Header: x-internal-api-key = {{your_INTERNAL_API_KEY}}
 *
 * Response:
 * - userId: User's ID
 * - email: User's email
 * - settings: User's calendar and language settings
 *
 * Note: Google access tokens are already included in webhook payloads when
 * service starts/stops. Use this endpoint only if you need user settings separately.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify internal API key
    const apiKey = request.headers.get("x-internal-api-key");
    const expectedApiKey = process.env.INTERNAL_API_KEY;

    if (!expectedApiKey) {
      console.error("INTERNAL_API_KEY not configured");
      return NextResponse.json(
        { error: "Internal API not configured" },
        { status: 500 }
      );
    }

    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API key" },
        { status: 401 }
      );
    }

    // Get userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    return handle(userId);

    // const supabase = await createSupabaseServerClient();

    // console.log("userId", userId);

    // // Get user's settings which may contain stored tokens
    // // Note: In production, you should store OAuth tokens securely in a token store
    // const { data: settings, error: settingsError } = await supabase
    //   .from("settings")
    //   .select("*")
    //   .eq("user_id", userId)
    //   .maybeSingle();

    // console.log("settings", settings);

    // if (settingsError || !settings) {
    //   console.error("Error fetching settings:", settingsError);
    //   return NextResponse.json(
    //     { error: "User settings not found" },
    //     { status: 404 }
    //   );
    // }

    // // Get user info
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.admin.getUserById(userId);

    // if (userError || !user) {
    //   console.error("Error fetching user:", userError);
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // // Return user info and settings
    // // Note: Google access tokens are stored in Supabase sessions
    // // For n8n to get fresh tokens, you should:
    // // 1. Use Supabase Admin API to refresh user session, OR
    // // 2. Store refresh tokens securely in your database, OR
    // // 3. Have n8n call your webhook which includes the token in the payload
    // return NextResponse.json({
    //   userId: user.id,
    //   email: user.email,
    //   settings: {
    //     calendar_id: settings.calendar_id,
    //     calendar_name: settings.calendar_name,
    //     preferred_language: settings.preferred_language,
    //     automation_enabled: settings.automation_enabled,
    //   },
    //   instructions: {
    //     note: "Google access tokens are available in webhook payloads when service starts/stops",
    //     webhookPayload:
    //       "Check the webhook payload for 'googleAccessToken' field",
    //     alternative:
    //       "For dynamic token retrieval, implement token storage in database",
    //   },
    // });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
