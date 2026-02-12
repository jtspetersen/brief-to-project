"use client";

import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { BriefKitLogo } from "@/components/ui/briefkit-logo";

const SESSION_KEY = "btp-auth";

interface PasswordGateProps {
  children: ReactNode;
}

/**
 * Wraps the app content and requires a password before showing it.
 * Once authenticated, stores a flag in sessionStorage so the user
 * doesn't have to re-enter the password on every page refresh
 * (but will need to for a new browser tab/session).
 */
export function PasswordGate({ children }: PasswordGateProps) {
  // Start as false to avoid hydration mismatch — sessionStorage is client-only
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check sessionStorage after mount (client-side only)
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthenticated(true);
    }
    setChecked(true);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        setAuthenticated(true);
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until we've checked sessionStorage to avoid flash
  if (!checked) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        {/* Logo / Title */}
        <div className="text-center">
          <div className="mx-auto mb-4">
            <BriefKitLogo size={64} className="mx-auto" />
          </div>
          <h1 className="font-display text-3xl">BriefKit</h1>
          <p className="mt-2 text-sm font-medium italic text-foreground/80">
            Your brief, fully equipped.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            A conversational AI app that takes your project idea and builds it
            into a complete, downloadable documentation package.
          </p>
        </div>

        {/* Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            autoFocus
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !password.trim()}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
