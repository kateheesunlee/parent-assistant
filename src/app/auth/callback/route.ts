import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
