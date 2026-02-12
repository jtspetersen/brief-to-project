import { AppShell } from "@/components/layout/app-shell";
import { PasswordGate } from "@/components/auth/password-gate";

export default function Home() {
  return (
    <PasswordGate>
      <AppShell />
    </PasswordGate>
  );
}
