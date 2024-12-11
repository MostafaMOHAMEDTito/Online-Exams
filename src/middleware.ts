import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const cookies = request.cookies.get("next-auth.session-token");

  // Allow public routes like /register
  if (url === "/register" || url === "/login") {
    return NextResponse.next();
  }

  // Retrieve the JWT from the incoming request
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!cookies || !token) {
    // Redirect to the sign-in page if the token is missing
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed if the token exists
  return NextResponse.next();
}

export const config = {
  matcher: ["/product"], // Define paths the middleware applies to
};
