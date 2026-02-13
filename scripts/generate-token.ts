/**
 * CLI script to generate a new demo access token.
 *
 * Usage:
 *   npx tsx scripts/generate-token.ts --label "Sarah at Acme Corp" --expires 48h --sessions 2
 *
 * Options:
 *   --label     (required) Human-readable note for who you're sending this to
 *   --expires   (optional) Expiration time from now: 24h, 48h, 72h, 7d (default: 48h)
 *   --sessions  (optional) Max sessions allowed (default: 2)
 */

import { randomBytes } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { dirname } from "path";
import type { DemoToken, DemoTokenStore } from "../src/lib/types/demo-tokens";

const TOKENS_PATH = process.env.DEMO_TOKENS_PATH || "./data/demo-tokens.json";
const BASE_URL = process.env.DEMO_BASE_URL || "http://localhost:3001";

/** Parse --flag value pairs from process.argv */
function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--") && i + 1 < argv.length) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1];
      i++; // skip the value
    }
  }

  return args;
}

/** Convert a duration string like "48h" or "7d" into milliseconds */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(h|d)$/);
  if (!match) {
    console.error(`Invalid duration: "${duration}". Use format like 24h, 48h, 72h, or 7d.`);
    process.exit(1);
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  if (unit === "h") return amount * 60 * 60 * 1000;
  if (unit === "d") return amount * 24 * 60 * 60 * 1000;
  return 0;
}

/** Generate a URL-safe random token string (10 characters) */
function generateTokenId(): string {
  return randomBytes(8).toString("base64url").slice(0, 10);
}

async function readTokens(): Promise<DemoToken[]> {
  if (!existsSync(TOKENS_PATH)) return [];
  const raw = await readFile(TOKENS_PATH, "utf-8");
  const store: DemoTokenStore = JSON.parse(raw);
  return store.tokens ?? [];
}

async function writeTokens(tokens: DemoToken[]): Promise<void> {
  const dir = dirname(TOKENS_PATH);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  const store: DemoTokenStore = { tokens };
  await writeFile(TOKENS_PATH, JSON.stringify(store, null, 2), "utf-8");
}

async function main() {
  const args = parseArgs();

  if (!args.label) {
    console.error("Error: --label is required.");
    console.error('Usage: npx tsx scripts/generate-token.ts --label "Sarah at Acme Corp"');
    process.exit(1);
  }

  const label = args.label;
  const expires = args.expires || "48h";
  const maxSessions = parseInt(args.sessions || "2", 10);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + parseDuration(expires));
  const tokenId = generateTokenId();

  const token: DemoToken = {
    token: tokenId,
    label,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    maxSessions,
    sessionsUsed: 0,
    status: "active",
  };

  const tokens = await readTokens();
  tokens.push(token);
  await writeTokens(tokens);

  const demoUrl = `${BASE_URL}/demo/${tokenId}`;

  console.log("");
  console.log(`  Token generated: ${tokenId}`);
  console.log("");
  console.log(`  Label:        ${label}`);
  console.log(`  Expires:      ${expiresAt.toISOString()} (in ${expires})`);
  console.log(`  Max sessions: ${maxSessions}`);
  console.log("");
  console.log(`  Demo URL: ${demoUrl}`);
  console.log("");
  console.log("  Copy this URL and send it to your recipient.");
  console.log("");
}

main().catch((err) => {
  console.error("Failed to generate token:", err);
  process.exit(1);
});
