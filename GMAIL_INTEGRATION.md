# Gmail Integration for Child Management

This document describes the Gmail integration implementation for automatically creating labels and filters when a new child is added to the system.

## Overview

When a child is created through the API, the system automatically performs the following background operations:

1. **Create Gmail Label**: Creates a Gmail label using the provided `label_name`
2. **Create Gmail Filter**: Creates a Gmail filter that:
   - Filters emails based on the child's name, expected senders, and keywords
   - Automatically applies the created label to matching emails
3. **Store IDs**: Saves both the label ID and filter ID in the database for future reference

## Architecture

### Files Created

#### 1. `src/services/gmail.ts`
The Gmail service class that handles all Gmail API interactions:

- **`createLabel(labelName: string)`**: Creates a Gmail label and returns the label ID
- **`createFilter(childName, expectedSenders, keywords, labelId)`**: Creates a Gmail filter with:
  - Query criteria based on sender emails and keywords
  - Automatic label application for matching emails
- **`deleteLabel(labelId)`**: Utility method to delete a label
- **`deleteFilter(filterId)`**: Utility method to delete a filter

#### 2. `src/lib/auth.ts`
Helper function to retrieve the Google OAuth access token from the Supabase session:

- **`getGoogleAccessToken()`**: Extracts and returns the Google access token from the current user's session

### Files Modified

#### `src/app/api/children/route.ts`
Updated the POST endpoint to:

1. Get the Google access token
2. Initialize the Gmail service
3. Create the Gmail label
4. Create the Gmail filter (using the label created in step 3)
5. Store both IDs in the database when creating the child record

#### `src/app/api/children/[id]/route.ts`

**DELETE endpoint** updates to:
1. Fetch the child record to get `label_id` and `filter_id`
2. Delete the Gmail filter (if it exists)
3. Delete the Gmail label (if it exists)
4. Delete the child record from the database

This ensures that when a child is deleted, all associated Gmail resources are cleaned up automatically.

**PUT endpoint** updates to:
1. Fetch the existing child record
2. Check if the Gmail label still exists and if label name changed
3. If label doesn't exist or name changed:
   - Delete the old label (if it exists)
   - Create a new label with the updated name
4. Delete the old filter
5. Create a new filter with updated criteria (name, senders, keywords)
6. Update the child record with new `label_id` and `filter_id`

This ensures Gmail labels and filters stay synchronized when updating a child.

## Error Handling

The implementation handles errors appropriately for each operation:

### Child Creation (POST)
- If no Google access token is available, returns 401 error with "Google authentication required"
- If Gmail label or filter creation fails, returns 500 error with details
- Child record is only created if all Gmail operations succeed

### Child Update (PUT)
- If no Google access token is available, returns 401 error with "Google authentication required"
- If Gmail label or filter update fails, returns 500 error with details
- Database update only proceeds if all Gmail operations succeed

### Child Deletion (DELETE)
- If Gmail label or filter deletion fails, logs error but continues with database deletion
- This ensures cleanup always happens even if Gmail resources are already deleted

### Child Retrieval (GET)
- If Gmail label or filter is not found, adds `sync_status` to indicate they're out of sync
- UI can display warnings to the user about missing Gmail resources

## Authentication

The system uses the OAuth access token obtained during the Google sign-in process. The token is stored in the Supabase session and extracted using the `getGoogleAccessToken()` helper.

**Important**: The token retrieval works correctly in server-side sessions without any special configuration. Do NOT add `queryParams` with `prompt: "consent"` to the OAuth configuration as this breaks token storage.

### Required OAuth Scopes

Make sure your Supabase Google OAuth configuration includes:
- `https://www.googleapis.com/auth/gmail.modify` - Required for creating/updating labels
- `https://www.googleapis.com/auth/gmail.settings.basic` - Required for creating/updating filters

For more details, see [SUPABASE_OAUTH_SETUP.md](./SUPABASE_OAUTH_SETUP.md).

## API Response

The child creation endpoint now returns a child object that includes:
- `label_id`: The Gmail label ID (or null if creation failed)
- `filter_id`: The Gmail filter ID (or null if creation failed)

## Example Usage

When a child is created with:
```json
{
  "name": "John Doe",
  "label_name": "John's School",
  "expected_senders": ["school@example.com", "teacher@example.com"],
  "keywords": ["homework", "field trip"]
}
```

The system will:
1. Create a Gmail label named "John's School"
2. Create a Gmail filter that matches:
   - Emails containing "John Doe" **AND** (from "school@example.com" OR "teacher@example.com" **OR** containing "homework" OR "field trip")
   - Automatically applies the "John's School" label
3. Store both IDs in the database

### Filter Logic

The Gmail filter uses the following logic:
- **Child Name is ALWAYS required** - All filters must contain the child's name
- **Conditions are OR-ed together** - Emails matching ANY of the conditions will be labeled
- **Senders**: All expected senders are OR'd together: `(from:sender1 OR from:sender2)`
- **Keywords**: All keywords are OR'd together: `("keyword1" OR "keyword2")`
- **Final Query**: `"ChildName" AND ((from:sender1 OR from:sender2) OR ("keyword1" OR "keyword2"))`

Example queries:
- `"John Doe" AND (from:school@example.com OR from:teacher@example.com)` - Senders only
- `"John Doe" AND ("homework" OR "field trip")` - Keywords only
- `"John Doe" AND ((from:school@example.com OR from:teacher@example.com) OR ("homework" OR "field trip"))` - Both

## Future Enhancements

Potential improvements:
- Handle automatic token refresh for expired access tokens (currently requires re-authentication)
- Add retry logic for failed Gmail API calls
- Support for multiple label operations (e.g., applying multiple labels)
- Better handling of partial Gmail failures (e.g., label created but filter creation fails)
