import { NextResponse } from "next/server";
import { notion, NOTION_DB_ID } from "~/lib/notion";
import { generateCode } from "~/lib/utils";
import { checkEmailExists, insertWaitlistUser } from "~/lib/db";

export async function POST(request: Request) {
  try {
    const { email, firstname, referredBy } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Check for duplicate email in D1 first
    let isDuplicate = false;
    try {
      isDuplicate = await checkEmailExists(email);
    } catch (d1Error) {
      console.error("D1 duplicate check error:", d1Error);
      // Fallback to Notion duplicate check if D1 is unavailable but Notion is configured
      if (NOTION_DB_ID && notion) {
        try {
          const existing = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
              property: "Email",
              email: { equals: email },
            },
          });
          isDuplicate = existing.results.length > 0;
        } catch (notionError) {
          console.error("Notion duplicate check fallback error:", notionError);
        }
      }
    }

    if (isDuplicate) {
      return NextResponse.json(
        { error: "You're already on the waitlist!" },
        { status: 409 }
      );
    }

    // 2. Generate unique referral code
    const code = generateCode();

    // 3. Save to D1
    let d1Saved = false;
    try {
      await insertWaitlistUser(
        email,
        firstname || email.split("@")[0],
        code,
        referredBy || null
      );
      d1Saved = true;
    } catch (d1Error) {
      console.error("Failed to save to D1:", d1Error);
    }

    // 4. Optionally save to Notion if credentials exist
    let notionPageId: string | null = null;
    if (NOTION_DB_ID && process.env.NOTION_SECRET) {
      try {
        // Find referrer in Notion by matching Referral Code
        let referrerPageId: string | null = null;
        if (referredBy) {
          const results = await notion.databases.query({
            database_id: NOTION_DB_ID,
            filter: {
              property: "Referral Code",
              rich_text: { equals: referredBy },
            },
          });

          if (results.results.length > 0) {
            referrerPageId = results.results[0].id;
          }
        }

        // Create new Notion entry
        const page = await notion.pages.create({
          parent: { database_id: NOTION_DB_ID },
          properties: {
            Name: {
              title: [{ text: { content: firstname || email.split("@")[0] } }],
            },
            Email: { email },
            "Referral Code": {
              rich_text: [{ text: { content: code } }],
            },
            "Referred By": referredBy
              ? { rich_text: [{ text: { content: referredBy } }] }
              : { rich_text: [] },
            Referrer: referrerPageId
              ? { relation: [{ id: referrerPageId }] }
              : { relation: [] },
          },
        });
        notionPageId = page.id;
      } catch (notionError) {
        console.error("Failed to sync to Notion:", notionError);
        // If D1 also failed, throw to catch and report error
        if (!d1Saved) {
          throw new Error("Both D1 and Notion database operations failed.");
        }
      }
    } else if (!d1Saved) {
      // Notion is not configured and D1 failed
      throw new Error("Failed to save to D1 database.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Added to waitlist",
        code, // ← Used in form to generate share link
        notionId: notionPageId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Waitlist API error:", error.message);
      
      return NextResponse.json(
        {
          error: "Failed to save waitlist sign-up",
          details: error.message,
          success: false,
        },
        { status: 500 }
      );
    }
  }
}
