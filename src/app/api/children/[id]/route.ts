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

    // First, fetch the existing child to get label_id and filter_id
    const { data: existingChild, error: fetchError } = await supabase
      .from("children")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !existingChild) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    let labelId = existingChild.label_id;
    let filterId = existingChild.filter_id;

    try {
      // Get Google access token
      const accessToken = await getGoogleAccessToken();

      if (!accessToken) {
        console.error("No Google access token available");
        return NextResponse.json(
          {
            error: "Google authentication required",
            details:
              "Please sign in with Google to update children. Your session may have expired.",
          },
          { status: 401 }
        );
      }

      const gmailService = new GmailService(accessToken);

      // Check if we need to recreate label
      const labelExists = labelId ? await gmailService.getLabel(labelId) : null;

      if (!labelExists || label_name !== existingChild.label_name) {
        // Delete old label if it exists and is different
        if (labelExists && labelId) {
          try {
            await gmailService.deleteLabel(labelId);
            console.log(`Deleted old label: ${labelId}`);
          } catch (deleteError) {
            console.error("Error deleting old label:", deleteError);
            // Continue anyway
          }
        }

        // Create new label
        const labelResponse = await gmailService.createLabel(label_name);
        labelId = labelResponse.id;
        console.log(`Created new label: ${labelId}`);
      }

      // Delete old filter if it exists
      if (filterId) {
        try {
          await gmailService.deleteFilter(filterId);
          console.log(`Deleted old filter: ${filterId}`);
        } catch (deleteError) {
          console.error("Error deleting old filter:", deleteError);
          // Continue anyway
        }
      }

      // Create new filter with updated criteria
      if (labelId) {
        const filterResponse = await gmailService.createFilter(
          name,
          expected_senders || [],
          keywords || [],
          labelId
        );
        filterId = filterResponse.id;
        console.log(`Created new filter: ${filterId}`);
      }
    } catch (gmailError) {
      console.error("Error in Gmail operations:", gmailError);
      const errorMessage =
        gmailError instanceof Error
          ? gmailError.message
          : "Failed to update Gmail label or filter";

      return NextResponse.json(
        {
          error: "Gmail integration failed",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Update child with new label_id and filter_id
    const { data, error } = await supabase
      .from("children")
      .update({
        name,
        label_name,
        label_id: labelId,
        expected_senders,
        keywords,
        filter_id: filterId,
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
