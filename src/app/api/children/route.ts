import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
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

    // Fetch children for the authenticated user
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching children:", error);
      return NextResponse.json(
        { error: "Failed to fetch children", details: error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ children: data || [] });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, label_name, expected_senders, keywords } = body;

    // Validate required fields
    if (!name || !label_name) {
      return NextResponse.json(
        { error: "Name and label_name are required" },
        { status: 400 }
      );
    }

    // Create new child
    const { data, error } = await supabase
      .from("children")
      .insert({
        user_id: user.id,
        name,
        label_name,
        expected_senders,
        keywords,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating child:", error);
      return NextResponse.json(
        { error: "Failed to create child" },
        { status: 500 }
      );
    }

    return NextResponse.json({ child: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
