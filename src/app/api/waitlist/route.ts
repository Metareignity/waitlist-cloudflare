import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { type NextRequest, NextResponse } from "next/server";
import { checkEmailExists, insertWaitlistUser } from "~/lib/db";
import { generateCode } from "~/lib/utils";

let ratelimit: Ratelimit | null = null;

function getRateLimiter() {
	if (ratelimit) return ratelimit;

	try {
		const context = getCloudflareContext();
		const redisUrl = process.env.UPSTASH_REDIS_REST_URL || context.env.UPSTASH_REDIS_REST_URL;
		const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || context.env.UPSTASH_REDIS_REST_TOKEN;

		if (!redisUrl || !redisToken) {
			console.warn("Upstash Redis credentials are not configured. Rate limiting is disabled.");
			return null;
		}

		const redis = new Redis({
			url: redisUrl,
			token: redisToken,
		});

		ratelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(2, "1 m"),
		});

		return ratelimit;
	} catch (error) {
		console.warn("Failed to initialize Upstash Redis rate limiter:", error);
		return null;
	}
}

export async function POST(request: NextRequest) {
	try {
		const { email, firstname, referredBy } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 },
			);
		}

		// 1. Rate Limiting
		const limiter = getRateLimiter();
		if (limiter) {
			let ip: string;
			const xForwardedForHeader = request.headers.get("x-forwarded-for");
			if (xForwardedForHeader) {
				ip = xForwardedForHeader.split(",")[0].trim();
			} else {
				ip = request.headers.get("x-real-ip")?.trim() ?? "127.0.0.1";
			}

			const result = await limiter.limit(ip);
			if (!result.success) {
				return NextResponse.json(
					{ error: "Too many requests! Please try again in a minute." },
					{ status: 429 },
				);
			}
		}

		// 2. Check for duplicate email in D1
		const isDuplicate = await checkEmailExists(email);
		if (isDuplicate) {
			return NextResponse.json(
				{ error: "You're already on the waitlist!" },
				{ status: 409 },
			);
		}

		// 3. Generate unique referral code
		const code = generateCode();

		// 4. Save to D1
		await insertWaitlistUser(
			email,
			firstname || email.split("@")[0],
			code,
			referredBy || null,
		);

		return NextResponse.json(
			{
				success: true,
				message: "Added to waitlist",
				code,
			},
			{ status: 200 },
		);
	} catch (error: unknown) {
		console.error("Waitlist registration error:", error);
		const msg = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json(
			{
				error: "Failed to save waitlist sign-up",
				details: msg,
				success: false,
			},
			{ status: 500 },
		);
	}
}
