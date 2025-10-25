"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Box, Typography, Container, Paper, Alert } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";

function AuthPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const searchParams = useSearchParams();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          router.push("/dashboard");
          return;
        }
      } catch {
        // Silently handle auth check errors
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "openid email profile",
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth to prevent flash of content
  if (isCheckingAuth) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Parent Assistant
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access your dashboard and manage your family&apos;s
            activities.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<GoogleIcon />}
            variant="outline"
            size="lg"
            sx={{
              width: "100%",
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Loading...
              </Typography>
            </Paper>
          </Box>
        </Container>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
