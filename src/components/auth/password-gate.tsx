"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";

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
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 px-4">
        {/* Logo / Title */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Brief-to-Project</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the demo password to continue
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
