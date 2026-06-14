import { LandingPage } from "./page.client";
import { connection } from "next/server";
import { getD1RowCount } from "~/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connection(); // forces the page to be dynamically rendered

  let waitlistPeople = 0;
  try {
    waitlistPeople = await getD1RowCount();
  } catch (d1Error) {
    console.error("D1 failed to get row count:", d1Error);
  }

  return <LandingPage waitlistPeople={waitlistPeople} />;
}
