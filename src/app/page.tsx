import { LandingPage } from "./page.client";
import { connection } from "next/server";
import { getNotionDatabaseRowCount } from "~/lib/utils";
import { getD1RowCount } from "~/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connection(); // forces the page to be dynamically rendered

  let waitlistPeople = 0;
  try {
    waitlistPeople = await getD1RowCount();
  } catch (d1Error) {
    console.error("D1 failed to get row count, falling back to Notion:", d1Error);
    if (process.env.NOTION_DB_ID && process.env.NOTION_SECRET) {
      try {
        waitlistPeople = await getNotionDatabaseRowCount(process.env.NOTION_DB_ID);
      } catch (notionError) {
        console.error("Notion fallback failed:", notionError);
      }
    }
  }

  return <LandingPage waitlistPeople={waitlistPeople} />;
}
