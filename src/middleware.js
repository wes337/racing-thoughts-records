import { NextResponse } from "next/server";
import { isLive } from "@/utils";

export function middleware(request) {
  const password = request.nextUrl.searchParams.get("password");
  const cookie = request.cookies.get("password");

  if (
    (password &&
      Buffer.from(password, "base64").toString() === process.env.PASSWORD) ||
    (cookie && cookie.value === process.env.PASSWORD)
  ) {
    const response = NextResponse.next();
    response.cookies.set("password", process.env.PASSWORD);
    return response;
  }

  if (!isLive()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/products", "/products/:path*", "/collections/:path*"],
};
