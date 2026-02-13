/**
 * CLI script to list all demo access tokens.
 *
 * Usage:
 *   npx tsx scripts/list-tokens.ts
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import type { DemoToken, DemoTokenStore } from "../src/lib/types/demo-tokens";

const TOKENS_PATH = process.env.DEMO_TOKENS_PATH || "./data/demo-tokens.json";
const BASE_URL = process.env.DEMO_BASE_URL || "http://localhost:3001";

async function readTokens(): Promise<DemoToken[]> {
  if (!existsSync(TOKENS_PATH)) return [];
  const raw = await readFile(TOKENS_PATH, "utf-8");
  const store: DemoTokenStore = JSON.parse(raw);
  return store.tokens ?? [];
}

/** Determine effective status (check expiry even if status says "active") */
function effectiveStatus(token: DemoToken): string {
  if (token.status === "expired") return "expired";
  if (token.status === "used") return "used";
  if (new Date(token.expiresAt) <= new Date()) return "expired";
  if (token.sessionsUsed >= token.maxSessions) return "used";
  return "active";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function main() {
  const tokens = await readTokens();

  if (tokens.length === 0) {
    console.log("\n  No demo tokens found.\n");
    console.log('  Generate one with: npx tsx scripts/generate-token.ts --label "Name"');
    console.log("");
    return;
  }

  console.log(`\n  Demo Tokens (${tokens.length} total)`);
  console.log("  " + "─".repeat(76));
  console.log(
    "  " +
      "Token".padEnd(14) +
      "Label".padEnd(28) +
      "Status".padEnd(10) +
      "Sessions".padEnd(12) +
      "Expires"
  );
  console.log("  " + "─".repeat(76));

  for (const token of tokens) {
    const status = effectiveStatus(token);
    const sessions = `${token.sessionsUsed}/${token.maxSessions}`;
    const label = token.label.length > 26 ? token.label.slice(0, 24) + ".." : token.label;
    const url = `${BASE_URL}/demo/${token.token}`;

    console.log(
      "  " +
        token.token.padEnd(14) +
        label.padEnd(28) +
        status.padEnd(10) +
        sessions.padEnd(12) +
        formatDate(token.expiresAt)
    );
    console.log("  " + " ".repeat(14) + `URL: ${url}`);
  }

  console.log("  " + "─".repeat(76));
  console.log("");
}

main().catch((err) => {
  console.error("Failed to list tokens:", err);
  process.exit(1);
});
