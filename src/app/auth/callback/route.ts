import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(
      `${origin}/auth?error=${encodeURIComponent("Server configuration error")}`
    );
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        // Store OAuth tokens in connections table
        const providerToken = data.session.provider_token;
        const providerRefreshToken = data.session.provider_refresh_token;
        const user = data.user;

        // Use provider_refresh_token if available, otherwise use Supabase's refresh_token
        // Note: Some Supabase configurations may not expose provider_refresh_token
        const refreshTokenToStore =
          providerRefreshToken || data.session.refresh_token;

        if (providerToken && refreshTokenToStore && user) {
          try {
            // Create admin client to insert into connections table
            const supabaseAdmin = createClient(
              supabaseUrl,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
              {
                auth: {
                  autoRefreshToken: false,
                  persistSession: false,
                },
              }
            );

            // Get user's OAuth identity to find provider_user_id
            const identity = user.identities?.find(
              (i) => i.provider === "google"
            );

            if (identity) {
              // Calculate expiry (Google tokens typically expire in 1 hour)
              const expiry = new Date(Date.now() + 3600 * 1000).toISOString();

              await supabaseAdmin.from("connections").upsert({
                user_id: user.id,
                provider: "google",
                provider_user_id: identity.id,
                access_token: providerToken,
                refresh_token: refreshTokenToStore, // This will be available in the outer scope
                scope: data.session.provider_token?.split(".")[1] || "", // Store scope if available
                token_type: "Bearer",
                expiry: expiry,
                updated_at: new Date().toISOString(),
              });
            }
          } catch (tokenError) {
            console.error("Error storing tokens:", tokenError);
            // Don't fail the auth flow if token storage fails
          }
        }

        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(
          `${origin}/auth?error=${encodeURIComponent(
            error?.message || "Authentication failed"
          )}`
        );
      }
    } catch {
      return NextResponse.redirect(
        `${origin}/auth?error=${encodeURIComponent(
          "Unexpected authentication error"
        )}`
      );
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/auth?error=${encodeURIComponent(
      "No authorization code received"
    )}`
  );
}
