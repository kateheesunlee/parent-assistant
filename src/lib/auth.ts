import { createSupabaseServerClient } from "./supabase-server";

/**
 * Get the Google access token from the current user's session
 * This token is used to make authenticated requests to Google APIs
 * @returns The access token or null if not available
 */
export async function getGoogleAccessToken(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      console.error("No session found:", error);
      return null;
    }

    // The access token is stored in the provider token
    const providerToken = session.provider_token;

    if (!providerToken) {
      console.error("No provider token found in session");
      return null;
    }

    return providerToken;
  } catch (error) {
    console.error("Error getting Google access token:", error);
    return null;
  }
}
