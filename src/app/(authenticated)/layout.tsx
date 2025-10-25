import { ClientAuthWrapper } from "@/components/ClientAuthWrapper";

export default function AuthenticatedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAuthWrapper>{children}</ClientAuthWrapper>;
}
