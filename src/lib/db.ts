import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDb() {
  try {
    const context = getCloudflareContext();
    return context.env.DB;
  } catch (error) {
    console.error("Failed to get Cloudflare context/DB:", error);
    throw new Error("Cloudflare D1 Database is not available. Ensure you are running in a Cloudflare Worker environment.");
  }
}

export interface WaitlistEntry {
  id: number;
  email: string;
  name: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
}

export async function getD1RowCount(): Promise<number> {
  const db = getDb();
  const result = await db
    .prepare("SELECT COUNT(*) as count FROM waitlist")
    .first<{ count: number }>();
  return result?.count ?? 0;
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .prepare("SELECT 1 FROM waitlist WHERE email = ?")
    .bind(email)
    .first();
  return !!result;
}

export async function getUserByReferralCode(code: string): Promise<WaitlistEntry | null> {
  const db = getDb();
  const result = await db
    .prepare("SELECT * FROM waitlist WHERE referral_code = ?")
    .bind(code)
    .first<WaitlistEntry>();
  return result || null;
}

export async function insertWaitlistUser(
  email: string,
  name: string | null,
  referralCode: string,
  referredBy: string | null
): Promise<void> {
  const db = getDb();
  await db
    .prepare(
      "INSERT INTO waitlist (email, name, referral_code, referred_by) VALUES (?, ?, ?, ?)"
    )
    .bind(email, name, referralCode, referredBy)
    .run();
}

export interface RateLimitRow {
  ip: string;
  request_count: number;
  last_request_at: number;
}

export async function isRateLimited(
  ip: string,
  limit = 2,
  windowMs = 60000
): Promise<boolean> {
  const db = getDb();
  const now = Date.now();

  try {
    const row = await db
      .prepare("SELECT * FROM rate_limits WHERE ip = ?")
      .bind(ip)
      .first<RateLimitRow>();

    if (!row) {
      await db
        .prepare("INSERT INTO rate_limits (ip, request_count, last_request_at) VALUES (?, 1, ?)")
        .bind(ip, now)
        .run();
      return false;
    }

    const timePassed = now - row.last_request_at;
    if (timePassed < windowMs) {
      if (row.request_count >= limit) {
        return true;
      }
      await db
        .prepare("UPDATE rate_limits SET request_count = request_count + 1 WHERE ip = ?")
        .bind(ip)
        .run();
      return false;
    } else {
      await db
        .prepare("UPDATE rate_limits SET request_count = 1, last_request_at = ? WHERE ip = ?")
        .bind(now, ip)
        .run();
      return false;
    }
  } catch (error) {
    console.error("D1 Rate Limiting error:", error);
    // If rate limiting check fails, fail-open to not block legit users
    return false;
  }
}
