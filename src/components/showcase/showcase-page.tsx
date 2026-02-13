import { BriefKitLogo } from "@/components/ui/briefkit-logo";
import { IconAiAdvisor, IconDocuments, IconDownload } from "@/components/ui/icons";
import { DemoAnimation } from "./demo-animation";
import { StageWalkthrough } from "./stage-walkthrough";
import { ExampleArtifacts } from "./example-artifacts";
import { DemoRequestForm } from "./demo-request-form";
import { ErrorBanner } from "./error-banner";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface ShowcasePageProps {
  error?: string;
}

export function ShowcasePage({ error }: ShowcasePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Error banner (if redirected from an expired/invalid token) */}
      {error && <ErrorBanner error={error} />}

      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Hero section */}
      <section className="pb-12 pt-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <BriefKitLogo size={72} className="mx-auto mb-6" />
          <h1 className="font-display text-4xl text-foreground">BriefKit</h1>
          <p className="mt-2 text-lg font-medium italic text-foreground/80">
            Your brief, fully equipped.
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Describe your project. Download your docs. No guesswork. No busy
            work. Nothing missed.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconAiAdvisor size={18} className="text-primary" />
              <span>AI-guided conversation</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconDocuments size={18} />
              <span>~15 project artifacts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconDownload size={18} className="text-primary" />
              <span>.docx &amp; .xlsx export</span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated demo loop */}
      <DemoAnimation />

      {/* 6-stage walkthrough */}
      <StageWalkthrough />

      {/* Example artifacts */}
      <ExampleArtifacts />

      {/* Demo request form */}
      <DemoRequestForm />

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        Built by Josh &middot; Powered by Claude
      </footer>
    </div>
  );
}
