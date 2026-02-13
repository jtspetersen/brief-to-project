import { AppShell } from "@/components/layout/app-shell";
import { ShowcasePage } from "@/components/showcase/showcase-page";

interface HomeProps {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Root page (/).
 *
 * - Dev mode (NEXT_PUBLIC_DISABLE_AUTH=true): shows the live app directly
 * - Production: shows the showcase page (static landing)
 */
export default async function Home({ searchParams }: HomeProps) {
  // Dev mode bypass — show the live app directly
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return <AppShell />;
  }

  const params = await searchParams;
  return <ShowcasePage error={params.error} />;
}
