import type { NextFetchEvent, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

const authProxy = withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authProxy(request as NextRequestWithAuth, event);
}

export const config = {
  matcher: [
    "/today/:path*",
    "/discover/:path*",
    "/ratings/:path*",
    "/onboarding/:path*",
    "/profile/:path*",
  ],
};
