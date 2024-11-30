import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const cookies = request.cookies.get("next-auth.session-token");
  const url = request.nextUrl.pathname;
  // Retrieve the JWT from the incoming request
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const roles = {
    admin: ["/product", "/login", "/register"],
    user: ["/product", "/login", "/register"],
  };

  if (!cookies) {
    // Redirect to the sign-in page if the token is missing
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  // Allow the request to proceed if the token exists
  return NextResponse.next();
}

export const config = {
  matcher: ["/product"],
};
