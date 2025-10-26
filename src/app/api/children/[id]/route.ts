import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/auth";
import { GmailService } from "@/services/gmail";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, label_name, expected_senders, keywords } = body;

    // Validate required fields
    if (!name || !label_name) {
      return NextResponse.json(
        { error: "Name and label_name are required" },
        { status: 400 }
      );
    }

    // Update child (ensuring user owns it)
    const { data, error } = await supabase
      .from("children")
      .update({
        name,
        label_name,
        expected_senders,
        keywords,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating child:", error);
      return NextResponse.json(
        { error: "Failed to update child" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    return NextResponse.json({ child: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // First, fetch the child to get label_id and filter_id
    const { data: child, error: fetchError } = await supabase
      .from("children")
      .select("label_id, filter_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !child) {
      console.error("Error fetching child:", fetchError);
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Delete Gmail label and filter if they exist
    try {
      const accessToken = await getGoogleAccessToken();

      if (accessToken) {
        const gmailService = new GmailService(accessToken);

        // Delete Gmail filter first (if it exists)
        if (child.filter_id) {
          try {
            await gmailService.deleteFilter(child.filter_id);
            console.log(
              `Successfully deleted Gmail filter: ${child.filter_id}`
            );
          } catch (filterError) {
            console.error("Failed to delete Gmail filter:", filterError);
            // Continue even if filter deletion fails
          }
        }

        // Delete Gmail label (if it exists)
        if (child.label_id) {
          try {
            await gmailService.deleteLabel(child.label_id);
            console.log(`Successfully deleted Gmail label: ${child.label_id}`);
          } catch (labelError) {
            console.error("Failed to delete Gmail label:", labelError);
            // Continue even if label deletion fails
          }
        }
      }
    } catch (gmailError) {
      console.error("Error in Gmail cleanup:", gmailError);
      // Continue with child deletion even if Gmail cleanup fails
    }

    // Delete child record
    const { error: deleteError } = await supabase
      .from("children")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting child:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete child" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
