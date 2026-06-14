import { type NextRequest, NextResponse } from "next/server";
import { checkEmailExists, insertWaitlistUser, isRateLimited } from "~/lib/db";
import { generateCode } from "~/lib/utils";

export async function POST(request: NextRequest) {
	try {
		const { email, firstname, referredBy } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 },
			);
		}

		// 1. Rate Limiting (Native Cloudflare D1 Rate Limiter)
		let ip: string;
		const xForwardedForHeader = request.headers.get("x-forwarded-for");
		if (xForwardedForHeader) {
			ip = xForwardedForHeader.split(",")[0].trim();
		} else {
			ip = request.headers.get("x-real-ip")?.trim() ?? "127.0.0.1";
		}

		const rateLimitHit = await isRateLimited(ip);
		if (rateLimitHit) {
			return NextResponse.json(
				{ error: "Too many requests! Please try again in a minute." },
				{ status: 429 },
			);
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
