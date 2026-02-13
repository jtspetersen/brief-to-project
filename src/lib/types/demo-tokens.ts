/** Possible statuses for a demo token */
export type DemoTokenStatus = "active" | "used" | "expired";

/** A single demo access token */
export interface DemoToken {
  /** URL-safe random string (10 characters) */
  token: string;
  /** Human-readable note, e.g. "Sent to Sarah at Acme Corp" */
  label: string;
  /** ISO timestamp when this token was created */
  createdAt: string;
  /** ISO timestamp when this token expires */
  expiresAt: string;
  /** Maximum number of full sessions allowed */
  maxSessions: number;
  /** How many sessions have been started with this token */
  sessionsUsed: number;
  /** Current status of the token */
  status: DemoTokenStatus;
}

/** Shape of the demo-tokens.json file on disk */
export interface DemoTokenStore {
  tokens: DemoToken[];
}
