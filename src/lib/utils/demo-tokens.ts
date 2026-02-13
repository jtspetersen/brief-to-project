/**
 * Demo token file utilities.
 *
 * Reads and writes demo tokens from a JSON file on disk.
 * Server-side only — uses Node.js fs/promises.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { dirname } from "path";
import type { DemoToken, DemoTokenStore } from "@/lib/types/demo-tokens";

/** Resolve the path to the tokens JSON file */
function getTokensPath(): string {
  return process.env.DEMO_TOKENS_PATH || "./data/demo-tokens.json";
}

/** Read all tokens from the JSON file. Returns empty array if file doesn't exist. */
export async function readTokens(): Promise<DemoToken[]> {
  const filePath = getTokensPath();

  if (!existsSync(filePath)) {
    return [];
  }

  const raw = await readFile(filePath, "utf-8");
  const store: DemoTokenStore = JSON.parse(raw);
  return store.tokens ?? [];
}

/** Write the full token list back to the JSON file. Creates directory if needed. */
export async function writeTokens(tokens: DemoToken[]): Promise<void> {
  const filePath = getTokensPath();
  const dir = dirname(filePath);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const store: DemoTokenStore = { tokens };
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf-8");
}

/** Look up a single token by its ID string. Returns undefined if not found. */
export async function getToken(tokenId: string): Promise<DemoToken | undefined> {
  const tokens = await readTokens();
  return tokens.find((t) => t.token === tokenId);
}

/**
 * Check whether a token is currently valid for starting a session.
 * A token is valid when: status is "active", not expired, and sessions remaining.
 */
export function isTokenValid(token: DemoToken): boolean {
  if (token.status !== "active") return false;
  if (new Date(token.expiresAt) <= new Date()) return false;
  if (token.sessionsUsed >= token.maxSessions) return false;
  return true;
}

/**
 * Increment the sessionsUsed counter for a token.
 * Also updates status to "used" if all sessions are consumed.
 * Returns the updated token, or undefined if token not found.
 */
export async function incrementSession(tokenId: string): Promise<DemoToken | undefined> {
  const tokens = await readTokens();
  const token = tokens.find((t) => t.token === tokenId);

  if (!token) return undefined;

  token.sessionsUsed += 1;

  if (token.sessionsUsed >= token.maxSessions) {
    token.status = "used";
  }

  await writeTokens(tokens);
  return token;
}

/**
 * Revoke a token by setting its status to "expired".
 * Returns true if found and revoked, false if not found.
 */
export async function revokeToken(tokenId: string): Promise<boolean> {
  const tokens = await readTokens();
  const token = tokens.find((t) => t.token === tokenId);

  if (!token) return false;

  token.status = "expired";
  await writeTokens(tokens);
  return true;
}
