import { Mail, Calendar, Globe, Shield, Zap, Users } from "lucide-react";

export interface Feature {
  id: string;
  icon: typeof Mail;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
}

export const features: Feature[] = [
  {
    id: "email-organization",
    icon: Mail,
    title: "Smart Email Organization",
    description:
      "Automatically create Gmail labels and filters for each child's communications from schools, activities, and more",
    iconColor: "primary.main",
    iconBgColor: "primary.lighter",
  },
  {
    id: "calendar-integration",
    icon: Calendar,
    title: "Calendar Integration",
    description:
      "Convert emails into calendar events with proper timing and reminders",
    iconColor: "success.main",
    iconBgColor: "success.lighter",
  },
  {
    id: "multi-language",
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Translate emails and events to your preferred language automatically",
    iconColor: "secondary.main",
    iconBgColor: "secondary.lighter",
  },
  {
    id: "secure-private",
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared with third parties",
    iconColor: "error.main",
    iconBgColor: "error.lighter",
  },
  {
    id: "real-time-processing",
    icon: Zap,
    title: "Real-time Processing",
    description: "Get instant notifications and updates as emails arrive",
    iconColor: "warning.main",
    iconBgColor: "warning.lighter",
  },
  {
    id: "family-management",
    icon: Users,
    title: "Family Management",
    description:
      "Manage multiple children's communications from schools, activities, and organizations from one dashboard",
    iconColor: "info.main",
    iconBgColor: "info.lighter",
  },
];
