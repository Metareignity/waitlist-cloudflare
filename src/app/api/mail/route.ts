import { Resend } from "resend";
import { type NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(2, "1 m"),
});

function getWelcomeEmailHtml(userFirstname: string) {
	const currentYear = new Date().getFullYear();
	return `
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Waitly</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700&display=swap');
  </style>
</head>
<body style="background-color:#09090B;padding-top:40px;padding-bottom:40px;font-family:'Inter Tight', sans-serif;margin:0;">
  <div style="background-color:#18181B;border-radius:8px;margin:0 auto;padding:32px;max-width:600px;box-sizing:border-box;">
    <div style="margin-top:16px;text-align:center;">
      <h1 style="font-size:28px;font-weight:bold;color:#ffffff;margin:0;">
        Welcome to <span style="color:#DFFF1A;">Waitly</span>
      </h1>
      <p style="font-size:18px;color:#A1A1AA;margin-top:16px;margin-bottom:16px;">
        We're thrilled to have you join our waitlist
      </p>
      <hr style="border:1px solid #27272A;margin-top:16px;margin-bottom:16px;width:80px;margin-left:auto;margin-right:auto;" />
    </div>

    <div>
      <p style="font-size:16px;line-height:24px;color:#ffffff;margin-top:32px;">
        Hi ${userFirstname},
      </p>
      <p style="font-size:16px;line-height:24px;color:#E4E4E7;">
        Thanks for joining the waitlist for our Next.js + Notion CMS template! We're a small team at Idee8 working to help businesses like yours grow online, and we couldn't be more excited to have you with us.
      </p>
      <p style="font-size:16px;line-height:24px;color:#E4E4E7;">
        I'll personally keep you updated on our progress and let you know the moment it's ready for you. Got questions or ideas in the meantime? Just hit reply – I read every email and would love to hear from you.
      </p>
      <div style="margin-top:32px;margin-bottom:32px;text-align:center;">
        <a href="https://cal.com/idee8/quick-chat" style="background-color:#DFFF1A;color:#09090B;font-weight:bold;padding:12px 24px;border-radius:12px;text-decoration:none;display:inline-flex;align-items:center;box-sizing:border-box;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right:8px;">
            <title>Calendar</title>
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 14H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 14H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 18H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 18H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Book a call
        </a>
      </div>
      <p style="font-size:16px;line-height:24px;color:#E4E4E7;">
        Want to see what we're up to? Follow us at <a href="https://twitter.com/Idee8Agency" style="color:#DFFF1A;text-decoration:underline;">@Idee8Agency</a> for behind-the-scenes updates and early previews.
      </p>
      <p style="font-size:16px;line-height:24px;color:#E4E4E7;margin-top:24px;">
        Cheers,
      </p>
      <p style="font-size:16px;font-weight:bold;color:#ffffff;margin-bottom:32px;">
        The Idee8 Team
      </p>
    </div>

    <hr style="border:1px solid #27272A;margin-top:24px;margin-bottom:24px;" />

    <div>
      <p style="font-size:12px;color:#71717A;text-align:center;margin:0;">
        &copy; ${currentYear} Idee8 Agency. All rights reserved.
      </p>
      <p style="font-size:12px;color:#71717A;text-align:center;margin:0;">
        123 Digital Avenue, Suite 101, Kigali, Rwanda
      </p>
      <p style="font-size:12px;color:#71717A;text-align:center;margin-top:16px;">
        <a href="https://idee8.com/unsubscribe" style="color:#DFFF1A;">Unsubscribe</a>
        &bull;
        <a href="https://idee8.com/privacy" style="color:#DFFF1A;">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
	`.trim();
}

export async function POST(request: NextRequest) {
	let ip: string;
	const xForwardedForHeader = request.headers.get("x-forwarded-for");

	if (xForwardedForHeader) {
		ip = xForwardedForHeader.split(",")[0].trim();
	} else {
		ip = request.headers.get("x-real-ip")?.trim() ?? "127.0.0.1";
	}

	const result = await ratelimit.limit(ip);

	if (!result.success) {
		return NextResponse.json({ error: "Too many requests!" }, { status: 429 });
	}

	const { email, name } = await request.json();

	const { data, error } = await resend.emails.send({
		from: process.env.RESEND_FROM_EMAIL || "",
		to: [email],
		subject: "Welcome to Next.js + Notion CMS Waitlist",
		html: getWelcomeEmailHtml(name),
	});

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!data) {
		return NextResponse.json(
			{ error: "Failed to send email" },
			{ status: 500 },
		);
	}

	return NextResponse.json(
		{ message: "Email sent successfully" },
		{ status: 200 },
	);
}
