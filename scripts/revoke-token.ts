/**
 * CLI script to revoke a demo access token.
 *
 * Usage:
 *   npx tsx scripts/revoke-token.ts <token-id>
 *
 * Example:
 *   npx tsx scripts/revoke-token.ts a1b2c3d4e5
 */

import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import type { DemoToken, DemoTokenStore } from "../src/lib/types/demo-tokens";

const TOKENS_PATH = process.env.DEMO_TOKENS_PATH || "./data/demo-tokens.json";

async function readTokens(): Promise<DemoToken[]> {
  if (!existsSync(TOKENS_PATH)) return [];
  const raw = await readFile(TOKENS_PATH, "utf-8");
  const store: DemoTokenStore = JSON.parse(raw);
  return store.tokens ?? [];
}

async function writeTokens(tokens: DemoToken[]): Promise<void> {
  const store: DemoTokenStore = { tokens };
  await writeFile(TOKENS_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function main() {
  const tokenId = process.argv[2];

  if (!tokenId) {
    console.error("Error: Please provide a token ID to revoke.");
    console.error("Usage: npx tsx scripts/revoke-token.ts <token-id>");
    process.exit(1);
  }

  const tokens = await readTokens();
  const token = tokens.find((t) => t.token === tokenId);

  if (!token) {
    console.error(`\n  Token "${tokenId}" not found.\n`);
    console.error("  Run `npx tsx scripts/list-tokens.ts` to see all tokens.");
    process.exit(1);
  }

  if (token.status === "expired") {
    console.log(`\n  Token "${tokenId}" ("${token.label}") is already expired.\n`);
    return;
  }

  const previousStatus = token.status;
  token.status = "expired";
  await writeTokens(tokens);

  console.log(`\n  Token ${tokenId} ("${token.label}") has been revoked.`);
  console.log(`  Status changed from "${previousStatus}" to "expired".\n`);
}

main().catch((err) => {
  console.error("Failed to revoke token:", err);
  process.exit(1);
});
