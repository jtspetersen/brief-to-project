import { AppShell } from "@/components/layout/app-shell";

/**
 * /app — The live BriefKit application.
 *
 * Protected by middleware (requires a valid demo session cookie).
 * In dev mode (NEXT_PUBLIC_DISABLE_AUTH=true), middleware is bypassed.
 */
export default function AppPage() {
  return <AppShell />;
}
