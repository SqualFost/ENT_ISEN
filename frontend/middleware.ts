import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // Si aucun token, redirection vers login
    const urlLogin = new URL("/login", request.url);
    return NextResponse.redirect(urlLogin);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
