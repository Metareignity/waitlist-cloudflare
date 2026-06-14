import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

// Notion database ID for the waitlist entries
export const NOTION_DB_ID = process.env.NOTION_DB_ID || "";

