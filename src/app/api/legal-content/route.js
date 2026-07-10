import { NextResponse } from "next/server";
import Shopify from "@/shopify";

const CONTACT_PAGE_ID = "gid://shopify/Page/151623631136";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  const content =
    handle === "contact"
      ? await Shopify.getPage(CONTACT_PAGE_ID)
      : await Shopify.getPolicy(handle);

  if (!content) {
    return NextResponse.json(
      { error: "Sorry, we couldn't find that page." },
      { status: 404 },
    );
  }

  return NextResponse.json({ title: content.title, body: content.body });
}
