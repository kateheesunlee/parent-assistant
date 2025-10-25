import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography, Box, Container, Grid } from "@mui/material";
import { FeatureCard } from "@/components/FeatureCard";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";

export default function HomePage() {
  // No need to check auth here. This page is public.
  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box component="header" sx={{ bgcolor: "white", boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              py: 3,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              Parent Assistant
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left side - Main content */}
            <Grid
              size={{
                xs: 12,
                lg: 8,
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 3 }}
                textAlign={{ xs: "center", lg: "left" }}
              >
                <Box component="span" color="primary.main">
                  Smart email assistant{" "}
                </Box>
                for busy parents
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontSize: "1.25rem" }}
                textAlign={{ xs: "center", lg: "left" }}
              >
                Never miss important emails from schools, activities, or events
                again. Parent Assistant automatically organizes emails, creates
                calendar events, and translates content to keep you informed.
              </Typography>
            </Grid>

            {/* Right side - CTA buttons */}
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Box sx={{ width: "100%", maxWidth: 300 }}>
                  <Link href="/auth" style={{ textDecoration: "none" }}>
                    <Button size="lg" fullWidth>
                      Continue with Google
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box component="section" id="features" sx={{ py: 10, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 2 }}
            >
              Everything You Need to Stay Organized
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful automation tools designed specifically for busy parents
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 4,
                }}
                key={feature.id}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  iconColor={feature.iconColor}
                  iconBgColor={feature.iconBgColor}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        component="section"
        id="how-it-works"
        sx={{ py: 10, bgcolor: "grey.50" }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 2 }}
            >
              How It Works
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get set up in minutes and start automating your children&apos;s
              communications from all sources
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {howItWorks.map((step) => (
              <HowItWorksCard
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                iconColor={step.iconColor}
              />
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ bgcolor: "grey.900", color: "white", py: 4 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ mb: { xs: 2, md: 0 } }}>
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
                Parent Assistant
              </Typography>
              <Typography variant="body2" color="grey.400">
                Smart email assistant for busy parents.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                component="a"
                href="#features"
                sx={{
                  color: "grey.400",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Features
              </Typography>
              <Typography
                component="a"
                href="#how-it-works"
                sx={{
                  color: "grey.400",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                How It Works
              </Typography>
              <Typography
                component="a"
                href="#"
                sx={{
                  color: "grey.400",
                  textDecoration: "none",
                  "&:hover": { color: "white" },
                }}
              >
                Privacy Policy
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: 1,
              borderColor: "grey.800",
              pt: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="grey.400">
              &copy; 2024 Parent Assistant. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

const HowItWorksCard = ({
  step,
  title,
  description,
  iconColor,
}: {
  step: number;
  title: string;
  description: string;
  iconColor: string;
}) => {
  return (
    <Grid
      size={{
        xs: 12,
        sm: 6,
        md: 3,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color={iconColor}>
            {step}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="semibold" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};
