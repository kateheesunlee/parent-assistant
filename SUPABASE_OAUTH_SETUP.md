# Supabase OAuth Setup for Google Integration

## Issue: No Provider Token in Session (RESOLVED)

**Status**: Fixed by removing unnecessary `queryParams` from OAuth configuration.

If you're getting "No provider token found in session" errors, **DO NOT** add `queryParams`. Instead, ensure you have the correct scopes configured and let Supabase handle the OAuth flow automatically.

## Root Cause

The `provider_token` was not being stored in the session. The issue was caused by adding `queryParams` with `prompt: "consent"` to the OAuth configuration. **Removing these query parameters fixed the issue.**

**Why removing `prompt: "consent"` fixes it**:
- Supabase's default OAuth flow already handles consent and token storage properly
- Adding `prompt: "consent"` triggers Google's strict consent flow which bypasses Supabase's automatic token propagation
- The extra parameters caused Google to not return the token in the format Supabase expects
- Without these parameters, Supabase can automatically handle token storage in server-side sessions

## Required Supabase Configuration

### 1. Enable Google OAuth Provider

In your Supabase Dashboard:
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
4. **Important**: Set the Authorized redirect URIs to:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`

### 2. Configure OAuth Scopes

The application requires these Google scopes:
- `openid`
- `email`
- `profile`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.settings.basic`
- `https://www.googleapis.com/auth/calendar`

### 3. Enable Provider Token Storage

By default, Supabase may not store the provider token. You need to check:

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Ensure **Site URL** is set correctly
3. Check **Redirect URLs** includes your callback URL

### 4. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add to **Authorized redirect URIs**:
   - `https://[your-project-ref].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Code Changes Made

### 1. Updated OAuth Sign-In (`src/app/auth/page.tsx`)

Added required Gmail and Calendar scopes to the OAuth configuration:

```typescript
scopes:
  "openid email profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/calendar"
```

**Important**: Do NOT add `queryParams` with `prompt: "consent"` - this causes issues with token storage. Let Supabase handle the OAuth flow automatically.

### 2. Session Refresh Logic (`src/lib/auth.ts`)

Added automatic session refresh to handle token expiry:

```typescript
const { data: { session: refreshedSession } } = 
  await supabase.auth.refreshSession(session);
```

## Debugging Steps

### Check 1: Verify Session Structure

Look at the server logs when calling the API. You should see:

```
Session provider_token exists: true
Session provider_refresh_token exists: true
```

If both are `false`, the configuration is incorrect.

### Check 2: Supabase Dashboard

1. Go to **Authentication** > **Users**
2. Click on a user
3. Look at the **OAuth Providers** section
4. Verify Google is listed with the correct scopes

### Check 3: Test OAuth Flow

1. Clear all cookies and local storage
2. Sign out completely
3. Sign in again with Google
4. Check if the consent screen shows the requested scopes
5. Accept all permissions

### Check 4: Environment Variables

Ensure these are set correctly in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## Common Issues

### Issue 1: "No provider token found"

**Cause**: Supabase isn't storing the OAuth provider token

**Solution**: 
- Verify OAuth provider is enabled
- Check redirect URIs match exactly
- Re-authenticate after configuration changes

### Issue 2: "Token expired" after 1 hour

**Cause**: Google access tokens expire

**Solution**: The code now automatically refreshes tokens (already implemented)

### Issue 3: "Insufficient permissions"

**Cause**: OAuth scopes not granted

**Solution**:
- Re-authenticate and grant all permissions
- Check Google Cloud Console scopes are correct

## Testing the Fix

1. **Clear your browser storage** (cookies, localStorage, sessionStorage)
2. **Sign out** from Supabase
3. **Sign in** again with Google
4. **Accept all permissions** on the consent screen
5. **Try to create or update a child**

You should see in the logs:
```
Session provider_token exists: true
```

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Best Practices](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Supabase Refresh Tokens](https://supabase.com/docs/guides/auth/refresh-tokens)

## Contact

If issues persist after following this guide:
1. Check Supabase status page
2. Review Supabase community forum
3. Open an issue in the project repository
