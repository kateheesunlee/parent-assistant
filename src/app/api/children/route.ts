import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getGoogleAccessToken } from "@/lib/auth";
import { GmailService } from "@/services/gmail";

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

    // Validate Gmail labels and filters if access token is available
    const accessToken = await getGoogleAccessToken();
    let childrenWithSync = data || [];

    if (accessToken && data && data.length > 0) {
      const gmailService = new GmailService(accessToken);

      // Validate each child's Gmail resources
      childrenWithSync = await Promise.all(
        data.map(async (child) => {
          const syncStatus: {
            label_deleted?: boolean;
            filter_deleted?: boolean;
          } = {};

          // Check label if it exists
          if (child.label_id) {
            try {
              const label = await gmailService.getLabel(child.label_id);
              if (!label) {
                syncStatus.label_deleted = true;
                console.log(
                  `Label ${child.label_id} not found for child ${child.name}`
                );
              }
            } catch (labelError) {
              console.error(
                `Error checking label ${child.label_id}:`,
                labelError
              );
              syncStatus.label_deleted = true;
            }
          }

          // Check filter if it exists
          if (child.filter_id) {
            try {
              const filter = await gmailService.getFilter(child.filter_id);
              if (!filter) {
                syncStatus.filter_deleted = true;
                console.log(
                  `Filter ${child.filter_id} not found for child ${child.name}`
                );
              }
            } catch (filterError) {
              console.error(
                `Error checking filter ${child.filter_id}:`,
                filterError
              );
              syncStatus.filter_deleted = true;
            }
          }

          // Add sync status if there are issues
          if (syncStatus.label_deleted || syncStatus.filter_deleted) {
            return { ...child, sync_status: syncStatus };
          }

          return child;
        })
      );
    }

    return NextResponse.json({ children: childrenWithSync });
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

    // Initialize Gmail service variables
    let labelId: string | null = null;
    let filterId: string | null = null;

    try {
      // Get Google access token
      const accessToken = await getGoogleAccessToken();

      if (!accessToken) {
        console.error("No Google access token available");
        return NextResponse.json(
          {
            error: "Google authentication required",
            details:
              "Please sign in with Google to create children. Your session may have expired.",
          },
          { status: 401 }
        );
      }

      // Initialize Gmail service
      const gmailService = new GmailService(accessToken);

      // Step 1: Create Gmail label
      const labelResponse = await gmailService.createLabel(label_name);
      labelId = labelResponse.id;
      console.log(
        `Successfully created Gmail label: ${label_name} with ID: ${labelId}`
      );

      // Step 2: Create Gmail filter (only if label was created successfully)
      if (!labelId) {
        throw new Error("Failed to get label ID after creation");
      }

      const filterResponse = await gmailService.createFilter(
        name,
        expected_senders || [],
        keywords || [],
        labelId
      );
      filterId = filterResponse.id;
      console.log(`Successfully created Gmail filter with ID: ${filterId}`);
    } catch (gmailError) {
      console.error("Error in Gmail operations:", gmailError);
      const errorMessage =
        gmailError instanceof Error
          ? gmailError.message
          : "Failed to create Gmail label or filter";

      return NextResponse.json(
        {
          error: "Gmail integration failed",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Step 3: Create child record with label_id and filter_id
    const { data, error } = await supabase
      .from("children")
      .insert({
        user_id: user.id,
        name,
        label_name,
        label_id: labelId,
        expected_senders,
        keywords,
        filter_id: filterId,
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
