import { NextResponse } from "next/server";
import { isLive } from "@/utils";

export function middleware(request) {
  const response = NextResponse.next();

  if (isLive()) {
    return response;
  }

  const password = request.nextUrl.searchParams.get("password");

  if (password) {
    response.cookies.set("password", password);

    if (Buffer.from(password, "base64").toString() === process.env.PASSWORD) {
      response.cookies.set("password", password);
      return response;
    } else {
      request.cookies.delete("password");
      return NextResponse.redirect(new URL("/password", request.url));
    }
  }

  const cookie = request.cookies.get("password");

  if (
    cookie &&
    cookie.value &&
    Buffer.from(cookie.value, "base64").toString() === process.env.PASSWORD
  ) {
    return response;
  }

  request.cookies.delete("password");
  return NextResponse.redirect(new URL("/password", request.url));
}

export const config = {
  matcher: [
    "/",
    "/shop",
    "/products",
    "/products/:path*",
    "/collections/:path*",
  ],
};
