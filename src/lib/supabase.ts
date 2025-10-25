import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
// This is used for client-side operations such as authentication and database queries
// This can be used for user interactions like signing in, signing up, and updating user data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
