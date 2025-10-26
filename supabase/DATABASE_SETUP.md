# Database Setup Instructions

This directory contains SQL migration files for the Parent Assistant application.

## Quick Setup (Using Supabase Dashboard)

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `migrations/001_create_children_table.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your Supabase project (first time only)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## What the Migration Does

The migration file creates:

1. **`children` table** - Stores child information and Gmail label details
   - Primary key: `id` (UUID)
   - Foreign key: `user_id` references `auth.users(id)`
   - Required fields: `name`, `label_name`
   - Optional Gmail fields: `label_id`, `filter_id`, `expected_senders`, `keywords`
   - Timestamps: `created_at`, `updated_at`

2. **Indexes** - For faster queries on `user_id` and `created_at`

3. **Row Level Security (RLS) policies** - Ensures users can only access their own children
   - Users can only SELECT their own children
   - Users can only INSERT their own children
   - Users can only UPDATE their own children
   - Users can only DELETE their own children

4. **Automatic timestamp updates** - A trigger that updates `updated_at` whenever a row is modified

## Verifying the Setup

After running the migration, you can verify it worked by:

1. Going to **Table Editor** in Supabase
2. You should see the `children` table listed
3. Click on it to view the structure

## Troubleshooting

### Error: "relation already exists"
If you get this error, the table might already exist. You can either:
- Drop the existing table and recreate it
- Or skip this step if the table structure matches what you need

### Error: "permission denied"
Make sure you're logged in to Supabase and have the correct permissions for your project.

## Next Steps

After setting up the database:
1. Test creating a child record through the UI
2. Verify that users can only see their own children
3. Check that the `updated_at` field updates automatically on edits
